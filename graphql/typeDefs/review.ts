import { gql } from 'apollo-server-express';

const fields = `
  title: String
  ownerId: Int
  ownerType: String
`;

export default gql`
  extend type Query {
    reviews: [Review] @listArgs
    review: Review @defaultArgs
  }

  extend type Mutation {
    createReview(json: JSON!): Review
    updateReview(review: ReviewUpdate): Review
    destroyReview(review: ReviewDestroy): Review
  }

  type Review {
    id: Int
    ${fields}

    patients: [Patient]
    signalQuestions: [SignalQuestion]
    owner: Owner
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input ReviewUpdate {
    id: Int!
    ${fields}
  }

  input ReviewDestroy {
    id: Int!
  }
`;
