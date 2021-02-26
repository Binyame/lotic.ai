import { gql } from 'apollo-server-express';

const fields = `
  targetType: String
  targetId: Int
  provider: String
  providerId: String
  accessToken: String
`;

export default gql`
  extend type Query {
    providers: [Provider] @listArgs
    provider: Provider @defaultArgs
  }

  extend type Mutation {
    createProvider(provider: ProviderCreate): Provider
    updateProvider(provider: ProviderUpdate): Provider
    destroyProvider(provider: ProviderDestroy): Provider
  }

  type Provider {
    id: Int
    ${fields}

    patient: Patient
  }

  input ProviderCreate {
    ${fields}
  }

  input ProviderUpdate {
    id: Int!
    ${fields}
  }

  input ProviderDestroy {
    id: Int!
  }
`;
