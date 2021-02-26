import { gql } from 'apollo-server-express';

const fields = `
  type: String
  active: Boolean
  name: String
  key: String
  version: String
  content: String
`;

export default gql`
  extend type Query {
    agreements: [Agreement] @listArgs
    agreement: Agreement @defaultArgs
  }

  extend type Mutation {
    createAgreement(agreement: AgreementCreate): Agreement
    updateAgreement(agreement: AgreementUpdate): Agreement
    destroyAgreement(agreement: AgreementDestroy): Agreement
  }

  type Agreement {
    id: Int
    ${fields}

    clinicianAgreements: [ClinicianAgreement]
    patientAgreements: [PatientAgreement]
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input AgreementCreate {
    ${fields}
  }

  input AgreementUpdate {
    id: Int!
    ${fields}
  }

  input AgreementDestroy {
    id: Int!
  }
`;
