import { gql } from 'apollo-server-express';

const fields = `
  reviewId: Int
  assessmentId: Int
  content: String
  type: String
  trigger: JSON
`;

export default gql`
  extend type Query {
    signalQuestions: [SignalQuestion] @listArgs
    signalQuestion: SignalQuestion @defaultArgs
  }

  extend type Mutation {
    createSignalQuestion(signalQuestion: SignalQuestionCreate): SignalQuestion
    updateSignalQuestion(signalQuestion: SignalQuestionUpdate): SignalQuestion
    destroySignalQuestion(signalQuestion: SignalQuestionDestroy): SignalQuestion
  }

  type SignalQuestion {
    id: Int
    ${fields}

    review: Review
    assessment: Assessment
  }

  input SignalQuestionCreate {
    ${fields}
  }

  input SignalQuestionUpdate {
    id: Int!
    ${fields}
  }

  input SignalQuestionDestroy {
    id: Int!
  }
`;
