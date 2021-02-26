import { gql } from 'apollo-server-express';

const fields = `
  patientId: Int
  contentId: Int
`;

export default gql`
  extend type Query {
    likes: [Like] @listArgs
    like: Like @defaultArgs
  }

  extend type Mutation {
    createLike(like: LikeCreate): Like
    updateLike(like: LikeUpdate): Like
    destroyLike(like: LikeDestroy): Like
  }

  type Like {
    id: Int
    ${fields}

    patient: Patient
    content: Content
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input LikeCreate {
    ${fields}
  }

  input LikeUpdate {
    id: Int!
    ${fields}
  }

  input LikeDestroy {
    id: Int!
  }
`;
