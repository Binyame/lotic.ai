import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    [LOWERNAME]s {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    [LOWERNAME](id: $id) {
      id
      user {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($[LOWERNAME]: [UPPERNAME]Create) {
    create[UPPERNAME]([LOWERNAME]: $[LOWERNAME]) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($[LOWERNAME]: [UPPERNAME]Update) {
    update[UPPERNAME]([LOWERNAME]: $[LOWERNAME]) {
      id
      region
    }
  }
`;

const DESTROY = `
  mutation destroy($[LOWERNAME]: [UPPERNAME]Destroy) {
    destroy[UPPERNAME]([LOWERNAME]: $[LOWERNAME]) {
      id
    }
  }
`;

describe('Integration - [UPPERNAME]', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('[UPPERNAME]');
    await factory.create('[UPPERNAME]');
    await factory.create('[UPPERNAME]');
  });

  describe('Anonymous', () => {
    test('should NOT be able to list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.[LOWERNAME]s).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT be able to read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.[LOWERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT be able to create', async () => {
      const attrs = await factory.attrs('[UPPERNAME]');
      const variables = {
        [LOWERNAME]: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.create[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT be able to update', async () => {
      const variables = {
        [LOWERNAME]: {
          id: record.id,
          region: 'New Region'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.update[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT be able to destroy', async () => {
      const destroy = await factory.create('[UPPERNAME]');

      const variables = {
        [LOWERNAME]: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroy[UPPERNAME]).toBeNull();
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

    test('should NOT be able to list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.[LOWERNAME]s).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].list');
    });
    test('should NOT be able to read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.[LOWERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].read');
    });
    test('should NOT be able to create', async () => {
      const attrs = await factory.attrs('[UPPERNAME]');
      const variables = {
        [LOWERNAME]: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.create[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].create');
    });
    test('should NOT be able to update', async () => {
      const variables = {
        [LOWERNAME]: {
          id: record.id,
          region: 'New Region'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.update[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].update');
    });
    test('should NOT be able to destroy', async () => {
      const destroy = await factory.create('[UPPERNAME]');

      const variables = {
        [LOWERNAME]: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroy[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].destroy');
    });
  });
  describe('Clinician: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      token = await usr.token();
    });

    test('should NOT be able to list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.[LOWERNAME]s).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].list');
    });
    test('should NOT be able to read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.[LOWERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].read');
    });
    test('should NOT be able to create', async () => {
      const attrs = await factory.attrs('[UPPERNAME]');
      const variables = {
        [LOWERNAME]: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.create[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].create');
    });
    test('should NOT be able to update', async () => {
      const variables = {
        [LOWERNAME]: {
          id: record.id,
          region: 'New Region'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.update[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].update');
    });
    test('should NOT be able to destroy', async () => {
      const destroy = await factory.create('[UPPERNAME]');

      const variables = {
        [LOWERNAME]: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroy[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].destroy');
    });
  });
  describe('Patient: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      token = await usr.token();
    });

    test('should NOT be able to list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.[LOWERNAME]s).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].list');
    });
    test('should NOT be able to read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.[LOWERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].read');
    });
    test('should NOT be able to create', async () => {
      const attrs = await factory.attrs('[UPPERNAME]');
      const variables = {
        [LOWERNAME]: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.create[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].create');
    });
    test('should NOT be able to update', async () => {
      const variables = {
        [LOWERNAME]: {
          id: record.id,
          region: 'New Region'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.update[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].update');
    });
    test('should NOT be able to destroy', async () => {
      const destroy = await factory.create('[UPPERNAME]');

      const variables = {
        [LOWERNAME]: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroy[UPPERNAME]).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('[LOWERNAME].destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        '[LOWERNAME].list',
        '[LOWERNAME].read',
        '[LOWERNAME].create',
        '[LOWERNAME].update',
        '[LOWERNAME].destroy',
      ]);
      token = await usr.token();
    });

    test('should be able to list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.[LOWERNAME]s).toBeDefined();
      expect(res.body.data.[LOWERNAME]s.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should be able to read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.[LOWERNAME]).toBeDefined();
      expect(res.body.data.[LOWERNAME].id).toEqual(record.id);
      expect(res.body.data.[LOWERNAME].user.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should be able to create', async () => {
      const attrs = await factory.attrs('[UPPERNAME]');
      const variables = {
        [LOWERNAME]: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.create[UPPERNAME]).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.[UPPERNAME].findByPk(res.body.data.create[UPPERNAME].id);
      expect(found).toBeDefined();
    });
    test('should be able to update', async () => {
      const variables = {
        [LOWERNAME]: {
          id: record.id,
          region: 'New Region',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.update[UPPERNAME]).toBeDefined();
      expect(res.body.data.update[UPPERNAME].region).toEqual('New Region');
      expect(res.body.errors).toBeUndefined();
    });
    test('should be able to destroy', async () => {
      const destroy = await factory.create('[UPPERNAME]');

      const variables = {
        [LOWERNAME]: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroy[UPPERNAME]).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.[UPPERNAME].findByPk(res.body.data.destroy[UPPERNAME].id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        '[LOWERNAME].list',
        '[LOWERNAME].read',
        '[LOWERNAME].create',
        '[LOWERNAME].update',
        '[LOWERNAME].destroy',
      ]);
      token = await usr.token();
    });

    test('should be able to list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.[LOWERNAME]s).toBeDefined();
      expect(res.body.data.[LOWERNAME]s.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should be able to read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.[LOWERNAME]).toBeDefined();
      expect(res.body.data.[LOWERNAME].id).toEqual(record.id);
      expect(res.body.data.[LOWERNAME].user.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should be able to create', async () => {
      const attrs = await factory.attrs('[UPPERNAME]');
      const variables = {
        [LOWERNAME]: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.create[UPPERNAME]).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.[UPPERNAME].findByPk(res.body.data.create[UPPERNAME].id);
      expect(found).toBeDefined();
    });
    test('should be able to update', async () => {
      const variables = {
        [LOWERNAME]: {
          id: record.id,
          region: 'New Region',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.update[UPPERNAME]).toBeDefined();
      expect(res.body.data.update[UPPERNAME].region).toEqual('New Region');
      expect(res.body.errors).toBeUndefined();
    });
    test('should be able to destroy', async () => {
      const destroy = await factory.create('[UPPERNAME]');

      const variables = {
        [LOWERNAME]: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroy[UPPERNAME]).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.[UPPERNAME].findByPk(res.body.data.destroy[UPPERNAME].id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        '[LOWERNAME].list',
        '[LOWERNAME].read',
        '[LOWERNAME].create',
        '[LOWERNAME].update',
        '[LOWERNAME].destroy',
      ]);
      token = await usr.token();
    });

    test('should be able to list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.[LOWERNAME]s).toBeDefined();
      expect(res.body.data.[LOWERNAME]s.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should be able to read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.[LOWERNAME]).toBeDefined();
      expect(res.body.data.[LOWERNAME].id).toEqual(record.id);
      expect(res.body.data.[LOWERNAME].user.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should be able to create', async () => {
      const attrs = await factory.attrs('[UPPERNAME]');
      const variables = {
        [LOWERNAME]: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.create[UPPERNAME]).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.[UPPERNAME].findByPk(res.body.data.create[UPPERNAME].id);
      expect(found).toBeDefined();
    });
    test('should be able to update', async () => {
      const variables = {
        [LOWERNAME]: {
          id: record.id,
          region: 'New Region',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.update[UPPERNAME]).toBeDefined();
      expect(res.body.data.update[UPPERNAME].region).toEqual('New Region');
      expect(res.body.errors).toBeUndefined();
    });
    test('should be able to destroy', async () => {
      const destroy = await factory.create('[UPPERNAME]');

      const variables = {
        [LOWERNAME]: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroy[UPPERNAME]).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.[UPPERNAME].findByPk(res.body.data.destroy[UPPERNAME].id);
      expect(found).toBeNull();
    });
  });
});