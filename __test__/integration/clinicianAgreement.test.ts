import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    clinicianAgreements {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    clinicianAgreement(id: $id) {
      id
      clinician {
        id
      }
      agreement {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($clinicianAgreement: ClinicianAgreementCreate) {
    createClinicianAgreement(clinicianAgreement: $clinicianAgreement) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($clinicianAgreement: ClinicianAgreementUpdate) {
    updateClinicianAgreement(clinicianAgreement: $clinicianAgreement) {
      id
      agreed
    }
  }
`;

const DESTROY = `
  mutation destroy($clinicianAgreement: ClinicianAgreementDestroy) {
    destroyClinicianAgreement(clinicianAgreement: $clinicianAgreement) {
      id
    }
  }
`;

describe('Integration - ClinicianAgreement', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('ClinicianAgreement');
    await factory.create('ClinicianAgreement');
    await factory.create('ClinicianAgreement');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.clinicianAgreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.clinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('ClinicianAgreement');
      const variables = {
        clinicianAgreement: attrs
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        clinicianAgreement: {
          id: record.id,
          agreed: false
        }
      }
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const variables = {
        clinicianAgreement: {
          id: record.id,
        }
      }
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyClinicianAgreement).toBeNull();
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

      expect(res.body.data.clinicianAgreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('ClinicianAgreement');
      const variables = {
        clinicianAgreement: attrs
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.create');
    });
    test('should NOT update', async () => {
      const variables = {
        clinicianAgreement: {
          id: record.id,
          agreed: false
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('ClinicianAgreement');

      const variables = {
        clinicianAgreement: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.destroy');
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

      expect(res.body.data.clinicianAgreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('ClinicianAgreement');
      const variables = {
        clinicianAgreement: attrs
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.create');
    });
    test('should NOT update', async () => {
      const variables = {
        clinicianAgreement: {
          id: record.id,
          agreed: false
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('ClinicianAgreement');

      const variables = {
        clinicianAgreement: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.destroy');
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

      expect(res.body.data.clinicianAgreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('ClinicianAgreement');
      const variables = {
        clinicianAgreement: attrs
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.create');
    });
    test('should NOT update', async () => {
      const variables = {
        clinicianAgreement: {
          id: record.id,
          agreed: false
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('ClinicianAgreement');

      const variables = {
        clinicianAgreement: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinicianAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinicianAgreement.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'clinicianAgreement.list',
        'clinicianAgreement.read',
        'clinicianAgreement.create',
        'clinicianAgreement.update',
        'clinicianAgreement.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.clinicianAgreements).toBeDefined();
      expect(res.body.data.clinicianAgreements.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinicianAgreement).toBeDefined();
      expect(res.body.data.clinicianAgreement.id).toEqual(record.id);
      expect(res.body.data.clinicianAgreement.clinician.id).toBeDefined();
      expect(res.body.data.clinicianAgreement.agreement.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('ClinicianAgreement');
      const variables = {
        clinicianAgreement: attrs
      }
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinicianAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ClinicianAgreement.findByPk(res.body.data.createClinicianAgreement.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        clinicianAgreement: {
          id: record.id,
          agreed: false
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinicianAgreement).toBeDefined();
      expect(res.body.data.updateClinicianAgreement.agreed).toEqual(false);
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('ClinicianAgreement');

      const variables = {
        clinicianAgreement: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinicianAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ClinicianAgreement.findByPk(res.body.data.destroyClinicianAgreement.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;
    let clinician;

    beforeAll(async () => {
      clinician = await factory.create('Clinician');
      await clinician.addPermissions([
        'clinicianAgreement.list',
        'clinicianAgreement.read',
        'clinicianAgreement.create',
        'clinicianAgreement.update',
        'clinicianAgreement.destroy',
      ]);
      token = await clinician.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.clinicianAgreements).toEqual([]);
      expect(res.body.errors).toBeUndefined();
    });
    test('should list my own', async () => {
      const record = await factory.create('ClinicianAgreement', {
        clinicianId: clinician.id
      })

      const res = await query(LIST, undefined, token);

      expect(res.body.data.clinicianAgreements).toBeDefined();
      expect(res.body.data.clinicianAgreements.length).toEqual(1);
      expect(res.body.data.clinicianAgreements[0].id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinicianAgreement).toEqual(null);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      const record = await factory.create('ClinicianAgreement', {
        clinicianId: clinician.id
      })

      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinicianAgreement).toBeDefined();
      expect(res.body.data.clinicianAgreement.id).toEqual(record.id);
      expect(res.body.data.clinicianAgreement.clinician.id).toBeDefined();
      expect(res.body.data.clinicianAgreement.agreement.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('ClinicianAgreement');
      const variables = {
        clinicianAgreement: attrs
      }
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinicianAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ClinicianAgreement.findByPk(res.body.data.createClinicianAgreement.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        clinicianAgreement: {
          id: record.id,
          agreed: false
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinicianAgreement).toBeDefined();
      expect(res.body.data.updateClinicianAgreement.agreed).toEqual(false);
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('ClinicianAgreement');

      const variables = {
        clinicianAgreement: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinicianAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ClinicianAgreement.findByPk(res.body.data.destroyClinicianAgreement.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'clinicianAgreement.list',
        'clinicianAgreement.read',
        'clinicianAgreement.create',
        'clinicianAgreement.update',
        'clinicianAgreement.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.clinicianAgreements).toBeDefined();
      expect(res.body.data.clinicianAgreements.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinicianAgreement).toBeDefined();
      expect(res.body.data.clinicianAgreement.id).toEqual(record.id);
      expect(res.body.data.clinicianAgreement.clinician.id).toBeDefined();
      expect(res.body.data.clinicianAgreement.agreement.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('ClinicianAgreement');
      const variables = {
        clinicianAgreement: attrs
      }
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinicianAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ClinicianAgreement.findByPk(res.body.data.createClinicianAgreement.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        clinicianAgreement: {
          id: record.id,
          agreed: false
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinicianAgreement).toBeDefined();
      expect(res.body.data.updateClinicianAgreement.agreed).toEqual(false);
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('ClinicianAgreement');

      const variables = {
        clinicianAgreement: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinicianAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ClinicianAgreement.findByPk(res.body.data.destroyClinicianAgreement.id);
      expect(found).toBeNull();
    });
  });
});