import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    patientReviews {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    patientReview(id: $id) {
      id
      patient {
        id
      }
      review {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($patientReview: PatientReviewCreate) {
    createPatientReview(patientReview: $patientReview) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($patientReview: PatientReviewUpdate) {
    updatePatientReview(patientReview: $patientReview) {
      id
    }
  }
`;

const DESTROY = `
  mutation destroy($patientReview: PatientReviewDestroy) {
    destroyPatientReview(patientReview: $patientReview) {
      id
    }
  }
`;

describe('Integration - PatientReview', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('PatientReview');
    await factory.create('PatientReview');
    await factory.create('PatientReview');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.patientReviews).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.patientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientReview');
      const variables = {
        patientReview: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createPatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        patientReview: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updatePatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientReview');

      const variables = {
        patientReview: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyPatientReview).toBeNull();
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

      expect(res.body.data.patientReviews).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientReview');
      const variables = {
        patientReview: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patientReview: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientReview');

      const variables = {
        patientReview: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.destroy');
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

      expect(res.body.data.patientReviews).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientReview');
      const variables = {
        patientReview: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patientReview: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientReview');

      const variables = {
        patientReview: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.destroy');
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

      expect(res.body.data.patientReviews).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientReview');
      const variables = {
        patientReview: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patientReview: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patientReview.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('PatientReview');

      const variables = {
        patientReview: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'Missing permission for patientReview.destroy'
      );
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'patientReview.list',
        'patientReview.read',
        'patientReview.create',
        'patientReview.update',
        'patientReview.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientReviews).toBeDefined();
      expect(res.body.data.patientReviews.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientReview).toBeDefined();
      expect(res.body.data.patientReview.id).toEqual(record.id);
      expect(res.body.data.patientReview.patient.id).toBeDefined();
      expect(res.body.data.patientReview.review.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('PatientReview');
      const variables = {
        patientReview: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientReview.findByPk(
        res.body.data.createPatientReview.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        patientReview: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('PatientReview');

      const variables = {
        patientReview: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientReview.findByPk(
        res.body.data.destroyPatientReview.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'patientReview.list',
        'patientReview.read',
        'patientReview.create',
        'patientReview.update',
        'patientReview.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientReviews).toBeDefined();
      expect(res.body.data.patientReviews.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientReview).toBeDefined();
      expect(res.body.data.patientReview.id).toEqual(record.id);
      expect(res.body.data.patientReview.patient.id).toBeDefined();
      expect(res.body.data.patientReview.review.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('PatientReview');
      const variables = {
        patientReview: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientReview.findByPk(
        res.body.data.createPatientReview.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        patientReview: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('PatientReview');

      const variables = {
        patientReview: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.PatientReview.findByPk(
        res.body.data.destroyPatientReview.id
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
        'patientReview.list',
        'patientReview.read',
        'patientReview.create',
        'patientReview.update',
        'patientReview.destroy',
      ]);
      token = await patient.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientReviews).toEqual([]);
      expect(res.body.errors).toBeUndefined();
    });
    test('should list my own', async () => {
      const record = await factory.create('PatientReview', {
        patientId: patient.id,
      });

      const res = await query(LIST, undefined, token);

      expect(res.body.data.patientReviews.length).toEqual(1);
      expect(res.body.data.patientReviews[0].id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientReview).toEqual(null);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      const record = await factory.create('PatientReview', {
        patientId: patient.id,
      });

      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patientReview.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('PatientReview');
      const variables = {
        patientReview: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        patientReview: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatientReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should soft destroy', async () => {
      const destroy = await factory.create('PatientReview');

      const variables = {
        patientReview: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatientReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const foundOne = await db.PatientReview.findOne({
        where: { id: res.body.data.destroyPatientReview.id },
      });
      const foundTwo = await db.PatientReview.findOne({
        where: { id: res.body.data.destroyPatientReview.id },
        paranoid: false,
      });

      expect(foundOne).toBeNull();
      expect(foundTwo.id).toEqual(res.body.data.destroyPatientReview.id);
    });
  });
});
