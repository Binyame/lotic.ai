import { gql } from 'apollo-server-express';

const fields = `
  completed: Boolean
  type: String
  patientId: Int
  assessmentId: Int
  bookmarked: Boolean
`;

export default gql`
  extend type Query {
    patientAssessments: [PatientAssessment] @listArgs
    patientAssessment: PatientAssessment @defaultArgs
  }

  extend type Mutation {
    createPatientAssessment(patientAssessment: PatientAssessmentCreate): PatientAssessment
    updatePatientAssessment(patientAssessment: PatientAssessmentUpdate): PatientAssessment
    destroyPatientAssessment(patientAssessment: PatientAssessmentDestroy): PatientAssessment
  }

  type PatientAssessment {
    id: Int
    ${fields}

    patient: Patient
    assessment: Assessment
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input PatientAssessmentCreate {
    ${fields}
  }

  input PatientAssessmentUpdate {
    id: Int!
    ${fields}
  }

  input PatientAssessmentDestroy {
    id: Int!
  }
`;
