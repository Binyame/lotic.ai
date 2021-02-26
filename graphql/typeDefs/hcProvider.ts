import { gql } from 'apollo-server-express';

const fields = `
  name: String
`;

export default gql`
  extend type Query {
    hcProviders: [HCProvider] @listArgs
    hcProvider: HCProvider @defaultArgs
  }

  extend type Mutation {
    createHCProvider(hcProvider: HCProviderCreate): HCProvider
    updateHCProvider(hcProvider: HCProviderUpdate): HCProvider
    destroyHCProvider(hcProvider: HCProviderDestroy): HCProvider
  }

  type HCProvider {
    id: Int
    ${fields}
    
    HCProviderInvites: [HCProviderInvite]
    clinicians: [Clinician]
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input HCProviderCreate {
    ${fields}
  }

  input HCProviderUpdate {
    id: Int!
    ${fields}
  }

  input HCProviderDestroy {
    id: Int!
  }
`;
