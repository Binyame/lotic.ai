import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    patientAssessments {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    patientAssessment(id: $id) {
      id
      patient {
        id
      }
      assessment {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($patientAssessment: PatientAssessmentCreate) {
    createPatientAssessment(patientAssessment: $patientAssessment) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($patientAssessment: PatientAssessmentUpdate) {
    updatePatientAssessment(patientAssessment: $patientAssessment) {
      id
      type
    }
  }
`;

const DESTROY = `
  mutation destroy($patientAssessment: PatientAssessmentDestroy) {
    destroyPatientAssessment(patientAssessment: $patientAssessment) {
      id
    }
  }
`;

describe('Integration - PatientAssessment', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('PatientAssessment');
    await factory.create('PatientAssessment');
    await factory.create('PatientAssessment');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.patientAssessments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.patientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientAssessment');
      const variables = {
        patientAssessment: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createPatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        patientAssessment: {
          id: record.id,
          type: 'lotic',
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updatePatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientAssessment');

      const variables = {
        patientAssessment: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyPatientAssessment).toBeNull();
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

      expect(res.body.data.patientAssessments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientAssessment');
      const variables = {
        patientAssessment: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patientAssessment: {
          id: record.id,
          type: 'lotic',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientAssessment');

      const variables = {
        patientAssessment: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.destroy');
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

      expect(res.body.data.patientAssessments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientAssessment');
      const variables = {
        patientAssessment: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patientAssessment: {
          id: record.id,
          type: 'lotic',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientAssessment');

      const variables = {
        patientAssessment: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.destroy');
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

      expect(res.body.data.patientAssessments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientAssessment.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientAssessment');
      const variables = {
        patientAssessment: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        patientAssessment: {
          id: record.id,
          type: 'lotic',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientAssessment');

      const variables = {
        patientAssessment: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'Missing permission for patientAssessment.destroy'
      );
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'patientAssessment.list',
        'patientAssessment.read',
        'patientAssessment.create',
        'patientAssessment.update',
        'patientAssessment.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientAssessments).toBeDefined();
      expect(res.body.data.patientAssessments.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAssessment).toBeDefined();
      expect(res.body.data.patientAssessment.id).toEqual(record.id);
      expect(res.body.data.patientAssessment.patient.id).toBeDefined();
      expect(res.body.data.patientAssessment.assessment.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('PatientAssessment');
      const variables = {
        patientAssessment: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAssessment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientAssessment.findByPk(
        res.body.data.createPatientAssessment.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        patientAssessment: {
          id: record.id,
          type: 'lotic',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAssessment).toBeDefined();
      expect(res.body.data.updatePatientAssessment.type).toEqual('lotic');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('PatientAssessment');

      const variables = {
        patientAssessment: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAssessment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientAssessment.findByPk(
        res.body.data.destroyPatientAssessment.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'patientAssessment.list',
        'patientAssessment.read',
        'patientAssessment.create',
        'patientAssessment.update',
        'patientAssessment.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientAssessments).toBeDefined();
      expect(res.body.data.patientAssessments.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAssessment).toBeDefined();
      expect(res.body.data.patientAssessment.id).toEqual(record.id);
      expect(res.body.data.patientAssessment.patient.id).toBeDefined();
      expect(res.body.data.patientAssessment.assessment.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('PatientAssessment');
      const variables = {
        patientAssessment: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAssessment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientAssessment.findByPk(
        res.body.data.createPatientAssessment.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        patientAssessment: {
          id: record.id,
          type: 'lotic',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAssessment).toBeDefined();
      expect(res.body.data.updatePatientAssessment.type).toEqual('lotic');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('PatientAssessment');

      const variables = {
        patientAssessment: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAssessment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientAssessment.findByPk(
        res.body.data.destroyPatientAssessment.id
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
        'patientAssessment.list',
        'patientAssessment.read',
        'patientAssessment.create',
        'patientAssessment.update',
        'patientAssessment.destroy',
      ]);
      token = await patient.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientAssessments).toEqual([]);
      expect(res.body.errors).toBeUndefined();
    });
    test('should list my own', async () => {
      const record = await factory.create('PatientAssessment', {
        patientId: patient.id,
      });

      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientAssessments.length).toEqual(1);
      expect(res.body.data.patientAssessments[0].id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAssessment).toEqual(null);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      const record = await factory.create('PatientAssessment', {
        patientId: patient.id,
      });

      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientAssessment.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientAssessment');
      const variables = {
        patientAssessment: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        patientAssessment: {
          id: record.id,
          type: 'lotic',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should soft destroy', async () => {
      const destroy = await factory.create('PatientAssessment');

      const variables = {
        patientAssessment: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientAssessment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const foundOne = await db.PatientAssessment.findOne({
        where: { id: res.body.data.destroyPatientAssessment.id },
      });
      const foundTwo = await db.PatientAssessment.findOne({
        where: { id: res.body.data.destroyPatientAssessment.id },
        paranoid: false,
      });

      expect(foundOne).toBeNull();
      expect(foundTwo.id).toEqual(res.body.data.destroyPatientAssessment.id);
    });
  });
});
