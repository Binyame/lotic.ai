import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    hcProviders {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    hcProvider(id: $id) {
      id
      HCProviderInvites {
        id
      }
      clinicians {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($hcProvider: HCProviderCreate) {
    createHCProvider(hcProvider: $hcProvider) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($hcProvider: HCProviderUpdate) {
    updateHCProvider(hcProvider: $hcProvider) {
      id
    }
  }
`;

const DESTROY = `
  mutation destroy($hcProvider: HCProviderDestroy) {
    destroyHCProvider(hcProvider: $hcProvider) {
      id
    }
  }
`;

describe('Integration - HCProvider', () => {
  let record, clinician;

  beforeAll(async () => {
    record = await factory.create('HCProvider');
    clinician = await factory.create('Clinician', {
      providerId: '1234@example.com',
    });
    const clinicians = JSON.stringify([clinician.toJSON()]);
    const opts = { providerId: record.id, code: 'Example', clinicians };

    await factory.create('HCProviderInvite', opts);
    await factory.create('HCProviderClinician', {
      ...{ hcProviderId: record.id },
      clinicianId: clinician.id
    });

    await factory.create('HCProvider');
    await factory.create('HCProvider');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.hcProviders).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.hcProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('HCProvider');
      const variables = {
        hcProvider: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        hcProvider: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('HCProvider');

      const variables = {
        hcProvider: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyHCProvider).toBeNull();
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

      expect(res.body.data.hcProviders).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('HCProvider');
      const variables = {
        hcProvider: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.create');
    });
    test('should NOT update', async () => {
      const variables = {
        hcProvider: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('HCProvider');

      const variables = {
        hcProvider: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.destroy');
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

      expect(res.body.data.hcProviders).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('HCProvider');
      const variables = {
        hcProvider: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.create');
    });
    test('should NOT update', async () => {
      const variables = {
        hcProvider: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('HCProvider');

      const variables = {
        hcProvider: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.destroy');
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

      expect(res.body.data.hcProviders).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('HCProvider');
      const variables = {
        hcProvider: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.create');
    });
    test('should NOT update', async () => {
      const variables = {
        hcProvider: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('HCProvider');

      const variables = {
        hcProvider: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('hcProvider.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'hcProvider.list',
        'hcProvider.read',
        'hcProvider.create',
        'hcProvider.update',
        'hcProvider.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.hcProviders).toBeDefined();
      expect(res.body.data.hcProviders.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProvider).toBeDefined();
      expect(res.body.data.hcProvider.id).toEqual(record.id);
      expect(res.body.data.hcProvider.HCProviderInvites.length).toBeGreaterThan(
        0
      );
      expect(res.body.data.hcProvider.clinicians.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('HCProvider');
      const variables = {
        hcProvider: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.HCProvider.findByPk(
        res.body.data.createHCProvider.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        hcProvider: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('HCProvider');

      const variables = {
        hcProvider: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.HCProvider.findByPk(
        res.body.data.destroyHCProvider.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'hcProvider.list',
        'hcProvider.read',
        'hcProvider.create',
        'hcProvider.update',
        'hcProvider.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.hcProviders).toBeDefined();
      expect(res.body.data.hcProviders.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProvider).toBeDefined();
      expect(res.body.data.hcProvider.id).toEqual(record.id);
      expect(res.body.data.hcProvider.HCProviderInvites.length).toBeGreaterThan(
        0
      );
      expect(res.body.data.hcProvider.clinicians.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('HCProvider');
      const variables = {
        hcProvider: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should update', async () => {
      const variables = {
        hcProvider: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should destroy', async () => {
      const destroy = await factory.create('HCProvider');

      const variables = {
        hcProvider: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'hcProvider.list',
        'hcProvider.read',
        'hcProvider.create',
        'hcProvider.update',
        'hcProvider.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.hcProviders).toBeDefined();
      expect(res.body.data.hcProviders.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.hcProvider).toBeDefined();
      expect(res.body.data.hcProvider.id).toEqual(record.id);
      expect(res.body.data.hcProvider.HCProviderInvites.length).toBeGreaterThan(
        0
      );
      expect(res.body.data.hcProvider.clinicians.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('HCProvider');
      const variables = {
        hcProvider: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createHCProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.HCProvider.findByPk(
        res.body.data.createHCProvider.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        hcProvider: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateHCProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('HCProvider');

      const variables = {
        hcProvider: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyHCProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.HCProvider.findByPk(
        res.body.data.destroyHCProvider.id
      );
      expect(found).toBeNull();
    });
  });
});
