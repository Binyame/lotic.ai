import { factory as Factory, SequelizeAdapter } from 'factory-girl';
import faker from 'faker';

import DB from '../../models';
import Joi from 'joi';

Factory.setAdapter(new SequelizeAdapter());

const { seq } = Factory;

// DEPRECATED - Left in for reference
// Factory.define('User', DB.User, {
//   provider: 'local',
//   providerId: seq('User.providerId', (n) => `user-${n}@example.com`),
//   providerKey: 'password1234',
// });

Factory.define('Patient', DB.Patient, {
  provider: 'patient',
  providerId: seq('Patient.providerId', (n) => `patient-${n}@example.com`),
  providerKey: 'password1234',
});

Factory.define('Clinician', DB.Clinician, {
  provider: 'clinician',
  providerId: seq('Clinician.providerId', (n) => `clinician-${n}@example.com`),
  providerKey: 'password1234',
});

Factory.define('LoticUser', DB.LoticUser, {
  provider: 'loticUser',
  providerId: seq('LoticUser.providerId', (n) => `loticuser-${n}@example.com`),
  providerKey: 'password1234',
});

Factory.define('Permission', DB.Permission, {
  key: 'no-permission',
  targetType: 'patient',
  targetId: Factory.assoc('Patient', 'id'),
});

Factory.define('Provider', DB.Provider, {
  targetType: 'patient',
  targetId: Factory.assoc('Patient', 'id'),
  provider: 'github',
  providerId: seq('Provider.providerId', (n) => `github-provider-${n}`),
  accessToken: 'somelongaccesstoken1234',
});

Factory.define('Email', DB.Email, {
  targetType: 'patient',
  targetId: Factory.assoc('Patient', 'id'),
  email: seq('Email.email', (n) => `email-${n}@example.com`),
});

Factory.define('Address', DB.Address, {
  targetType: 'patient',
  targetId: Factory.assoc('Patient', 'id'),
  country: 'USA',
  region: 'Texas',
  locality: 'Georgetown',
  postalCode: '78633',
  address1: '123 My Street',
});

Factory.define('Profile', DB.Profile, {
  targetType: 'patient',
  targetId: Factory.assoc('Patient', 'id'),
  avatarUri: faker.image.avatar(),
  lat: () => faker.address.latitude(),
  lng: () => faker.address.longitude(),
  shortDescription: () => faker.lorem.sentence(),
  longDescription: () => faker.lorem.paragraph(),
  title: () => faker.name.title(),
  name: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
});

Factory.define('Content', DB.Content, {
  title: () => faker.lorem.words(),
  content: () => faker.lorem.paragraph(),
  type: 'podcast',
  sourceUri: () => faker.internet.url(),
  thumbnailUri: () => faker.image.imageUrl(),
  author: 'User',
  area: 'test',
  tags: ['tag1', 'tag2'],
  preview: 'test',
});

Factory.define('Assessment', DB.Assessment, {
  name: () => faker.lorem.words(),
  area: () => faker.lorem.paragraph(),
  subCategory: () => faker.lorem.words(),
  hashTag: () => faker.lorem.words(),
  ownerId: Factory.assoc('Clinician', 'id'),
  ownerType: 'clinician',
  prompts: [
    {
      order: Factory.assoc('Prompt', 'order'),
      durationMs: Factory.assoc('Prompt', 'durationMs'),
      content: Factory.assoc('Prompt', 'content'),
    },
  ],
  patientId: Factory.assoc('Patient', 'id'),
});

Factory.define('PatientAssessment', DB.PatientAssessment, {
  patientId: Factory.assoc('Patient', 'id'),
  assessmentId: Factory.assoc('Assessment', 'id'),
  completed: false,
  type: 'lotic',
  bookmarked: false,
});

Factory.define('Prompt', DB.Prompt, {
  order: () => faker.random.number(),
  durationMs: () => faker.random.number(),
  content: () => faker.lorem.text(),
});

Factory.define('Agreement', DB.Agreement, {
  type: () => faker.lorem.words(),
  active: false,
  name: () => faker.lorem.words(),
  key: () => faker.lorem.words(),
  version: () => faker.lorem.words(),
  content: 'markdown',
});

Factory.define('HCProvider', DB.HCProvider, {
  name: () => faker.lorem.text(),
});

Factory.define('PatientAgreement', DB.PatientAgreement, {
  patientId: Factory.assoc('Patient', 'id'),
  agreementId: Factory.assoc('Agreement', 'id'),
  agreed: false,
  agreedAt: () => faker.date.recent(1, new Date(2020, 0, 1)),
});

Factory.define('AssessmentPrompt', DB.AssessmentPrompt, {
  assessmentId: Factory.assoc('Assessment', 'id'),
  promptId: Factory.assoc('Prompt', 'id'),
});

Factory.define('DataPrint', DB.DataPrint, {
  patientId: Factory.assoc('Patient', 'id'),
  svg: () => faker.image.imageUrl(),
  thumbnailUri: () => faker.image.imageUrl(),
});

Factory.define('Moment', DB.Moment, {
  uuid: () => faker.random.uuid(),
  type: 'video',
  patientId: Factory.assoc('Patient', 'id'),
  assessmentId: Factory.assoc('Assessment', 'id'),
  durationMs: () => faker.random.number(),
  uri: () => faker.image.imageUrl(),
});

Factory.define('HCProviderInvite', DB.HCProviderInvite, {
  code: () => faker.random.uuid(),
  active: true,
  providerId: Factory.assoc('HCProvider', 'id'),
  expiresAt: faker.date.recent(1, new Date(2020, 0, 1)),
  clinicians:
    '[{"id":1,"provider":"clinician","providerKey":"$2b$10$fHz98YEx7YBOTkNhiwGhHeJ/uDsNcjOL5qDBz32c7/M.h4vxNNx7a","providerId":"1234@example.com","updatedAt":"2020-09-25T13:31:13.165Z","createdAt":"2020-09-25T13:31:13.165Z"}]',
});

Factory.define('ClinicianAgreement', DB.ClinicianAgreement, {
  clinicianId: Factory.assoc('Clinician', 'id'),
  agreementId: Factory.assoc('Agreement', 'id'),
  agreed: false,
  agreedAt: () => faker.date.recent(1, new Date(2020, 0, 1)),
});

Factory.define('MomentPrompt', DB.MomentPrompt, {
  momentUuid: Factory.assoc('Moment', 'uuid'),
  promptId: Factory.assoc('Prompt', 'id'),
  startTimeMs: 0,
  endTimeMs: 3000,
});

Factory.define('MomentShare', DB.MomentShare, {
  momentUuid: Factory.assoc('Moment', 'uuid'),
  uri: () => faker.image.imageUrl(),
});

Factory.define('MomentShareClinician', DB.MomentShareClinician, {
  momentShareId: Factory.assoc('MomentShare', 'id'),
  clinicianId: Factory.assoc('Clinician', 'id'),
});

Factory.define('Review', DB.Review, {
  title: () => faker.lorem.words(),
  ownerId: Factory.assoc('Clinician', 'id'),
  ownerType: 'clinician',
  signalQuestions: [],
  patientId: Factory.assoc('Patient', 'id'),
});

Factory.define('PatientReview', DB.PatientReview, {
  patientId: Factory.assoc('Patient', 'id'),
  reviewId: Factory.assoc('Review', 'id'),
  type: 'lotic',
});

Factory.define('ReviewSubmission', DB.ReviewSubmission, {
  patientId: Factory.assoc('Patient', 'id'),
  reviewId: Factory.assoc('Review', 'id'),
  body: { foo: 'bar' },
});

Factory.define('SignalQuestion', DB.SignalQuestion, {
  reviewId: Factory.assoc('Review', 'id'),
  assessmentId: Factory.assoc('Assessment', 'id'),
  content: () => faker.lorem.words(),
  type: 'boolean',
  trigger: { foo: 'bar' },
});

Factory.define('Like', DB.Like, {
  patientId: Factory.assoc('Patient', 'id'),
  contentId: Factory.assoc('Content', 'id'),
});

Factory.define('PatientClinician', DB.PatientClinician, {
  patientId: Factory.assoc('Patient', 'id'),
  clinicianId: Factory.assoc('Clinician', 'id'),
});

Factory.define('HCProviderClinician', DB.HCProviderClinician, {
  hcProviderId: Factory.assoc('HCProvider', 'id'),
  clinicianId: Factory.assoc('Clinician', 'id'),
});

Factory.define('CareTeamCode', DB.CareTeamCode, {
  clinicianId: Factory.assoc('Clinician', 'id'),
  code: () => faker.random.uuid(),
  patientName: 'Random Name',
  method: 'email',
  deliveryAddress: 'goodemail@example.com',
  expiry: faker.date.recent(1, new Date(2020, 0, 1)),
});

export const factory = Factory;
export const db = DB;
