import { gql } from 'apollo-server-express';
import { ITypeDefinitions } from 'graphql-tools';

import Address from './address';
import Assessment from './assessment';
import Clinician from './clinician';
import Content from './content';
import DataPrint from './dataPrint';
import Email from './email';
import LoticUser from './loticUser';
import Moment from './moment';
import MomentPrompt from './momentPrompt';
import Patient from './patient';
import PatientAssessment from './patientAssessment';
import Permission from './permission';
import Profile from './profile';
import Prompt from './prompt';
import Provider from './provider';
import Review from './review';
import ReviewSubmission from './reviewSubmission';
import SignalQuestion from './signalQuestion';
import ClinicianAgreement from './clinicianAgreement';
import Agreement from './agreement';
import PatientAgreement from './patientAgreement';
import HCProvider from './hcProvider';
import HCProviderInvite from './hcProviderInvite';
import MomentShare from './momentShare';
import Like from './like';
import CareTeamCode from './careTeamCode';
import PatientReview from './patientReview';

const Query = gql`
  scalar JSON
  scalar DateTime
  scalar Upload

  directive @listArgs on FIELD_DEFINITION
  directive @defaultArgs on FIELD_DEFINITION

  union Owner = LoticUser | Clinician

  type Query {
    _empty: String
  }
`;

const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;

const Subscription = gql`
  type Subscription {
    _empty: String
  }
`;

const typeDefs: ITypeDefinitions = [
  Query,
  Mutation,
  Subscription,
  Address,
  Assessment,
  Clinician,
  Content,
  DataPrint,
  Email,
  LoticUser,
  Moment,
  MomentPrompt,
  Patient,
  PatientAssessment,
  Permission,
  Profile,
  Prompt,
  Provider,
  Review,
  ReviewSubmission,
  SignalQuestion,
  Agreement,
  ClinicianAgreement,
  PatientAgreement,
  HCProvider,
  HCProviderInvite,
  MomentShare,
  Like,
  CareTeamCode,
  PatientReview,
];

export default typeDefs;
