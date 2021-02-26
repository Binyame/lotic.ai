import { gql } from 'apollo-server-express';

const fields = `
  targetType: String
  targetId: Int
  avatarUri: String
  lat: String
  lng: String
  shortDescription: String
  longDescription: String
  title: String
  name: String
`;

export default gql`
  extend type Query {
    profiles: [Profile] @listArgs
    profile: Profile @defaultArgs
  }

  extend type Mutation {
    createProfile(profile: ProfileCreate): Profile
    updateProfile(profile: ProfileUpdate): Profile
    destroyProfile(profile: ProfileDestroy): Profile
  }

  type Profile {
    id: Int
    ${fields}

    patient: Patient
  }

  input ProfileCreate {
    ${fields}
  }

  input ProfileUpdate {
    id: Int!
    ${fields}
  }

  input ProfileDestroy {
    id: Int!
  }
`;
