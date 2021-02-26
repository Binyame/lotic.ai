import { gql } from 'apollo-server-express';

const fields = `
  startTimeMs: Int
  endTimeMs: Int
  promptId: Int
  momentUuid: String
`;

export default gql`
  extend type Query {
    momentPrompts: [MomentPrompt] @listArgs
    momentPrompt: MomentPrompt @defaultArgs
  }

  extend type Mutation {
    createMomentPrompt(momentPrompt: MomentPromptCreate): MomentPrompt
    updateMomentPrompt(momentPrompt: MomentPromptUpdate): MomentPrompt
    destroyMomentPrompt(momentPrompt: MomentPromptDestroy): MomentPrompt
  }

  type MomentPrompt {
    id: Int
    ${fields}

    prompt: Prompt
    moment: Moment
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input MomentPromptCreate {
    ${fields}
  }

  input MomentPromptUpdate {
    id: Int!
    ${fields}
  }

  input MomentPromptDestroy {
    id: Int!
  }
`;
