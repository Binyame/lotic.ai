import { gql } from 'apollo-server-express';

const fields = `
  targetType: String
  targetId: Int
  country: String
  region: String
  locality: String
  postalCode: String
  address1: String
  address2: String
  address3: String
  address4: String
  primary: String
`;

export default gql`
  extend type Query {
    addresses: [Address] @listArgs
    address: Address @defaultArgs
  }

  extend type Mutation {
    createAddress(address: AddressCreate): Address
    updateAddress(address: AddressUpdate): Address
    destroyAddress(address: AddressDestroy): Address
  }

  type Address {
    id: Int
    ${fields}

    patient: Patient
  }

  input AddressCreate {
    ${fields}
  }

  input AddressUpdate {
    id: Int!
    ${fields}
  }

  input AddressDestroy {
    id: Int!
  }
`;
