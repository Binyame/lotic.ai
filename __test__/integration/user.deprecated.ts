import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    users {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    user(id: $id) {
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
  mutation create($user: UserCreate) {
    createUser(user: $user) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($user: UserUpdate) {
    updateUser(user: $user) {
      id
      providerId
    }
  }
`;

const DESTROY = `
  mutation destroy($user: UserDestroy) {
    destroyUser(user: $user) {
      id
    }
  }
`;

describe.skip('Integration - User', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('User');
    await factory.create('Email', { userId: record.id });
    await factory.create('Provider', { userId: record.id });
    await factory.create('Profile', { userId: record.id });
    await factory.create('Address', { targetType: 'user', targetId: record.id });
    
    await factory.create('User');
    await factory.create('User');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.users).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.user).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('User');
      const variables = {
        user: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        user: {
          id: record.id,
          providerId: 'updated-email@example.com'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updateUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const variables = {
        user: {
          id: record.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroyUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
  });
  describe('without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('User');
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.users).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('user.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.user).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('user.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('User');
      const variables = {
        user: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('user.create');
    });
    test('should NOT update', async () => {
      const variables = {
        user: {
          id: record.id,
          providerId: 'updated-email@example.com'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('user.update');
    });
    test('should NOT destroy', async () => {
      const variables = {
        user: {
          id: record.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyUser).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('user.destroy');
    });
  });
  describe('with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('User');
      await usr.addPermissions([
        'user.list',
        'user.read',
        'user.create',
        'user.update',
        'user.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.users).toBeDefined();
      expect(res.body.data.users.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      await record.addPermissions(['no-permission']);
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.permissions.length).toBeGreaterThan(0);
      expect(res.body.data.user.addresses.length).toBeGreaterThan(0);
      expect(res.body.data.user.emails.length).toBeGreaterThan(0);
      expect(res.body.data.user.providers.length).toBeGreaterThan(0);
      expect(res.body.data.user.profile.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('User');
      const variables = {
        user: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createUser).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.User.findByPk(res.body.data.createUser.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        user: {
          id: record.id,
          providerId: 'updated-email@example.com'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateUser).toBeDefined();
      expect(res.body.data.updateUser.providerId).toEqual('updated-email@example.com');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const variables = {
        user: {
          id: record.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyUser).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.User.findByPk(res.body.data.destroyUser.id);
      expect(found).toBeNull();
    });
  });
});