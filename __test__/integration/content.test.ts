import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    contents {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    content(id: $id) {
      id
    }
  }
`;

const CREATE = `
  mutation create($content: ContentCreate) {
    createContent(content: $content) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($content: ContentUpdate) {
    updateContent(content: $content) {
      id
      title
    }
  }
`;

const DESTROY = `
  mutation destroy($content: ContentDestroy) {
    destroyContent(content: $content) {
      id
    }
  }
`;

describe('Integration - Content', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('Content');
    await factory.create('Content');
    await factory.create('Content');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.contents).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.content).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Content');
      const variables = {
        content: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        content: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updateContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Content');

      const variables = {
        content: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroyContent).toBeNull();
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
    
      expect(res.body.data.contents).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.content).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Content');
      const variables = {
        content: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.create');
    });
    test('should NOT update', async () => {
      const variables = {
        content: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Content');

      const variables = {
        content: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.destroy');
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
    
      expect(res.body.data.contents).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.content).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Content');
      const variables = {
        content: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.create');
    });
    test('should NOT update', async () => {
      const variables = {
        content: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Content');

      const variables = {
        content: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.destroy');
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
    
      expect(res.body.data.contents).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.content).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Content');
      const variables = {
        content: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.create');
    });
    test('should NOT update', async () => {
      const variables = {
        content: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Content');

      const variables = {
        content: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyContent).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('content.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'content.list',
        'content.read',
        'content.create',
        'content.update',
        'content.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.contents).toBeDefined();
      expect(res.body.data.contents.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.content).toBeDefined();
      expect(res.body.data.content.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Content');
      const variables = {
        content: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createContent).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Content.findByPk(res.body.data.createContent.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        content: {
          id: record.id,
          title: 'New Title',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateContent).toBeDefined();
      expect(res.body.data.updateContent.title).toEqual('New Title');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Content');

      const variables = {
        content: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyContent).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Content.findByPk(res.body.data.destroyContent.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'content.list',
        'content.read',
        'content.create',
        'content.update',
        'content.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.contents).toBeDefined();
      expect(res.body.data.contents.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.content).toBeDefined();
      expect(res.body.data.content.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Content');
      const variables = {
        content: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createContent).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Content.findByPk(res.body.data.createContent.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        content: {
          id: record.id,
          title: 'New Title',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateContent).toBeDefined();
      expect(res.body.data.updateContent.title).toEqual('New Title');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Content');

      const variables = {
        content: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyContent).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Content.findByPk(res.body.data.destroyContent.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'content.list',
        'content.read',
        'content.create',
        'content.update',
        'content.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.contents).toBeDefined();
      expect(res.body.data.contents.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.content).toBeDefined();
      expect(res.body.data.content.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Content');
      const variables = {
        content: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createContent).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Content.findByPk(res.body.data.createContent.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        content: {
          id: record.id,
          title: 'New Title',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateContent).toBeDefined();
      expect(res.body.data.updateContent.title).toEqual('New Title');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Content');

      const variables = {
        content: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyContent).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Content.findByPk(res.body.data.destroyContent.id);
      expect(found).toBeNull();
    });
  });
});
