import { gql } from 'apollo-server-express';

const fields = `
  clinicianId: Int
  agreementId: Int
  agreed: Boolean
  agreedAt: DateTime
`;

export default gql`
  extend type Query {
    clinicianAgreements: [ClinicianAgreement] @listArgs
    clinicianAgreement: ClinicianAgreement @defaultArgs
  }

  extend type Mutation {
    createClinicianAgreement(clinicianAgreement: ClinicianAgreementCreate): ClinicianAgreement
    updateClinicianAgreement(clinicianAgreement: ClinicianAgreementUpdate): ClinicianAgreement
    destroyClinicianAgreement(clinicianAgreement: ClinicianAgreementDestroy): ClinicianAgreement
  }

  type ClinicianAgreement {
    id: Int
    ${fields}
    
    clinician: Clinician
    agreement: Agreement

    createdAt: DateTime
    updatedAt: DateTime
  }

  input ClinicianAgreementCreate {
    ${fields}
  }

  input ClinicianAgreementUpdate {
    id: Int!
    ${fields}
  }

  input ClinicianAgreementDestroy {
    id: Int!
  }
`;
