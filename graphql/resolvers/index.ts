import { IResolvers } from 'graphql-tools';
import { merge } from 'lodash';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLUpload } from 'apollo-server-express';

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
import Agreement from './agreement';
import ClinicianAgreement from './clinicianAgreement';
import PatientAgreement from './patientAgreement';
import HCProvider from './hcProvider';
import HCProviderInvite from './hcProviderInvite';
import MomentShare from './momentShare';
import Like from './like';
import CareTeamCode from './careTeamCode';
import PatientReview from './patientReview';

const scalars = {
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,
  Upload: GraphQLUpload,
};

const resolvers: IResolvers = merge(
  scalars,
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
  PatientReview
);

export default resolvers;
