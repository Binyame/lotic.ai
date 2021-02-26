import { gql } from 'apollo-server-express';

const fields = `
  type: String
  durationMs: Int
  uri: String
  mimeType: String
  assessmentId: Int
  patientId: Int
`;

export default gql`
  extend type Query {
    moments: [Moment] @listArgs
    moment(uuid: String!): Moment
  }

  extend type Mutation {
    createMoment(moment: MomentCreate): JSON
    updateMoment(moment: MomentUpdate): Moment
    destroyMoment(moment: MomentDestroy): Moment
  }

  type Moment {
    uuid: String
    
    ${fields}

    thumbnailUri: String

    patient: Patient
    assessment: Assessment
    momentPrompts: [MomentPrompt]
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input MomentCreate {
    uuid: String
    fileName: String!
    ${fields}
  }

  input MomentUpdate {
    uuid: String!
    ${fields}
  }

  input MomentDestroy {
    uuid: String!
  }
`;
