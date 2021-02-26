import { get, startCase, camelCase, omit, merge } from 'lodash';
import { resolver as _resolver } from 'graphql-sequelize';
import { EXPECTED_OPTIONS_KEY } from 'dataloader-sequelize';
import pluralize from 'pluralize';

_resolver.contextToOptions = {
  dataloaderContext: [EXPECTED_OPTIONS_KEY],
};

// This function allows you to pass a string
// representation of a Model, then uses the
// modelName to pull the Model from ctx, and calls
// the { resolver } with full Graph Context

// It's basically a helper method for thinner fields
export function resolver(model, options = {}) {
  return async function (root, args, ctx, info) {
    model = typeof model === 'string' ? ctx.db[model] : model;
    return _resolver(model, options)(root, args, ctx, info);
  };
}

export function resolveAssociation(modelName, associationName) {
  return async function (root, args, ctx, info) {
    const associationPath = `db.${modelName}.associations.${associationName}`;
    const association = get(ctx, associationPath);

    if (!association) {
      throw new Error(
        `There is no association ${associationName} on ${modelName}`
      );
    }

    const resolved = await _resolver(association)(root, args, ctx, info);
    return resolved;
  };
}

export function buildFields(modelName, graphKeys) {
  return graphKeys.reduce((memo, item) => {
    const associationName = startCase(item).replace(/\s/gi, '');
    memo[item] = resolveAssociation(modelName, associationName);
    return memo;
  }, {});
}

export function create(modelName) {
  if (!modelName) {
    throw new Error('Please provide model name as string');
  }
  const camel = camelCase(modelName);
  return async (_, args, ctx) => {
    try {
      const record = await ctx.db[modelName].create(args[camel]);
      return record;
    } catch (e) {
      throw e;
    }
  };
}

export function update(modelName) {
  if (!modelName) {
    throw new Error('Please provide model name as string');
  }
  const camel = camelCase(modelName);
  return async (_, args, ctx) => {
    try {
      const attrs = get(args, camel);
      const id = get(attrs, 'id') || get(attrs, 'uuid');

      if (!id) {
        throw new Error('Missing id in args.');
      }

      const record = await ctx.db[modelName].findByPk(id);

      if (!record) {
        throw new Error(`${modelName} not found.`);
      }

      record.update(omit(attrs, ['id', 'uuid']));

      return record;
    } catch (e) {
      console.log(e);
      throw new Error(`Error updating ${modelName}.`);
    }
  };
}

export function destroy(modelName) {
  if (!modelName) {
    throw new Error('Please provide model name as string');
  }
  const camel = camelCase(modelName);
  return async (_, args, ctx) => {
    try {
      const attrs = get(args, camel);
      const id = get(attrs, 'id') || get(attrs, 'uuid');

      if (!id) {
        throw new Error('Missing id in args.');
      }

      const record = await ctx.db[modelName].findByPk(id);

      if (!record) {
        throw new Error(`${modelName} not found.`);
      }

      await record.destroy();

      return record;
    } catch (e) {
      console.log(e);
      throw new Error('Error destroying client');
    }
  };
}

export function generateResolvers(modelName, fields, overrides = {}) {
  let resolvers = {
    Query: {},
    Mutation: {},
    Subscription: {},
  };

  const singular = camelCase(modelName);
  const plural = pluralize(singular);

  resolvers.Query[plural] = resolver(modelName);
  resolvers.Query[singular] = resolver(modelName);
  resolvers.Mutation[`create${modelName}`] = create(modelName);
  resolvers.Mutation[`update${modelName}`] = update(modelName);
  resolvers.Mutation[`destroy${modelName}`] = destroy(modelName);

  resolvers[modelName] = {
    ...buildFields(modelName, fields),
  };

  return merge(resolvers, overrides);
}
