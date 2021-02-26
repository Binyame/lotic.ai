import { gql } from 'apollo-server-express';

const fields = `
  provider: String
  providerId: String
  providerKey: String
`;

export default gql`
  extend type Query {
    patients: [Patient] @listArgs
    patient: Patient @defaultArgs
  }

  extend type Mutation {
    createPatient(patient: PatientCreate): Patient
    updatePatient(patient: PatientUpdate): Patient
    destroyPatient(patient: PatientDestroy): Patient

    invitePatient(patientName: String!, deliveryAddress: String!): String
  }

  type Patient {
    id: Int
    ${fields}

    permissions: [Permission]
    providers: [Provider]
    profile: Profile
    emails: [Email]
    primaryEmail: Email
    addresses: [Address]
    reviews: [Review]
    reviewSubmissions: [ReviewSubmission]
    clinicians: [Clinician]
    moments: [Moment]
    patientAssessments: [PatientAssessment]
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input PatientCreate {
    ${fields}
  }

  input PatientUpdate {
    id: Int!
    ${fields}
  }

  input PatientDestroy {
    id: Int!
  }
`;
