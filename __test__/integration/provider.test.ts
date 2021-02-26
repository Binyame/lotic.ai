import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    providers {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    provider(id: $id) {
      id
      patient {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($provider: ProviderCreate) {
    createProvider(provider: $provider) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($provider: ProviderUpdate) {
    updateProvider(provider: $provider) {
      id
      providerId
    }
  }
`;

const DESTROY = `
  mutation destroy($provider: ProviderDestroy) {
    destroyProvider(provider: $provider) {
      id
    }
  }
`;

describe('Integration - Provider', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('Provider');
    await factory.create('Provider');
    await factory.create('Provider');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.providers).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.provider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Provider');
      const variables = {
        provider: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        provider: {
          id: record.id,
          providerId: 'updatedproviderid'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updateProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Provider');

      const variables = {
        provider: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroyProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
  });
  describe('LoticUser: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.providers).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.provider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Provider');
      const variables = {
        provider: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.create');
    });
    test('should NOT update', async () => {
      const variables = {
        provider: {
          id: record.id,
          providerId: 'updatedproviderid'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Provider');

      const variables = {
        provider: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.destroy');
    });
  });
  describe('Clinician: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.providers).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.provider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Provider');
      const variables = {
        provider: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.create');
    });
    test('should NOT update', async () => {
      const variables = {
        provider: {
          id: record.id,
          providerId: 'updatedproviderid'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Provider');

      const variables = {
        provider: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.destroy');
    });
  });
  describe('Patient: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.providers).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.provider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Provider');
      const variables = {
        provider: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.create');
    });
    test('should NOT update', async () => {
      const variables = {
        provider: {
          id: record.id,
          providerId: 'updatedproviderid'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Provider');

      const variables = {
        provider: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('provider.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'provider.list',
        'provider.read',
        'provider.create',
        'provider.update',
        'provider.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.providers).toBeDefined();
      expect(res.body.data.providers.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.provider).toBeDefined();
      expect(res.body.data.provider.id).toEqual(record.id);
      expect(res.body.data.provider.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Provider');
      const variables = {
        provider: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Provider.findByPk(res.body.data.createProvider.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        provider: {
          id: record.id,
          providerId: 'updatedproviderid',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProvider).toBeDefined();
      expect(res.body.data.updateProvider.providerId).toEqual('updatedproviderid');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Provider');

      const variables = {
        provider: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Provider.findByPk(res.body.data.destroyProvider.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'provider.list',
        'provider.read',
        'provider.create',
        'provider.update',
        'provider.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.providers).toBeDefined();
      expect(res.body.data.providers.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.provider).toBeDefined();
      expect(res.body.data.provider.id).toEqual(record.id);
      expect(res.body.data.provider.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Provider');
      const variables = {
        provider: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Provider.findByPk(res.body.data.createProvider.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        provider: {
          id: record.id,
          providerId: 'updatedproviderid',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProvider).toBeDefined();
      expect(res.body.data.updateProvider.providerId).toEqual('updatedproviderid');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Provider');

      const variables = {
        provider: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Provider.findByPk(res.body.data.destroyProvider.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'provider.list',
        'provider.read',
        'provider.create',
        'provider.update',
        'provider.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.providers).toBeDefined();
      expect(res.body.data.providers.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.provider).toBeDefined();
      expect(res.body.data.provider.id).toEqual(record.id);
      expect(res.body.data.provider.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Provider');
      const variables = {
        provider: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Provider.findByPk(res.body.data.createProvider.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        provider: {
          id: record.id,
          providerId: 'updatedproviderid',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProvider).toBeDefined();
      expect(res.body.data.updateProvider.providerId).toEqual('updatedproviderid');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Provider');

      const variables = {
        provider: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Provider.findByPk(res.body.data.destroyProvider.id);
      expect(found).toBeNull();
    });
  });
});
