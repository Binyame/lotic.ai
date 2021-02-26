#!/usr/bin/env ts-node-script
import fs from 'fs';

// NOTE: Must be before any local module imports
if (process.env.NODE_ENV !== 'production') {
  require('dotenv-safe').config({
    allowEmptyValues: true,
  });
}

import hashids from '../services/hashids';
import db from '../models';
import { importAssessments as _importAssessments } from './importAssessments';
import { importContent as _importContent } from './importContent';

async function clearDB() {
  console.log('Clearing existing records ....');

  const keys = [
    'PatientAssessment',
    'AssessmentPrompt',
    'PatientReview',
    'Assessment',
    'Prompt',
    'Review',
    'SignalQuestion',
  ];

  for (const key of keys) {
    console.log(`Deleting all [${key}]`);
    await db[key].truncate({ cascade: true });
  }
}

async function importAssessments() {
  console.log('Creating Lotic Assessments....');
  return _importAssessments();
}

async function importContent() {
  console.log('Creating Lotic Content....');
  return _importContent();
}

async function importReviews() {
  const defaultReviews = [
    {
      title: 'How Optimistic Are You?',
      signalQuestions: [
        {
          content: 'In the past two weeks, have you felt nervous or on edge?',
          type: 'boolean',
        },
        {
          content:
            'In the past two weeks, have you felt irritable or easily annoyed?',
          type: 'boolean',
        },
        {
          content: 'In the past two weeks,have you been feeling hopeless?',
          type: 'boolean',
        },
        {
          content: 'In the past two weeks, have you felt sad or overwhelemd?',
          type: 'boolean',
        },
        {
          content:
            'In the past two weeks, have you found it hard to enjoy the things you used to enjoy?',
          type: 'boolean',
        },
        { content: 'Do you feel optimistic about your future?', type: 'scale' },
      ],
    },
    {
      title: 'Focus and Concentration',
      signalQuestions: [
        {
          content:
            'In the past two weeks have you had a new symptom that you cannot explain?',
          type: 'boolean',
        },
        {
          content:
            'In the past two weeks have you been sleeping through the night?',
          type: 'boolean',
        },
        {
          content:
            'In the past two weeks, have you had bad dreams or nightmares?',
          type: 'boolean',
        },
        {
          content:
            'In the last two weeks, have you found it difficult to concentrate? ',
          type: 'boolean',
        },
        {
          content:
            'In the past two weeks have you had a positive outlook on life?',
          type: 'boolean',
        },
      ],
    },
    {
      title: 'Eating and Activity',
      signalQuestions: [
        { content: 'Do you feel you eat a healthy diet?', type: 'boolean' },
        { content: 'Do you have access to healthy foods?', type: 'boolean' },
        { content: 'Do you have seasonal allergies?', type: 'boolean' },
        { content: 'Do you use an activity tracker?', type: 'boolean' },
      ],
    },
  ];

  for (const r of defaultReviews) {
    console.log(`Creating Review: ${r.title}`);
    const review = await db.Review.create({
      title: r.title,
      ownerType: 'lotic',
      ownerId: 1,
    });

    for (const s of r.signalQuestions) {
      await db.SignalQuestion.create({
        reviewId: review.id,
        ...s,
      });
    }
  }
}

async function createProvider() {
  console.log('Creating Lotic Provider....');
  const provider = await db.HCProvider.create({ name: 'Lotic' });
  return provider;
}

async function createTerms() {
  console.log('Creating Sample Terms...');
  const content = fs.readFileSync('runbooks/terms.txt', 'utf-8');

  const patientTerms = await db.Agreement.create({
    type: 'term',
    name: 'Patient Terms',
    active: true,
    key: 'patient-terms',
    version: '1',
    content,
    // content: terms.content,
  });
  const clinicianTerms = await db.Agreement.create({
    type: 'term',
    name: 'Clinician Terms',
    active: true,
    key: 'clinician-terms',
    version: '1',
    content,
    // content: terms.content,
  });
  return [patientTerms, clinicianTerms];
}

async function updateUserPermissions() {
  console.log('Updating Patient Permissions....');
  const patients = await db.Patient.findAll();

  for (const p of patients) {
    console.log(`Setting permissions for patient: ${p.id} - ${p.providerId}`);
    await p.setStandardPermissions();
  }

  console.log('Updating Clinician Permissions....');
  const clinicians = await db.Clinician.findAll();

  for (const c of clinicians) {
    console.log(`Setting permissions for clinician: ${c.id} - ${c.providerId}`);
    await c.setStandardPermissions();
  }
}

async function bootstrap() {
  try {
    // Clear the database
    await clearDB();

    // Create Lotic Assessments and Reviews
    await importAssessments();
    await importReviews();

    // Create Lotic Terms
    await createTerms();

    // Import Content
    await importContent();

    // Update Patient & Clinician Permissions
    await updateUserPermissions();

    // Create a provider
    const provider = await createProvider();

    const hashId = hashids.encode(provider.id);
    console.log(`\n\n\nYou can register Clinicians at /register/${hashId}\n\n`);

    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

bootstrap();
