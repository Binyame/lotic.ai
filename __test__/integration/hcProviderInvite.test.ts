import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    hcProviderInvites {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    hcProviderInvite(id: $id) {
      id
      HCProvider {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($hcProviderInvite: HCProviderInviteCreate) {
    createHCProviderInvite(hcProviderInvite: $hcProviderInvite) {
      id
      code
      clinicians
    }
  }
`;

const UPDATE = `
  mutation update($hcProviderInvite: HCProviderInviteUpdate) {
    updateHCProviderInvite(hcProviderInvite: $hcProviderInvite) {
      id
      code
      clinicians
    }
  }
`;

const DESTROY = `
  mutation destroy($hcProviderInvite: HCProviderInviteDestroy) {
    destroyHCProviderInvite(hcProviderInvite: $hcProviderInvite) {
      id
    }
  }
`;

describe('Integration - HCProviderInvite', () => {
  let record, clinician, clinicians;

  beforeAll(async () => {
    clinician = await factory.create('Clinician', {
      providerId: '1234@example.com',
    });
    clinicians = JSON.stringify([clinician.toJSON()]);

    record = await factory.create('HCProviderInvite', {
      code: 'Example',
      clinicians,
    });
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.hcProviderInvites).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.hcProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('HCProviderInvite');
      const variables = {
        hcProviderInvites: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        hcProviderInvite: {
          id: record.id,
          code: 'Example',
          clinicians,
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('HCProviderInvite');

      const variables = {
        hcProviderInvite: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyHCProviderInvite).toBeNull();
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

      expect(res.body.data.hcProviderInvites).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('HCProviderInvite');
      const variables = {
        hcProviderInvite: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.create');
    });
    test('should NOT update', async () => {
      const variables = {
        hcProviderInvite: {
          id: record.id,
          code: 'Example',
          clinicians,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('HCProviderInvite');

      const variables = {
        hcProviderInvite: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.destroy');
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

      expect(res.body.data.hcProviderInvites).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('HCProviderInvite');
      const variables = {
        hcProviderInvite: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.create');
    });
    test('should NOT update', async () => {
      const variables = {
        hcProviderInvite: {
          id: record.id,
          code: 'Example',
          clinicians,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('HCProviderInvite');

      const variables = {
        hcProviderInvite: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.destroy');
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

      expect(res.body.data.hcProviderInvites).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('HCProviderInvite');
      const variables = {
        hcProviderInvite: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.create');
    });
    test('should NOT update', async () => {
      const variables = {
        hcProviderInvite: {
          id: record.id,
          code: 'Example',
          clinicians,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('HCProviderInvite');

      const variables = {
        hcProviderInvite: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProviderInvite).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProviderInvite.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'hcProviderInvite.list',
        'hcProviderInvite.read',
        'hcProviderInvite.create',
        'hcProviderInvite.update',
        'hcProviderInvite.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.hcProviderInvites).toBeDefined();
      expect(res.body.data.hcProviderInvites.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProviderInvite).toBeDefined();
      expect(res.body.data.hcProviderInvite.id).toEqual(record.id);
      expect(res.body.data.hcProviderInvite.HCProvider.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('HCProviderInvite');
      const variables = {
        hcProviderInvite: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProviderInvite).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.HCProviderInvite.findByPk(
        res.body.data.createHCProviderInvite.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        hcProviderInvite: {
          id: record.id,
          code: 'Example',
          clinicians,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProviderInvite).toBeDefined();
      expect(res.body.data.updateHCProviderInvite.code).toEqual('Example');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('HCProviderInvite');

      const variables = {
        hcProviderInvite: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProviderInvite).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.HCProviderInvite.findByPk(
        res.body.data.destroyHCProviderInvite.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'hcProviderInvite.list',
        'hcProviderInvite.read',
        'hcProviderInvite.create',
        'hcProviderInvite.update',
        'hcProviderInvite.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.hcProviderInvites).toBeDefined();
      expect(res.body.data.hcProviderInvites.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProviderInvite).toBeDefined();
      expect(res.body.data.hcProviderInvite.id).toEqual(record.id);
      expect(res.body.data.hcProviderInvite.HCProvider.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('HCProviderInvite');
      const variables = {
        hcProviderInvite: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProviderInvite).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.HCProviderInvite.findByPk(
        res.body.data.createHCProviderInvite.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        hcProviderInvite: {
          id: record.id,
          code: 'Example',
          clinicians,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProviderInvite).toBeDefined();
      expect(res.body.data.updateHCProviderInvite.code).toEqual('Example');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('HCProviderInvite');

      const variables = {
        hcProviderInvite: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProviderInvite).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.HCProviderInvite.findByPk(
        res.body.data.destroyHCProviderInvite.id
      );
      expect(found).toBeNull();
    });
  });

  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'hcProviderInvite.list',
        'hcProviderInvite.read',
        'hcProviderInvite.create',
        'hcProviderInvite.update',
        'hcProviderInvite.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.hcProviderInvites).toBeDefined();
      expect(res.body.data.hcProviderInvites.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProviderInvite).toBeDefined();
      expect(res.body.data.hcProviderInvite.id).toEqual(record.id);
      expect(res.body.data.hcProviderInvite.HCProvider.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('HCProviderInvite');
      const variables = {
        hcProviderInvite: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProviderInvite).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.HCProviderInvite.findByPk(
        res.body.data.createHCProviderInvite.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        hcProviderInvite: {
          id: record.id,
          code: 'Example',
          clinicians,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProviderInvite).toBeDefined();
      expect(res.body.data.updateHCProviderInvite.code).toEqual('Example');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('HCProviderInvite');

      const variables = {
        hcProviderInvite: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProviderInvite).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.HCProviderInvite.findByPk(
        res.body.data.destroyHCProviderInvite.id
      );
      expect(found).toBeNull();
    });
  });
});
