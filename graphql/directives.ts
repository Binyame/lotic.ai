import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';

export class listArgs extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    field.args.push({
      name: 'order',
      type: GraphQLString,
    });
    field.args.push({
      name: 'where',
      type: GraphQLJSON,
    });
    field.args.push({
      name: 'offset',
      type: GraphQLInt,
    });
    field.args.push({
      name: 'limit',
      type: GraphQLInt,
    });
  }
}

export class defaultArgs extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    field.args.push({
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    });
    field.args.push({
      name: 'where',
      type: GraphQLJSON,
    });
  }
}
