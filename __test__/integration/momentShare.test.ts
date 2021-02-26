import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    momentShares {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    momentShare(id: $id) {
      id
      moment {
        uuid
      }
      clinicians {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($momentShare: MomentShareCreate) {
    createMomentShare(momentShare: $momentShare) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($momentShare: MomentShareUpdate) {
    updateMomentShare(momentShare: $momentShare) {
      id
      uri
    }
  }
`;

const DESTROY = `
  mutation destroy($momentShare: MomentShareDestroy) {
    destroyMomentShare(momentShare: $momentShare) {
      id
    }
  }
`;

describe('Integration - MomentShare', () => {
  let record, clinician;

  beforeAll(async () => {
    record = await factory.create('MomentShare', { uri: 'https://www.example.com/moment/asfdfd' });
    const opts = { momentShareId: record.id }

    clinician = await factory.create('Clinician');
    await factory.create('MomentShareClinician', {
      ...opts,
      clinicianId: clinician.id
    });

    await factory.create('MomentShare');
    await factory.create('MomentShare');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.momentShares).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.momentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('MomentShare');
      const variables = {
        momentShare: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        momentShare: {
          id: record.id,
          uri: 'https://www.example.com/moment/asfdfd'
        }
      }
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('MomentShare');

      const variables = {
        momentShare: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyMomentShare).toBeNull();
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

      expect(res.body.data.momentShares).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.momentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('MomentShare');
      const variables = {
        momentShare: attrs
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.create');
    });
    test('should NOT update', async () => {
      const variables = {
        momentShare: {
          id: record.id,
          uri: 'https://www.example.com/moment/asfdfd'
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('MomentShare');

      const variables = {
        momentShare: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.destroy');
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

      expect(res.body.data.momentShares).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.momentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('MomentShare');
      const variables = {
        momentShare: attrs
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.create');
    });
    test('should NOT update', async () => {
      const variables = {
        momentShare: {
          id: record.id,
          uri: 'https://www.example.com/moment/asfdfd'
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('MomentShare');

      const variables = {
        momentShare: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.destroy');
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

      expect(res.body.data.momentShares).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.momentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('MomentShare');
      const variables = {
        momentShare: attrs
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.create');
    });
    test('should NOT update', async () => {
      const variables = {
        momentShare: {
          id: record.id,
          uri: 'https://www.example.com/moment/asfdfd'
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('MomentShare');

      const variables = {
        momentShare: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMomentShare).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('momentShare.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'momentShare.list',
        'momentShare.read',
        'momentShare.create',
        'momentShare.update',
        'momentShare.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.momentShares).toBeDefined();
      expect(res.body.data.momentShares.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.momentShare).toBeDefined();
      expect(res.body.data.momentShare.id).toEqual(record.id);
      expect(res.body.data.momentShare.moment.uuid).toBeDefined();
      expect(res.body.data.momentShare.clinicians.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('MomentShare');
      const variables = {
        momentShare: attrs
      }
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createMomentShare).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentShare.findByPk(res.body.data.createMomentShare.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        momentShare: {
          id: record.id,
          uri: 'https://www.example.com/moment/asfdfd'
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMomentShare).toBeDefined();
      expect(res.body.data.updateMomentShare.uri).toEqual('https://www.example.com/moment/asfdfd');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('MomentShare');

      const variables = {
        momentShare: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMomentShare).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentShare.findByPk(res.body.data.destroyMomentShare.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'momentShare.list',
        'momentShare.read',
        'momentShare.create',
        'momentShare.update',
        'momentShare.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.momentShares).toBeDefined();
      expect(res.body.data.momentShares.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.momentShare).toBeDefined();
      expect(res.body.data.momentShare.id).toEqual(record.id);
      expect(res.body.data.momentShare.moment.uuid).toBeDefined();
      expect(res.body.data.momentShare.clinicians.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('MomentShare');
      const variables = {
        momentShare: attrs
      }
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createMomentShare).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentShare.findByPk(res.body.data.createMomentShare.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        momentShare: {
          id: record.id,
          uri: 'https://www.example.com/moment/asfdfd'
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMomentShare).toBeDefined();
      expect(res.body.data.updateMomentShare.uri).toEqual('https://www.example.com/moment/asfdfd');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('MomentShare');

      const variables = {
        momentShare: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMomentShare).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentShare.findByPk(res.body.data.destroyMomentShare.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'momentShare.list',
        'momentShare.read',
        'momentShare.create',
        'momentShare.update',
        'momentShare.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.momentShares).toBeDefined();
      expect(res.body.data.momentShares.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.momentShare).toBeDefined();
      expect(res.body.data.momentShare.id).toEqual(record.id);
      expect(res.body.data.momentShare.moment.uuid).toBeDefined();
      expect(res.body.data.momentShare.clinicians.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('MomentShare');
      const variables = {
        momentShare: attrs
      }
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createMomentShare).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentShare.findByPk(res.body.data.createMomentShare.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        momentShare: {
          id: record.id,
          uri: 'https://www.example.com/moment/asfdfd'
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMomentShare).toBeDefined();
      expect(res.body.data.updateMomentShare.uri).toEqual('https://www.example.com/moment/asfdfd');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('MomentShare');

      const variables = {
        momentShare: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMomentShare).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.MomentShare.findByPk(res.body.data.destroyMomentShare.id);
      expect(found).toBeNull();
    });
  });
});