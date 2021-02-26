import { gql } from 'apollo-server-express';

const fields = `
  clinicianId: Int
  code: String
  patientName: String
  method: String
  deliveryAddress: String
  expiry: DateTime
  usedOn: String
`;

export default gql`
  extend type Query {
    careTeamCodes: [CareTeamCode] @listArgs
    careTeamCode: CareTeamCode @defaultArgs
  }

  extend type Mutation {
    createCareTeamCode(careTeamCode: CareTeamCodeCreate): CareTeamCode
    updateCareTeamCode(careTeamCode: CareTeamCodeUpdate): CareTeamCode
    destroyCareTeamCode(careTeamCode: CareTeamCodeDestroy): CareTeamCode
  }

  type CareTeamCode {
    id: Int
    ${fields}
    clinician: Clinician
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CareTeamCodeCreate {
    ${fields}
  }

  input CareTeamCodeUpdate {
    id: Int!
    ${fields}
  }

  input CareTeamCodeDestroy {
    id: Int!
  }
`;
