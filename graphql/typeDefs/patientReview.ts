import { gql } from 'apollo-server-express';

const fields = `
  patientId: Int
  reviewId: Int
  completed: Boolean
  type: String
`;

export default gql`
  extend type Query {
    patientReviews: [PatientReview] @listArgs
    patientReview: PatientReview @defaultArgs
  }

  extend type Mutation {
    createPatientReview(patientReview: PatientReviewCreate): PatientReview
    updatePatientReview(patientReview: PatientReviewUpdate): PatientReview
    destroyPatientReview(patientReview: PatientReviewDestroy): PatientReview
  }

  type PatientReview {
    id: Int
    ${fields}

    patient: Patient
    review: Review
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input PatientReviewCreate {
    ${fields}
  }

  input PatientReviewUpdate {
    id: Int!
    ${fields}
  }

  input PatientReviewDestroy {
    id: Int!
  }
`;
