import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    agreements {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    agreement(id: $id) {
      id
      clinicianAgreements {
        id
      }
      patientAgreements {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($agreement: AgreementCreate) {
    createAgreement(agreement: $agreement) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($agreement: AgreementUpdate) {
    updateAgreement(agreement: $agreement) {
      id
    }
  }
`;

const DESTROY = `
  mutation destroy($agreement: AgreementDestroy) {
    destroyAgreement(agreement: $agreement) {
      id
    }
  }
`;

describe('Integration - Agreement', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('Agreement');
    await factory.create('ClinicianAgreement', { agreementId: record.id });
    await factory.create('PatientAgreement', { agreementId: record.id });
    await factory.create('Agreement');
    await factory.create('Agreement');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.agreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.agreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Agreement');
      const variables = {
        agreement: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        agreement: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Agreement');

      const variables = {
        agreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyAgreement).toBeNull();
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

      expect(res.body.data.agreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.agreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Agreement');
      const variables = {
        agreement: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.create');
    });
    test('should NOT update', async () => {
      const variables = {
        agreement: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Agreement');

      const variables = {
        agreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.destroy');
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

      expect(res.body.data.agreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.agreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Agreement');
      const variables = {
        agreement: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.create');
    });
    test('should NOT update', async () => {
      const variables = {
        agreement: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Agreement');

      const variables = {
        agreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.destroy');
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

      expect(res.body.data.agreements).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.agreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Agreement');
      const variables = {
        agreement: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.create');
    });
    test('should NOT update', async () => {
      const variables = {
        agreement: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Agreement');

      const variables = {
        agreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAgreement).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('agreement.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'agreement.list',
        'agreement.read',
        'agreement.create',
        'agreement.update',
        'agreement.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.agreements).toBeDefined();
      expect(res.body.data.agreements.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.agreement).toBeDefined();
      expect(res.body.data.agreement.id).toEqual(record.id);
      expect(
        res.body.data.agreement.clinicianAgreements.length
      ).toBeGreaterThan(0);
      expect(res.body.data.agreement.patientAgreements.length).toBeGreaterThan(
        0
      );
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Agreement');
      const variables = {
        agreement: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Agreement.findByPk(
        res.body.data.createAgreement.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        agreement: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Agreement');

      const variables = {
        agreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Agreement.findByPk(
        res.body.data.destroyAgreement.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'agreement.list',
        'agreement.read',
        'agreement.create',
        'agreement.update',
        'agreement.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.agreements).toBeDefined();
      expect(res.body.data.agreements.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.agreement).toBeDefined();
      expect(res.body.data.agreement.id).toEqual(record.id);
      expect(
        res.body.data.agreement.clinicianAgreements.length
      ).toBeGreaterThan(0);
      expect(res.body.data.agreement.patientAgreements.length).toBeGreaterThan(
        0
      );
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Agreement');
      const variables = {
        agreement: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Agreement.findByPk(
        res.body.data.createAgreement.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        agreement: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Agreement');

      const variables = {
        agreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Agreement.findByPk(
        res.body.data.destroyAgreement.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'agreement.list',
        'agreement.read',
        'agreement.create',
        'agreement.update',
        'agreement.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.agreements).toBeDefined();
      expect(res.body.data.agreements.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.agreement).toBeDefined();
      expect(res.body.data.agreement.id).toEqual(record.id);
      expect(
        res.body.data.agreement.clinicianAgreements.length
      ).toBeGreaterThan(0);
      expect(res.body.data.agreement.patientAgreements.length).toBeGreaterThan(
        0
      );
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Agreement');
      const variables = {
        agreement: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Agreement.findByPk(
        res.body.data.createAgreement.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        agreement: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Agreement');

      const variables = {
        agreement: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAgreement).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Agreement.findByPk(
        res.body.data.destroyAgreement.id
      );
      expect(found).toBeNull();
    });
  });
});
