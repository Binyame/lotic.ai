import { gql } from 'apollo-server-express';

const fields = `
  order: Int
  durationMs: Int
  content: String
`;

export default gql`
  extend type Query {
    prompts: [Prompt] @listArgs
    prompt: Prompt @defaultArgs
  }

  extend type Mutation {
    createPrompt(prompt: PromptCreate): Prompt
    updatePrompt(prompt: PromptUpdate): Prompt
    destroyPrompt(prompt: PromptDestroy): Prompt
  }

  type Prompt {
    id: Int
    ${fields}

    assessments: [Assessment]
    momentPrompts: [MomentPrompt]
  }

  input PromptCreate {
    ${fields}
  }

  input PromptUpdate {
    id: Int!
    ${fields}
  }

  input PromptDestroy {
    id: Int!
  }
`;
