import { gql } from 'apollo-server-express';

const fields = `
  code: String
  active: Boolean
  providerId: Int
  clinicians: String
  expiresAt: DateTime
`;

export default gql`
  extend type Query {
    hcProviderInvites: [HCProviderInvite] @listArgs
    hcProviderInvite: HCProviderInvite @defaultArgs
  }

  extend type Mutation {
    createHCProviderInvite(hcProviderInvite: HCProviderInviteCreate): HCProviderInvite
    updateHCProviderInvite(hcProviderInvite: HCProviderInviteUpdate): HCProviderInvite
    destroyHCProviderInvite(hcProviderInvite: HCProviderInviteDestroy): HCProviderInvite
  }

  type HCProviderInvite {
    id: Int
    ${fields}
    
    HCProvider: HCProvider
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input HCProviderInviteCreate {
    ${fields}
  }

  input HCProviderInviteUpdate {
    id: Int!
    ${fields}
  }

  input HCProviderInviteDestroy {
    id: Int!
  }
`;
