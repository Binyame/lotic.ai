import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    permissions {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    permission(id: $id) {
      id
    }
  }
`;

const CREATE = `
  mutation create($permission: PermissionCreate) {
    createPermission(permission: $permission) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($permission: PermissionUpdate) {
    updatePermission(permission: $permission) {
      id
      key
    }
  }
`;

const DESTROY = `
  mutation destroy($permission: PermissionDestroy) {
    destroyPermission(permission: $permission) {
      id
    }
  }
`;

describe('Integration - Permission', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('Permission');
    await factory.create('Permission');
    await factory.create('Permission');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.permissions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.permission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Permission');
      const variables = {
        permission: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createPermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        permission: {
          id: record.id,
          key: 'permission.list'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updatePermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not allowed');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Permission');

      const variables = {
        permission: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroyPermission).toBeNull();
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
    
      expect(res.body.data.permissions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.permission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Permission');
      const variables = {
        permission: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.create');
    });
    test('should NOT update', async () => {
      const variables = {
        permission: {
          id: record.id,
          key: 'permission.list'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not allowed');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Permission');

      const variables = {
        permission: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.destroy');
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
    
      expect(res.body.data.permissions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.permission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Permission');
      const variables = {
        permission: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.create');
    });
    test('should NOT update', async () => {
      const variables = {
        permission: {
          id: record.id,
          key: 'permission.list'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not allowed');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Permission');

      const variables = {
        permission: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.destroy');
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
    
      expect(res.body.data.permissions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.permission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Permission');
      const variables = {
        permission: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.create');
    });
    test('should NOT update', async () => {
      const variables = {
        permission: {
          id: record.id,
          key: 'permission.list'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not allowed');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Permission');

      const variables = {
        permission: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('permission.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'permission.list',
        'permission.read',
        'permission.create',
        'permission.update',
        'permission.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.permissions).toBeDefined();
      expect(res.body.data.permissions.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.permission).toBeDefined();
      expect(res.body.data.permission.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Permission');
      const variables = {
        permission: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPermission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Permission.findByPk(res.body.data.createPermission.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        permission: {
          id: record.id,
          key: 'permission.list',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not allowed');
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Permission');

      const variables = {
        permission: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPermission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Permission.findByPk(res.body.data.destroyPermission.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'permission.list',
        'permission.read',
        'permission.create',
        'permission.update',
        'permission.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.permissions).toBeDefined();
      expect(res.body.data.permissions.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.permission).toBeDefined();
      expect(res.body.data.permission.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Permission');
      const variables = {
        permission: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPermission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Permission.findByPk(res.body.data.createPermission.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        permission: {
          id: record.id,
          key: 'permission.list',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not allowed');
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Permission');

      const variables = {
        permission: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPermission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Permission.findByPk(res.body.data.destroyPermission.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'permission.list',
        'permission.read',
        'permission.create',
        'permission.update',
        'permission.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.permissions).toBeDefined();
      expect(res.body.data.permissions.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.permission).toBeDefined();
      expect(res.body.data.permission.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Permission');
      const variables = {
        permission: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPermission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Permission.findByPk(res.body.data.createPermission.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        permission: {
          id: record.id,
          key: 'permission.list',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePermission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not allowed');
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Permission');

      const variables = {
        permission: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPermission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Permission.findByPk(res.body.data.destroyPermission.id);
      expect(found).toBeNull();
    });
  });
});
