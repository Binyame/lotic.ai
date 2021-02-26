import { gql } from 'apollo-server-express';

const fields = `
  momentUuid: String
  uri: String
`;

export default gql`
  extend type Query {
    momentShares: [MomentShare] @listArgs
    momentShare: MomentShare @defaultArgs
  }

  extend type Mutation {
    createMomentShare(momentShare: MomentShareCreate): MomentShare
    updateMomentShare(momentShare: MomentShareUpdate): MomentShare
    destroyMomentShare(momentShare: MomentShareDestroy): MomentShare
  }

  type MomentShare {
    id: Int
    ${fields}
    
    clinicians: [Clinician]
    moment: Moment
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input MomentShareCreate {
    ${fields}
  }

  input MomentShareUpdate {
    id: Int!
    ${fields}
  }

  input MomentShareDestroy {
    id: Int!
  }
`;
