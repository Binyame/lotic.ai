import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    careTeamCodes{
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    careTeamCode(id: $id) {
      id
      clinician {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($careTeamCode: CareTeamCodeCreate) {
    createCareTeamCode(careTeamCode: $careTeamCode) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($careTeamCode: CareTeamCodeUpdate) {
    updateCareTeamCode(careTeamCode: $careTeamCode) {
      id
    }
  }
`;

const DESTROY = `
  mutation destroy($careTeamCode: CareTeamCodeDestroy) {
    destroyCareTeamCode(careTeamCode: $careTeamCode) {
      id
    }
  }
`;

describe('Integration - CareTeamCode', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('CareTeamCode');
    await factory.create('CareTeamCode');
    await factory.create('CareTeamCode');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.careTeamCodes).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.careTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('CareTeamCode');
      const variables = {
        careTeamCode: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        careTeamCode: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('CareTeamCode');

      const variables = {
        careTeamCode: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyCareTeamCode).toBeNull();
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

      expect(res.body.data.careTeamCodes).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.careTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('CareTeamCode');
      const variables = {
        careTeamCode: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.create');
    });
    test('should NOT update', async () => {
      const variables = {
        careTeamCode: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('CareTeamCode');

      const variables = {
        careTeamCode: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.destroy');
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

      expect(res.body.data.careTeamCodes).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.careTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('CareTeamCode');
      const variables = {
        careTeamCode: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.create');
    });
    test('should NOT update', async () => {
      const variables = {
        careTeamCode: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('CareTeamCode');

      const variables = {
        careTeamCode: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.destroy');
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

      expect(res.body.data.careTeamCodes).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.careTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('CareTeamCode');
      const variables = {
        careTeamCode: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.create');
    });
    test('should NOT update', async () => {
      const variables = {
        careTeamCode: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('CareTeamCode');

      const variables = {
        careTeamCode: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('careTeamCode.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'careTeamCode.list',
        'careTeamCode.read',
        'careTeamCode.create',
        'careTeamCode.update',
        'careTeamCode.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.careTeamCodes).toBeDefined();
      expect(res.body.data.careTeamCodes.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.careTeamCode).toBeDefined();
      expect(res.body.data.careTeamCode.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('CareTeamCode');
      const variables = {
        careTeamCode: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createCareTeamCode).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.CareTeamCode.findByPk(
        res.body.data.createCareTeamCode.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        careTeamCode: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateCareTeamCode).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('CareTeamCode');

      const variables = {
        careTeamCode: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyCareTeamCode).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.CareTeamCode.findByPk(
        res.body.data.destroyCareTeamCode.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token, usr;

    beforeAll(async () => {
      usr = await factory.create('Clinician');
      await usr.addPermissions([
        'careTeamCode.list',
        'careTeamCode.read',
        'careTeamCode.create',
        'careTeamCode.update',
        'careTeamCode.destroy',
      ]);
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.careTeamCodes).toEqual([]);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.careTeamCode).toEqual(null);
      expect(res.body.errors).toBeUndefined();
    });
    test('should list my own', async () => {
      const record = await factory.create('CareTeamCode', {
        clinicianId: usr.id,
      });

      const res = await query(LIST, undefined, token);

      expect(res.body.data.careTeamCodes.length).toEqual(1);
      expect(res.body.data.careTeamCodes[0].id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      const record = await factory.create('CareTeamCode', {
        clinicianId: usr.id,
      });

      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.careTeamCode.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('CareTeamCode');
      const variables = {
        careTeamCode: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        careTeamCode: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateCareTeamCode).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('CareTeamCode');

      const variables = {
        careTeamCode: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyCareTeamCode).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
  });
  describe('Patient: with Permissions', () => {
    let token, usr;

    beforeAll(async () => {
      usr = await factory.create('Patient');
      await usr.addPermissions([
        'careTeamCode.list',
        'careTeamCode.read',
        'careTeamCode.create',
        'careTeamCode.update',
        'careTeamCode.destroy',
      ]);
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.careTeamCodes).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.careTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('CareTeamCode');
      const variables = {
        careTeamCode: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        careTeamCode: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('CareTeamCode');

      const variables = {
        careTeamCode: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyCareTeamCode).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
  });
});
