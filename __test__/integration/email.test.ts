import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    emails {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    email(id: $id) {
      id
      patient {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($email: EmailCreate) {
    createEmail(email: $email) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($email: EmailUpdate) {
    updateEmail(email: $email) {
      id
      email
    }
  }
`;

const DESTROY = `
  mutation destroy($email: EmailDestroy) {
    destroyEmail(email: $email) {
      id
    }
  }
`;

describe('Integration - Email', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('Email');
    await factory.create('Email');
    await factory.create('Email');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.emails).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.email).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Email');
      const variables = {
        email: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        email: {
          id: record.id,
          email: 'updated-email@example.com'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updateEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Email');

      const variables = {
        email: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroyEmail).toBeNull();
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
    
      expect(res.body.data.emails).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.email).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Email');
      const variables = {
        email: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.create');
    });
    test('should NOT update', async () => {
      const variables = {
        email: {
          id: record.id,
          email: 'updated-email@example.com'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Email');

      const variables = {
        email: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.destroy');
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
    
      expect(res.body.data.emails).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.email).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Email');
      const variables = {
        email: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.create');
    });
    test('should NOT update', async () => {
      const variables = {
        email: {
          id: record.id,
          email: 'updated-email@example.com'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Email');

      const variables = {
        email: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.destroy');
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
    
      expect(res.body.data.emails).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.email).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Email');
      const variables = {
        email: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.create');
    });
    test('should NOT update', async () => {
      const variables = {
        email: {
          id: record.id,
          email: 'updated-email@example.com'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Email');

      const variables = {
        email: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyEmail).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('email.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'email.list',
        'email.read',
        'email.create',
        'email.update',
        'email.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.emails).toBeDefined();
      expect(res.body.data.emails.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.email).toBeDefined();
      expect(res.body.data.email.id).toEqual(record.id);
      expect(res.body.data.email.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Email');
      const variables = {
        email: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createEmail).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Email.findByPk(res.body.data.createEmail.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        email: {
          id: record.id,
          email: 'updated-email@example.com',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateEmail).toBeDefined();
      expect(res.body.data.updateEmail.email).toEqual('updated-email@example.com');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Email');

      const variables = {
        email: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyEmail).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Email.findByPk(res.body.data.destroyEmail.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'email.list',
        'email.read',
        'email.create',
        'email.update',
        'email.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.emails).toBeDefined();
      expect(res.body.data.emails.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.email).toBeDefined();
      expect(res.body.data.email.id).toEqual(record.id);
      expect(res.body.data.email.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Email');
      const variables = {
        email: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createEmail).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Email.findByPk(res.body.data.createEmail.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        email: {
          id: record.id,
          email: 'updated-email@example.com',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateEmail).toBeDefined();
      expect(res.body.data.updateEmail.email).toEqual('updated-email@example.com');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Email');

      const variables = {
        email: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyEmail).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Email.findByPk(res.body.data.destroyEmail.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'email.list',
        'email.read',
        'email.create',
        'email.update',
        'email.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.emails).toBeDefined();
      expect(res.body.data.emails.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.email).toBeDefined();
      expect(res.body.data.email.id).toEqual(record.id);
      expect(res.body.data.email.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Email');
      const variables = {
        email: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createEmail).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Email.findByPk(res.body.data.createEmail.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        email: {
          id: record.id,
          email: 'updated-email@example.com',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateEmail).toBeDefined();
      expect(res.body.data.updateEmail.email).toEqual('updated-email@example.com');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Email');

      const variables = {
        email: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyEmail).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Email.findByPk(res.body.data.destroyEmail.id);
      expect(found).toBeNull();
    });
  });
});
