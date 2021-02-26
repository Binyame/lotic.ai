import { gql } from 'apollo-server-express';

const fields = `
  name: String
  area: String
  subCategory: String
  hashTag: String
  ownerId: Int
  ownerType: String
  permanent: Boolean
`;

export default gql` 
  extend type Query {
    assessments: [Assessment] @listArgs
    assessment: Assessment @defaultArgs
  }

  extend type Mutation {
    createAssessment(json: JSON!): Assessment
    updateAssessment(assessment: AssessmentUpdate): Assessment
    destroyAssessment(assessment: AssessmentDestroy): Assessment
  }

  type Assessment {
    id: Int
    ${fields}

    patientAssessments: [PatientAssessment]
    prompts: [Prompt]
    moments: [Moment]
    signalQuestions: [SignalQuestion]
    owner: Owner
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input AssessmentUpdate {
    id: Int!
    ${fields}
  }

  input AssessmentDestroy {
    id: Int!
  }
`;
