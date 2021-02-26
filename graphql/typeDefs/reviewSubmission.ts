import { gql } from 'apollo-server-express';

const fields = `
  patientId: Int
  reviewId: Int
  body: JSON
`;

export default gql`
  extend type Query {
    reviewSubmissions: [ReviewSubmission] @listArgs
    reviewSubmission: ReviewSubmission @defaultArgs
  }

  extend type Mutation {
    createReviewSubmission(reviewSubmission: ReviewSubmissionCreate): ReviewSubmission
    updateReviewSubmission(reviewSubmission: ReviewSubmissionUpdate): ReviewSubmission
    destroyReviewSubmission(reviewSubmission: ReviewSubmissionDestroy): ReviewSubmission
  }

  type ReviewSubmission {
    id: Int
    ${fields}

    patient: Patient
    review: Review

    createdAt: DateTime
    updatedAt: DateTime
  }

  input ReviewSubmissionCreate {
    ${fields}
    patientReviewId: Int
  }

  input ReviewSubmissionUpdate {
    id: Int!
    ${fields}
  }

  input ReviewSubmissionDestroy {
    id: Int!
  }
`;
