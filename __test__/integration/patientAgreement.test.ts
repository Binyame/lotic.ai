import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    patientAgreements {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    patientAgreement(id: $id) {
      id
      patient {
        id
      }
      agreement {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($patientAgreement: PatientAgreementCreate) {
    createPatientAgreement(patientAgreement: $patientAgreement) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($patientAgreement: PatientAgreementUpdate) {
    updatePatientAgreement(patientAgreement: $patientAgreement) {
      id
      agreed
    }
  }
`;

const DESTROY = `
  mutation destroy($patientAgreement: PatientAgreementDestroy) {
    destroyPatientAgreement(patientAgreement: $patientAgreement) {
      id
    }
  }
`;

describe('Integration - PatientAgreement', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('PatientAgreement');
    await factory.create('PatientAgreement');
    await factory.create('PatientAgreement');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.patientAgreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.patientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientAgreement');
      const variables = {
        patientAgreement: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createPatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        patientAgreement: {
          id: record.id,
          agreed: false,
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updatePatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientAgreement');

      const variables = {
        patientAgreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyPatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized.');
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

      expect(res.body.data.patientAgreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientAgreement');
      const variables = {
        patientAgreement: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patientAgreement: {
          id: record.id,
          agreed: false,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientAgreement');

      const variables = {
        patientAgreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.destroy');
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

      expect(res.body.data.patientAgreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientAgreement');
      const variables = {
        patientAgreement: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patientAgreement: {
          id: record.id,
          agreed: false,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientAgreement');

      const variables = {
        patientAgreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.destroy');
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

      expect(res.body.data.patientAgreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientAgreement');
      const variables = {
        patientAgreement: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAgreement.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patientAgreement: {
          id: record.id,
          agreed: false,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientAgreement');

      const variables = {
        patientAgreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'patientAgreement.list',
        'patientAgreement.read',
        'patientAgreement.create',
        'patientAgreement.update',
        'patientAgreement.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientAgreements).toBeDefined();
      expect(res.body.data.patientAgreements.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });

    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAgreement).toBeDefined();
      expect(res.body.data.patientAgreement.id).toEqual(record.id);
      expect(res.body.data.patientAgreement.patient.id).toBeDefined();
      expect(res.body.data.patientAgreement.agreement.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('PatientAgreement');
      const variables = {
        patientAgreement: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientAgreement.findByPk(
        res.body.data.createPatientAgreement.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        patientAgreement: {
          id: record.id,
          agreed: false,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAgreement).toBeDefined();
      expect(res.body.data.updatePatientAgreement.agreed).toEqual(false);
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('PatientAgreement');

      const variables = {
        patientAgreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientAgreement.findByPk(
        res.body.data.destroyPatientAgreement.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'patientAgreement.list',
        'patientAgreement.read',
        'patientAgreement.create',
        'patientAgreement.update',
        'patientAgreement.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientAgreements).toBeDefined();
      expect(res.body.data.patientAgreements.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });

    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAgreement).toBeDefined();
      expect(res.body.data.patientAgreement.id).toEqual(record.id);
      expect(res.body.data.patientAgreement.patient.id).toBeDefined();
      expect(res.body.data.patientAgreement.agreement.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('PatientAgreement');
      const variables = {
        patientAgreement: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientAgreement.findByPk(
        res.body.data.createPatientAgreement.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        patientAgreement: {
          id: record.id,
          agreed: false,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAgreement).toBeDefined();
      expect(res.body.data.updatePatientAgreement.agreed).toEqual(false);
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('PatientAgreement');

      const variables = {
        patientAgreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientAgreement.findByPk(
        res.body.data.destroyPatientAgreement.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;
    let patient;

    beforeEach(async () => {
      patient = await factory.create('Patient');
      await patient.addPermissions([
        'patientAgreement.list',
        'patientAgreement.read',
        'patientAgreement.create',
        'patientAgreement.update',
        'patientAgreement.destroy',
      ]);
      token = await patient.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientAgreements).toEqual([]);
      expect(res.body.errors).toBeUndefined();
    });
    test('should list my own', async () => {
      const record = await factory.create('PatientAgreement', {
        patientId: patient.id,
      });

      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientAgreements.length).toEqual(1);
      expect(res.body.data.patientAgreements[0].id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAgreement).toEqual(null);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      const record = await factory.create('PatientAgreement', {
        patientId: patient.id,
      });

      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAgreement.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('PatientAgreement');
      const variables = {
        patientAgreement: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientAgreement.findByPk(
        res.body.data.createPatientAgreement.id
      );
      expect(found).toBeDefined();
    });
    test('should NOT update', async () => {
      const variables = {
        patientAgreement: {
          id: record.id,
          agreed: false,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientAgreement');

      const variables = {
        patientAgreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
  });
});
