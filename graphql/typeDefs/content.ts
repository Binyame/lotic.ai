import { gql } from 'apollo-server-express';

const fields = `
  title: String
  content: String
  type: String
  sourceUri: String
  thumbnailUri: String
  source: String
  author: String
  area: String
  tags: [String]
  preview: String
`;

export default gql`
  extend type Query {
    contents: [Content] @listArgs
    content: Content @defaultArgs
  }

  extend type Mutation {
    createContent(content: ContentCreate): Content
    updateContent(content: ContentUpdate): Content
    destroyContent(content: ContentDestroy): Content
  }

  type Content {
    id: Int
    ${fields}
    
    createdAt: DateTime
    updatedAt: DateTime
  }

  input ContentCreate {
    ${fields}
  }

  input ContentUpdate {
    id: Int!
    ${fields}
  }

  input ContentDestroy {
    id: Int!
  }
`;
