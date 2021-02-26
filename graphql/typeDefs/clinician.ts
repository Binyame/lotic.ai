import { gql } from 'apollo-server-express';

const fields = `
  provider: String
  providerId: String
  providerKey: String
`;

export default gql`
  extend type Query {
    clinicians: [Clinician] @listArgs
    clinician: Clinician @defaultArgs
  }

  extend type Mutation {
    createClinician(clinician: ClinicianCreate): Clinician
    updateClinician(clinician: ClinicianUpdate): Clinician
    destroyClinician(clinician: ClinicianDestroy): Clinician
    addMomentShare(clinicianId: Int, momentShareId: Int): MomentShare
    addPatient(clinicianId: Int, patientId: Int): Clinician
    addHCProvider(clinicianId: Int, hcProviderId: Int): HCProvider
    updatePassword(providerId: String, newPassword: String): UpdatePasswordResponse
  }

  type Clinician {
    id: Int
    ${fields}

    permissions: [Permission]
    providers: [Provider]
    profile: Profile
    emails: [Email]
    primaryEmail: Email
    addresses: [Address]
    clinicianAgreements: [ClinicianAgreement]
    momentShares: [MomentShare]
    patients: [Patient]
    HCProviders: [HCProvider]
    careTeamCodes: [CareTeamCode]
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input ClinicianCreate {
    ${fields}
  }

  input ClinicianUpdate {
    id: Int!
    ${fields}
  }

  input ClinicianDestroy {
    id: Int!
  }
  
  type UpdatePasswordResponse {
    result: Boolean!
  }
`;
