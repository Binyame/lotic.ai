import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    momentPrompts {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    momentPrompt(id: $id) {
      id
      prompt {
        id
      }
      moment {
        uuid
      }
    }
  }
`;

const CREATE = `
  mutation create($momentPrompt: MomentPromptCreate) {
    createMomentPrompt(momentPrompt: $momentPrompt) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($momentPrompt: MomentPromptUpdate) {
    updateMomentPrompt(momentPrompt: $momentPrompt) {
      id
      startTimeMs
    }
  }
`;

const DESTROY = `
  mutation destroy($momentPrompt: MomentPromptDestroy) {
    destroyMomentPrompt(momentPrompt: $momentPrompt) {
      id
    }
  }
`;

describe('Integration - MomentPrompt', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('MomentPrompt');
    await factory.create('MomentPrompt');
    await factory.create('MomentPrompt');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.momentPrompts).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.momentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('MomentPrompt');
      const variables = {
        momentPrompt: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        momentPrompt: {
          id: record.id,
          startTimeMs: 2000
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updateMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('MomentPrompt');

      const variables = {
        momentPrompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroyMomentPrompt).toBeNull();
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
    
      expect(res.body.data.momentPrompts).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.momentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('MomentPrompt');
      const variables = {
        momentPrompt: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.create');
    });
    test('should NOT update', async () => {
      const variables = {
        momentPrompt: {
          id: record.id,
          startTimeMs: 2000
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('MomentPrompt');

      const variables = {
        momentPrompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.destroy');
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
    
      expect(res.body.data.momentPrompts).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.momentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('MomentPrompt');
      const variables = {
        momentPrompt: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.create');
    });
    test('should NOT update', async () => {
      const variables = {
        momentPrompt: {
          id: record.id,
          startTimeMs: 2000
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('MomentPrompt');

      const variables = {
        momentPrompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.destroy');
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
    
      expect(res.body.data.momentPrompts).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.momentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('MomentPrompt');
      const variables = {
        momentPrompt: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.create');
    });
    test('should NOT update', async () => {
      const variables = {
        momentPrompt: {
          id: record.id,
          startTimeMs: 2000
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('MomentPrompt');

      const variables = {
        momentPrompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyMomentPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentPrompt.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'momentPrompt.list',
        'momentPrompt.read',
        'momentPrompt.create',
        'momentPrompt.update',
        'momentPrompt.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.momentPrompts).toBeDefined();
      expect(res.body.data.momentPrompts.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.momentPrompt).toBeDefined();
      expect(res.body.data.momentPrompt.id).toEqual(record.id);
      expect(res.body.data.momentPrompt.prompt.id).toBeDefined();
      expect(res.body.data.momentPrompt.moment.uuid).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('MomentPrompt');
      const variables = {
        momentPrompt: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createMomentPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentPrompt.findByPk(res.body.data.createMomentPrompt.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        momentPrompt: {
          id: record.id,
          startTimeMs: 2000,
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateMomentPrompt).toBeDefined();
      expect(res.body.data.updateMomentPrompt.startTimeMs).toEqual(2000);
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('MomentPrompt');

      const variables = {
        momentPrompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyMomentPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentPrompt.findByPk(res.body.data.destroyMomentPrompt.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'momentPrompt.list',
        'momentPrompt.read',
        'momentPrompt.create',
        'momentPrompt.update',
        'momentPrompt.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.momentPrompts).toBeDefined();
      expect(res.body.data.momentPrompts.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.momentPrompt).toBeDefined();
      expect(res.body.data.momentPrompt.id).toEqual(record.id);
      expect(res.body.data.momentPrompt.prompt.id).toBeDefined();
      expect(res.body.data.momentPrompt.moment.uuid).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('MomentPrompt');
      const variables = {
        momentPrompt: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createMomentPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentPrompt.findByPk(res.body.data.createMomentPrompt.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        momentPrompt: {
          id: record.id,
          startTimeMs: 2000,
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateMomentPrompt).toBeDefined();
      expect(res.body.data.updateMomentPrompt.startTimeMs).toEqual(2000);
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('MomentPrompt');

      const variables = {
        momentPrompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyMomentPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentPrompt.findByPk(res.body.data.destroyMomentPrompt.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'momentPrompt.list',
        'momentPrompt.read',
        'momentPrompt.create',
        'momentPrompt.update',
        'momentPrompt.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.momentPrompts).toBeDefined();
      expect(res.body.data.momentPrompts.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.momentPrompt).toBeDefined();
      expect(res.body.data.momentPrompt.id).toEqual(record.id);
      expect(res.body.data.momentPrompt.prompt.id).toBeDefined();
      expect(res.body.data.momentPrompt.moment.uuid).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('MomentPrompt');
      const variables = {
        momentPrompt: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createMomentPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentPrompt.findByPk(res.body.data.createMomentPrompt.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        momentPrompt: {
          id: record.id,
          startTimeMs: 2000,
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateMomentPrompt).toBeDefined();
      expect(res.body.data.updateMomentPrompt.startTimeMs).toEqual(2000);
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('MomentPrompt');

      const variables = {
        momentPrompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyMomentPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentPrompt.findByPk(res.body.data.destroyMomentPrompt.id);
      expect(found).toBeNull();
    });
  });
});
