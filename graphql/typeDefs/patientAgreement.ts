import { gql } from 'apollo-server-express';

const fields = `
  patientId: Int
  agreementId: Int
  agreed: Boolean
  agreedAt: DateTime
`;

export default gql`
  extend type Query {
    patientAgreements: [PatientAgreement] @listArgs
    patientAgreement: PatientAgreement @defaultArgs
  }

  extend type Mutation {
    createPatientAgreement(patientAgreement: PatientAgreementCreate): PatientAgreement
    updatePatientAgreement(patientAgreement: PatientAgreementUpdate): PatientAgreement
    destroyPatientAgreement(patientAgreement: PatientAgreementDestroy): PatientAgreement
  }

  type PatientAgreement {
    id: Int
    ${fields}

    patient: Patient
    agreement: Agreement
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input PatientAgreementCreate {
    ${fields}
  }

  input PatientAgreementUpdate {
    id: Int!
    ${fields}
  }

  input PatientAgreementDestroy {
    id: Int!
  }
`;
