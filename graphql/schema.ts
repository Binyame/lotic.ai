import 'graphql-import-node';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';

import resolvers from './resolvers';
import typeDefs from './typeDefs';
import { permissions } from './permissions';
import { listArgs, defaultArgs } from './directives';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    listArgs,
    defaultArgs,
  },
});

export default applyMiddleware(schema, permissions);
