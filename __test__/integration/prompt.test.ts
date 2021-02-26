import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    prompts {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    prompt(id: $id) {
      id
      assessments {
        id
      }
      momentPrompts {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($prompt: PromptCreate) {
    createPrompt(prompt: $prompt) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($prompt: PromptUpdate) {
    updatePrompt(prompt: $prompt) {
      id
      content
    }
  }
`;

const DESTROY = `
  mutation destroy($prompt: PromptDestroy) {
    destroyPrompt(prompt: $prompt) {
      id
    }
  }
`;

describe('Integration - Prompt', () => {
  let record;

  beforeAll(async () => {
    const assessment = await factory.create('Assessment');
    record = await factory.create('Prompt');

    assessment.addPrompt(record);

    await factory.create('MomentPrompt', { promptId: record.id });
    await factory.create('Prompt');
    await factory.create('Prompt');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.prompts).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.prompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Prompt');
      const variables = {
        prompt: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        prompt: {
          id: record.id,
          content: 'New Content'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updatePrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Prompt');

      const variables = {
        prompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroyPrompt).toBeNull();
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
    
      expect(res.body.data.prompts).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.prompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Prompt');
      const variables = {
        prompt: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.create');
    });
    test('should NOT update', async () => {
      const variables = {
        prompt: {
          id: record.id,
          content: 'New Content'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Prompt');

      const variables = {
        prompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.destroy');
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
    
      expect(res.body.data.prompts).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.prompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Prompt');
      const variables = {
        prompt: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.create');
    });
    test('should NOT update', async () => {
      const variables = {
        prompt: {
          id: record.id,
          content: 'New Content'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Prompt');

      const variables = {
        prompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.destroy');
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
    
      expect(res.body.data.prompts).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.prompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Prompt');
      const variables = {
        prompt: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.create');
    });
    test('should NOT update', async () => {
      const variables = {
        prompt: {
          id: record.id,
          content: 'New Content'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Prompt');

      const variables = {
        prompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPrompt).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('prompt.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'prompt.list',
        'prompt.read',
        'prompt.create',
        'prompt.update',
        'prompt.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.prompts).toBeDefined();
      expect(res.body.data.prompts.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.prompt).toBeDefined();
      expect(res.body.data.prompt.id).toEqual(record.id);
      expect(res.body.data.prompt.assessments.length).toBeGreaterThan(0);
      expect(res.body.data.prompt.momentPrompts.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Prompt');
      const variables = {
        prompt: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Prompt.findByPk(res.body.data.createPrompt.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        prompt: {
          id: record.id,
          content: 'New Content',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePrompt).toBeDefined();
      expect(res.body.data.updatePrompt.content).toEqual('New Content');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Prompt');

      const variables = {
        prompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Prompt.findByPk(res.body.data.destroyPrompt.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'prompt.list',
        'prompt.read',
        'prompt.create',
        'prompt.update',
        'prompt.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.prompts).toBeDefined();
      expect(res.body.data.prompts.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.prompt).toBeDefined();
      expect(res.body.data.prompt.id).toEqual(record.id);
      expect(res.body.data.prompt.assessments.length).toBeGreaterThan(0);
      expect(res.body.data.prompt.momentPrompts.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Prompt');
      const variables = {
        prompt: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Prompt.findByPk(res.body.data.createPrompt.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        prompt: {
          id: record.id,
          content: 'New Content',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePrompt).toBeDefined();
      expect(res.body.data.updatePrompt.content).toEqual('New Content');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Prompt');

      const variables = {
        prompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Prompt.findByPk(res.body.data.destroyPrompt.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'prompt.list',
        'prompt.read',
        'prompt.create',
        'prompt.update',
        'prompt.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.prompts).toBeDefined();
      expect(res.body.data.prompts.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.prompt).toBeDefined();
      expect(res.body.data.prompt.id).toEqual(record.id);
      expect(res.body.data.prompt.assessments.length).toBeGreaterThan(0);
      expect(res.body.data.prompt.momentPrompts.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Prompt');
      const variables = {
        prompt: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Prompt.findByPk(res.body.data.createPrompt.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        prompt: {
          id: record.id,
          content: 'New Content',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updatePrompt).toBeDefined();
      expect(res.body.data.updatePrompt.content).toEqual('New Content');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Prompt');

      const variables = {
        prompt: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyPrompt).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Prompt.findByPk(res.body.data.destroyPrompt.id);
      expect(found).toBeNull();
    });
  });
});
