import { gql } from 'apollo-server-express';

const fields = `
  targetType: String
  targetId: Int
  email: String
  primary: Boolean
`;

export default gql`
  extend type Query {
    emails: [Email] @listArgs
    email: Email @defaultArgs
  }

  extend type Mutation {
    createEmail(email: EmailCreate): Email
    updateEmail(email: EmailUpdate): Email
    destroyEmail(email: EmailDestroy): Email
  }

  type Email {
    id: Int
    ${fields}

    patient: Patient
  }

  input EmailCreate {
    ${fields}
  }

  input EmailUpdate {
    id: Int!
    ${fields}
  }

  input EmailDestroy {
    id: Int!
  }
`;
