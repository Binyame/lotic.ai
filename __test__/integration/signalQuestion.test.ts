import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    signalQuestions {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    signalQuestion(id: $id) {
      id
      review {
        id
      }
      assessment {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($signalQuestion: SignalQuestionCreate) {
    createSignalQuestion(signalQuestion: $signalQuestion) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($signalQuestion: SignalQuestionUpdate) {
    updateSignalQuestion(signalQuestion: $signalQuestion) {
      id
      content
    }
  }
`;

const DESTROY = `
  mutation destroy($signalQuestion: SignalQuestionDestroy) {
    destroySignalQuestion(signalQuestion: $signalQuestion) {
      id
    }
  }
`;

describe('Integration - SignalQuestion', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('SignalQuestion');
    await factory.create('SignalQuestion');
    await factory.create('SignalQuestion');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.signalQuestions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.signalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('SignalQuestion');
      const variables = {
        signalQuestion: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createSignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        signalQuestion: {
          id: record.id,
          content: 'New Content'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updateSignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('SignalQuestion');

      const variables = {
        signalQuestion: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroySignalQuestion).toBeNull();
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
    
      expect(res.body.data.signalQuestions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.signalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('SignalQuestion');
      const variables = {
        signalQuestion: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createSignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.create');
    });
    test('should NOT update', async () => {
      const variables = {
        signalQuestion: {
          id: record.id,
          content: 'New Content'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateSignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('SignalQuestion');

      const variables = {
        signalQuestion: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroySignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.destroy');
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
    
      expect(res.body.data.signalQuestions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.signalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('SignalQuestion');
      const variables = {
        signalQuestion: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createSignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.create');
    });
    test('should NOT update', async () => {
      const variables = {
        signalQuestion: {
          id: record.id,
          content: 'New Content'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateSignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('SignalQuestion');

      const variables = {
        signalQuestion: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroySignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.destroy');
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
    
      expect(res.body.data.signalQuestions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.signalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('SignalQuestion');
      const variables = {
        signalQuestion: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createSignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.create');
    });
    test('should NOT update', async () => {
      const variables = {
        signalQuestion: {
          id: record.id,
          content: 'New Content'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateSignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('SignalQuestion');

      const variables = {
        signalQuestion: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroySignalQuestion).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('signalQuestion.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'signalQuestion.list',
        'signalQuestion.read',
        'signalQuestion.create',
        'signalQuestion.update',
        'signalQuestion.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.signalQuestions).toBeDefined();
      expect(res.body.data.signalQuestions.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.signalQuestion).toBeDefined();
      expect(res.body.data.signalQuestion.id).toEqual(record.id);
      expect(res.body.data.signalQuestion.review.id).toBeDefined();
      expect(res.body.data.signalQuestion.assessment.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('SignalQuestion');
      const variables = {
        signalQuestion: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createSignalQuestion).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.SignalQuestion.findByPk(res.body.data.createSignalQuestion.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        signalQuestion: {
          id: record.id,
          content: 'New Content',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateSignalQuestion).toBeDefined();
      expect(res.body.data.updateSignalQuestion.content).toEqual('New Content');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('SignalQuestion');

      const variables = {
        signalQuestion: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroySignalQuestion).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.SignalQuestion.findByPk(res.body.data.destroySignalQuestion.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'signalQuestion.list',
        'signalQuestion.read',
        'signalQuestion.create',
        'signalQuestion.update',
        'signalQuestion.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.signalQuestions).toBeDefined();
      expect(res.body.data.signalQuestions.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.signalQuestion).toBeDefined();
      expect(res.body.data.signalQuestion.id).toEqual(record.id);
      expect(res.body.data.signalQuestion.review.id).toBeDefined();
      expect(res.body.data.signalQuestion.assessment.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('SignalQuestion');
      const variables = {
        signalQuestion: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createSignalQuestion).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.SignalQuestion.findByPk(res.body.data.createSignalQuestion.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        signalQuestion: {
          id: record.id,
          content: 'New Content',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateSignalQuestion).toBeDefined();
      expect(res.body.data.updateSignalQuestion.content).toEqual('New Content');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('SignalQuestion');

      const variables = {
        signalQuestion: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroySignalQuestion).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.SignalQuestion.findByPk(res.body.data.destroySignalQuestion.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'signalQuestion.list',
        'signalQuestion.read',
        'signalQuestion.create',
        'signalQuestion.update',
        'signalQuestion.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.signalQuestions).toBeDefined();
      expect(res.body.data.signalQuestions.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.signalQuestion).toBeDefined();
      expect(res.body.data.signalQuestion.id).toEqual(record.id);
      expect(res.body.data.signalQuestion.review.id).toBeDefined();
      expect(res.body.data.signalQuestion.assessment.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('SignalQuestion');
      const variables = {
        signalQuestion: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createSignalQuestion).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.SignalQuestion.findByPk(res.body.data.createSignalQuestion.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        signalQuestion: {
          id: record.id,
          content: 'New Content',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateSignalQuestion).toBeDefined();
      expect(res.body.data.updateSignalQuestion.content).toEqual('New Content');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('SignalQuestion');

      const variables = {
        signalQuestion: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroySignalQuestion).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.SignalQuestion.findByPk(res.body.data.destroySignalQuestion.id);
      expect(found).toBeNull();
    });
  });
});
