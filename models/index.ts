import { Sequelize, DataTypes } from 'sequelize';
import sequelize from './sequelize';

import Address from './address';
import Agreement from './agreement';
import Assessment from './assessment';
import AssessmentPrompt from './assessmentPrompt';
import Clinician from './clinician';
import ClinicianAgreement from './clinicianAgreement';
import Content from './content';
import DataPrint from './dataprint';
import Email from './email';
import HCProvider from './hcprovider';
import HCProviderInvite from './hcProviderInvite';
import LoticUser from './loticUser';
import Moment from './moment';
import MomentPrompt from './momentPrompt';
import MomentShare from './momentShare';
import MomentShareClinician from './momentShareClinician';
import Patient from './patient';
import PatientAgreement from './patientAgreement';
import PatientAssessment from './patientAssessment';
import PatientReview from './patientReview';
import Permission from './permission';
import Profile from './profile';
import Prompt from './prompt';
import Provider from './provider';
import Review from './review';
import ReviewSubmission from './reviewSubmission';
import SignalQuestion from './signalQuestion';
import Like from './like';
import PatientClinician from './patientclinician';
import HCProviderClinician from './hcproviderclinician';
import CareTeamCode from './careTeamCode';

const db = {} as any;

const Models = {
  Address,
  Agreement,
  Assessment,
  AssessmentPrompt,
  Clinician,
  ClinicianAgreement,
  Content,
  DataPrint,
  Email,
  HCProvider,
  HCProviderInvite,
  LoticUser,
  Moment,
  MomentPrompt,
  MomentShare,
  MomentShareClinician,
  Patient,
  PatientAgreement,
  PatientAssessment,
  PatientReview,
  Permission,
  Profile,
  Prompt,
  Provider,
  Review,
  ReviewSubmission,
  SignalQuestion,
  Like,
  PatientClinician,
  HCProviderClinician,
  CareTeamCode,
};

Object.keys(Models).forEach((key) => {
  const model = Models[key](sequelize, DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
