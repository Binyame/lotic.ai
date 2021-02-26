import { gql } from 'apollo-server-express';

const fields = `
  provider: String
  providerId: String
  providerKey: String
`;

export default gql`
  extend type Query {
    loticUsers: [LoticUser] @listArgs
    loticUser: LoticUser @defaultArgs
  }

  extend type Mutation {
    createLoticUser(loticUser: LoticUserCreate): LoticUser
    updateLoticUser(loticUser: LoticUserUpdate): LoticUser
    destroyLoticUser(loticUser: LoticUserDestroy): LoticUser
  }

  type LoticUser {
    id: Int
    ${fields}

    permissions: [Permission]
    providers: [Provider]
    profile: Profile
    emails: [Email]
    primaryEmail: Email
    addresses: [Address]
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input LoticUserCreate {
    ${fields}
  }

  input LoticUserUpdate {
    id: Int!
    ${fields}
  }

  input LoticUserDestroy {
    id: Int!
  }
`;
