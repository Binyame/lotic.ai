import moment from 'moment';
import faker from 'faker';
import { times } from 'lodash';
import fs from 'fs';

// NOTE: Must be before any local module imports
require('dotenv-safe').config({
  allowEmptyValues: true,
});

import hashids from './services/hashids';
import db from './models';
import { importAssessments as _importAssessments } from './runbooks/importAssessments';
import { importContent as _importContent } from './runbooks/importContent';
import UserService from './services/user';

async function clearDB() {
  console.log('Clearing PostGres with sync({ force: true }) ....');
  await db.sequelize.sync({ force: true });

  await Promise.all(
    Object.keys(db).map((key) => {
      if (['sequelize', 'Sequelize'].includes(key)) {
        return null;
      }

      console.log(`Deleting all [${key}]`);

      return db[key].destroy({ where: {}, force: true });
    })
  );
  return true;
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
  console.log('Creating Sample Provider....');
  const provider = await db.HCProvider.create({ name: 'Sample Provider' });
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

async function registerClinician(provider, terms) {
  const providerId = 'clinician.1@example.com';
  console.log(`Registering Clinician - ${providerId} ...`);

  const userService = new UserService({
    provider: 'clinician',
    providerId,
    providerKey: 'Password1234!',
    emails: [{ email: providerId, primary: true }],
    name: 'Clinician 1',
    terms: [{ id: terms.id, agreedAt: new Date() }],
    hcProviderId: provider.id,
  });
  const user = await userService.upsertUser();
  await user.setStandardPermissions();
  return user;
}

async function registerPatient(clinician, terms, count) {
  const patientName = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const providerId = `patient.${count + 1}@example.com`;
  const providerKey = 'Password1234!';

  console.log(`Registering Patient - ${providerId} ...`);

  // Create invite code
  const code = await db.CareTeamCode.create({
    clinicianId: clinician.id,
    patientName,
    method: 'email',
    deliveryAddress: providerId,
    expiry: moment(new Date()).add(1, 'day').toDate(),
  });

  // Register the user with the code
  const userService = new UserService({
    provider: 'patient',
    providerId,
    providerKey,
    emails: [{ email: providerId, primary: true }],
    terms,
    careTeamCode: {
      codeId: code.id,
      clinicianId: clinician.id,
    },
    name: patientName,
  });

  const user = await userService.upsertUser();

  // Assign Assessments & Reviews
  // await addAssessments(user);
  // await addReviews(user);
  // await completeMoments(user);
  // await completeReview(user);

  // return user;
}

async function addAssessments(patient) {
  console.log(`Adding Assessments to patient - ${patient.providerId} ...`);

  const assessments = (await db.Assessment.findAll()).slice(0, 3);
  for (const assessment of assessments) {
    const opts = {
      patientId: patient.id,
      assessmentId: assessment.id,
      type: assessment.ownerType,
      completed: 'false',
    };
    try {
      await db.PatientAssessment.create(opts);
    } catch (e) {
      console.log('assessment probably exists');
    }
  }
}

async function addReviews(patient) {
  console.log(`Adding Review to patient - ${patient.providerId} ...`);

  const review = await db.Review.create({
    ownerType: 'lotic',
    ownerId: 1,
    title: 'Time to Review',
  });

  const signalQuestions = [
    'In the past two weeks, have you felt nervous or on edge?',
    'In the past two weeks, have you felt irritable or easily annoyed?',
    'Have you been feeling hopeless?',
    'Have you felt a lingering sadness that has lasted more than a few days?',
    'Are you in a good mood today?',
  ];

  for (const content of signalQuestions) {
    await db.SignalQuestion.create({
      reviewId: review.id,
      content,
      type: 'boolean',
      trigger: { answer: 'yes' },
    });
  }

  await patient.addReview(review);
}

async function completeMoments(patient) {
  console.log(`Completing Moment for ${patient.providerId}...`);
  const pa = (await patient.getPatientAssessments())[0];

  await db.Moment.create({
    patientId: patient.id,
    assessmentId: pa.assessmentId,
    type: 'video',
    uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    durationMs: 60 * 1000 * 3,
  });

  await pa.update({ completed: true });
}

async function completeReview(patient) {
  console.log(`Completing Review for ${patient.providerId}...`);

  const review = (await patient.getReviews())[0];
  const questions = await review.getSignalQuestions();

  let body = {};
  for (const question of questions) {
    body[question.id] = true;
  }

  await db.ReviewSubmission.create({
    patientId: patient.id,
    reviewId: review.id,
    body,
  });
}

async function bootstrap() {
  try {
    // Clear the database
    await clearDB();

    // Create Lotic Assessments and Reviews
    await importAssessments();
    await importReviews();

    // Import Content
    await importContent();

    // Create Lotic Terms
    const [patientTerms, clinicianTerms] = await createTerms();

    // Create a provider
    const provider = await createProvider();

    // Register a clinician
    const clinician = await registerClinician(provider, clinicianTerms);

    // Strap some patients
    const patientNums = times(20, (n) => n);
    for (const n of patientNums) {
      await registerPatient(clinician, patientTerms, n);
    }

    const hashId = hashids.encode(provider.id);
    console.log(`\n\n\nYou can register Clinicians at /register/${hashId}\n\n`);

    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

bootstrap();
