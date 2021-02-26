import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    loticUsers {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    loticUser(id: $id) {
      id
      permissions {
        id
      }
      addresses {
        id
      }
      emails {
        id
      }
      primaryEmail {
        id
      }
      profile {
        id
      }
      providers {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($loticUser: LoticUserCreate) {
    createLoticUser(loticUser: $loticUser) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($loticUser: LoticUserUpdate) {
    updateLoticUser(loticUser: $loticUser) {
      id
      providerId
    }
  }
`;

const DESTROY = `
  mutation destroy($loticUser: LoticUserDestroy) {
    destroyLoticUser(loticUser: $loticUser) {
      id
    }
  }
`;

describe('Integration - LoticUser', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('LoticUser');
    const opts = { targetType: 'loticUser', targetId: record.id };
    await factory.create('Email', opts);
    await factory.create('Provider', opts);
    await factory.create('Profile', opts);
    await factory.create('Address', opts);

    await record.addPermissions(['no-permission']);

    await factory.create('LoticUser');
    await factory.create('LoticUser');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.loticUsers).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.loticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('LoticUser');
      const variables = {
        loticUser: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        loticUser: {
          id: record.id,
          providerId: 'updated@example.com'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updateLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('LoticUser');

      const variables = {
        loticUser: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroyLoticUser).toBeNull();
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
    
      expect(res.body.data.loticUsers).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.loticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('LoticUser');
      const variables = {
        loticUser: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.create');
    });
    test('should NOT update', async () => {
      const variables = {
        loticUser: {
          id: record.id,
          providerId: 'updated@example.com'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('LoticUser');

      const variables = {
        loticUser: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.destroy');
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
    
      expect(res.body.data.loticUsers).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.loticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('LoticUser');
      const variables = {
        loticUser: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.create');
    });
    test('should NOT update', async () => {
      const variables = {
        loticUser: {
          id: record.id,
          providerId: 'updated@example.com'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('LoticUser');

      const variables = {
        loticUser: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.destroy');
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
    
      expect(res.body.data.loticUsers).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.loticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('LoticUser');
      const variables = {
        loticUser: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.create');
    });
    test('should NOT update', async () => {
      const variables = {
        loticUser: {
          id: record.id,
          providerId: 'updated@example.com'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('LoticUser');

      const variables = {
        loticUser: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyLoticUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('loticUser.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'loticUser.list',
        'loticUser.read',
        'loticUser.create',
        'loticUser.update',
        'loticUser.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.loticUsers).toBeDefined();
      expect(res.body.data.loticUsers.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.loticUser).toBeDefined();
      expect(res.body.data.loticUser.permissions.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.addresses.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.emails.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.providers.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.profile.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('LoticUser');
      const variables = {
        loticUser: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createLoticUser).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.LoticUser.findByPk(res.body.data.createLoticUser.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        loticUser: {
          id: record.id,
          providerId: 'updated@example.com',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateLoticUser).toBeDefined();
      expect(res.body.data.updateLoticUser.providerId).toEqual('updated@example.com');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('LoticUser');

      const variables = {
        loticUser: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyLoticUser).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.LoticUser.findByPk(res.body.data.destroyLoticUser.id);
      expect(found).toBeNull();
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'loticUser.list',
        'loticUser.read',
        'loticUser.create',
        'loticUser.update',
        'loticUser.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.loticUsers).toBeDefined();
      expect(res.body.data.loticUsers.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.loticUser).toBeDefined();
      expect(res.body.data.loticUser.permissions.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.addresses.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.emails.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.providers.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.profile.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('LoticUser');
      const variables = {
        loticUser: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createLoticUser).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.LoticUser.findByPk(res.body.data.createLoticUser.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        loticUser: {
          id: record.id,
          providerId: 'updated@example.com',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateLoticUser).toBeDefined();
      expect(res.body.data.updateLoticUser.providerId).toEqual('updated@example.com');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('LoticUser');

      const variables = {
        loticUser: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyLoticUser).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.LoticUser.findByPk(res.body.data.destroyLoticUser.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'loticUser.list',
        'loticUser.read',
        'loticUser.create',
        'loticUser.update',
        'loticUser.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.loticUsers).toBeDefined();
      expect(res.body.data.loticUsers.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.loticUser).toBeDefined();
      expect(res.body.data.loticUser.permissions.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.addresses.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.emails.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.providers.length).toBeGreaterThan(0);
      expect(res.body.data.loticUser.profile.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('LoticUser');
      const variables = {
        loticUser: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createLoticUser).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.LoticUser.findByPk(res.body.data.createLoticUser.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        loticUser: {
          id: record.id,
          providerId: 'updated@example.com',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateLoticUser).toBeDefined();
      expect(res.body.data.updateLoticUser.providerId).toEqual('updated@example.com');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('LoticUser');

      const variables = {
        loticUser: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyLoticUser).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.LoticUser.findByPk(res.body.data.destroyLoticUser.id);
      expect(found).toBeNull();
    });
  });
});
