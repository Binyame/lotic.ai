import { resolve } from 'path';
import { v4 } from 'uuid';
import { factory, db, query, mutate, formMutate } from '../utils';

const assetsDir = resolve(__dirname, '../assets');

const LIST = `
  query list {
    moments {
      uuid
    }
  }
`;

const READ = `
  query read($uuid: String!) {
    moment(uuid: $uuid) {
      uuid
      patient {
        id
      }
      assessment {
        id
      }
      momentPrompts {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($moment: MomentCreate) {
    createMoment(moment: $moment)
  }
`;

const UPDATE = `
  mutation update($moment: MomentUpdate) {
    updateMoment(moment: $moment) {
      uuid
      uri
    }
  }
`;

const DESTROY = `
  mutation destroy($moment: MomentDestroy) {
    destroyMoment(moment: $moment) {
      uuid
    }
  }
`;

describe('Integration - Moment', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('Moment');
    const opts = { momentUuid: record.uuid };
    await factory.create('MomentPrompt', opts);

    await factory.create('Moment');
    await factory.create('Moment');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.moments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { uuid: record.uuid });

      expect(res.body.data.moment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Moment');
      const variables = {
        moment: {
          ...attrs,
          fileName: `${v4()}.mp4`,
        },
      };

      const res = await formMutate(CREATE, variables);

      expect(res.body.data.createMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        moment: {
          uuid: record.uuid,
          uri: 'https://www.example.com/updated',
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Moment');

      const variables = {
        moment: {
          uuid: destroy.uuid,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyMoment).toBeNull();
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

      expect(res.body.data.moments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { uuid: record.uuid }, token);

      expect(res.body.data.moment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Moment');
      const variables = {
        moment: {
          ...attrs,
          fileName: `${v4()}.mp4`,
        },
      };

      const res = await formMutate(CREATE, variables, token);

      expect(res.body.data.createMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
    });
    test('should NOT update', async () => {
      const variables = {
        moment: {
          uuid: record.uuid,
          uri: 'https://www.example.com/updated',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Moment');

      const variables = {
        moment: {
          uuid: destroy.uuid,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.destroy');
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

      expect(res.body.data.moments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { uuid: record.uuid }, token);

      expect(res.body.data.moment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Moment');
      const variables = {
        moment: {
          ...attrs,
          fileName: `${v4()}.mp4`,
        },
      };

      const res = await formMutate(CREATE, variables, token);

      expect(res.body.data.createMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
    });
    test('should NOT update', async () => {
      const variables = {
        moment: {
          uuid: record.uuid,
          uri: 'https://www.example.com/updated',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Moment');

      const variables = {
        moment: {
          uuid: destroy.uuid,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.destroy');
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

      expect(res.body.data.moments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { uuid: record.uuid }, token);

      expect(res.body.data.moment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Moment');
      const variables = {
        moment: {
          ...attrs,
          fileName: `${v4()}.mp4`,
        },
      };

      const res = await formMutate(CREATE, variables, token);

      expect(res.body.data.createMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
    });
    test('should NOT update', async () => {
      const variables = {
        moment: {
          uuid: record.uuid,
          uri: 'https://www.example.com/updated',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Moment');

      const variables = {
        moment: {
          uuid: destroy.uuid,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('moment.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'moment.list',
        'moment.read',
        'moment.create',
        'moment.update',
        'moment.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.moments).toBeDefined();
      expect(res.body.data.moments.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { uuid: record.uuid }, token);

      expect(res.body.data.moment).toBeDefined();
      expect(res.body.data.moment.uuid).toEqual(record.uuid);
      expect(res.body.data.moment.patient.id).toBeDefined();
      expect(res.body.data.moment.assessment.id).toBeDefined();
      expect(res.body.data.moment.momentPrompts.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Moment');
      const variables = {
        moment: {
          ...attrs,
          fileName: `${v4()}.mp4`,
        },
      };

      const res = await formMutate(CREATE, variables, token);

      expect(res.body.data.createMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        moment: {
          uuid: record.uuid,
          uri: 'https://www.example.com/updated',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMoment).toBeDefined();
      expect(res.body.data.updateMoment.uri).toEqual(
        'https://www.example.com/updated'
      );
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Moment');

      const variables = {
        moment: {
          uuid: destroy.uuid,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMoment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Moment.findByPk(res.body.data.destroyMoment.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'moment.list',
        'moment.read',
        'moment.create',
        'moment.update',
        'moment.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.moments).toBeDefined();
      expect(res.body.data.moments.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { uuid: record.uuid }, token);

      expect(res.body.data.moment).toBeDefined();
      expect(res.body.data.moment.uuid).toEqual(record.uuid);
      expect(res.body.data.moment.patient.id).toBeDefined();
      expect(res.body.data.moment.assessment.id).toBeDefined();
      expect(res.body.data.moment.momentPrompts.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Moment');
      const variables = {
        moment: {
          ...attrs,
          fileName: `${v4()}.mp4`,
        },
      };

      const res = await formMutate(CREATE, variables, token);

      expect(res.body.data.createMoment).toBeNull();
      expect(res.body.errors).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        moment: {
          uuid: record.uuid,
          uri: 'https://www.example.com/updated',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMoment).toBeDefined();
      expect(res.body.data.updateMoment.uri).toEqual(
        'https://www.example.com/updated'
      );
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Moment');

      const variables = {
        moment: {
          uuid: destroy.uuid,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMoment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Moment.findByPk(res.body.data.destroyMoment.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;
    let usr;

    beforeAll(async () => {
      usr = await factory.create('Patient');
      await usr.addPermissions([
        'moment.list',
        'moment.read',
        'moment.create',
        'moment.update',
        'moment.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.moments).toBeDefined();
      expect(res.body.data.moments.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { uuid: record.uuid }, token);

      expect(res.body.data.moment).toBeDefined();
      expect(res.body.data.moment.uuid).toEqual(record.uuid);
      expect(res.body.data.moment.patient.id).toBeDefined();
      expect(res.body.data.moment.assessment.id).toBeDefined();
      expect(res.body.data.moment.momentPrompts.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });

    test('should create', async () => {
      const attrs = await factory.attrs('Moment');
      const variables = {
        moment: {
          ...attrs,
          fileName: `${v4()}.mp4`,
        },
      };

      const res = await formMutate(CREATE, variables, token);

      expect(res.body.data.createMoment).toBeDefined();
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.createMoment.mimeType).toEqual('video/mp4');

      const found = await db.Moment.findByPk(res.body.data.createMoment.id);
      expect(found).toBeDefined();
    });
    test('should create (completes patient assessment)', async () => {
      const assessmentId = (await factory.create('Assessment')).id;
      const pa = await factory.create('PatientAssessment', {
        assessmentId,
        patientId: usr.id,
      });
      const attrs = await factory.attrs('Moment', { assessmentId });

      const variables = {
        moment: {
          ...attrs,
          fileName: `${v4()}.mp4`,
        },
      };

      const res = await formMutate(CREATE, variables, token);

      expect(res.body.data.createMoment).toBeDefined();
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.createMoment.mimeType).toEqual('video/mp4');

      const found = await db.Moment.findByPk(res.body.data.createMoment.id);
      expect(found).toBeDefined();

      await pa.reload();
      expect(pa.completed).toEqual(true);
    });
    test('should create (does NOT complete permanent assessment)', async () => {
      const assessmentId = (
        await factory.create('Assessment', { permanent: true })
      ).id;
      const pa = await factory.create('PatientAssessment', {
        assessmentId,
        patientId: usr.id,
      });
      const attrs = await factory.attrs('Moment', { assessmentId });

      const variables = {
        moment: {
          ...attrs,
          fileName: `${v4()}.mp4`,
        },
      };

      const res = await formMutate(CREATE, variables, token);

      expect(res.body.data.createMoment).toBeDefined();
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.createMoment.mimeType).toEqual('video/mp4');

      const found = await db.Moment.findByPk(res.body.data.createMoment.id);
      expect(found).toBeDefined();

      await pa.reload();
      expect(pa.completed).toEqual(false);
    });
    test('should update', async () => {
      const variables = {
        moment: {
          uuid: record.uuid,
          uri: 'https://www.example.com/updated',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateMoment).toBeDefined();
      expect(res.body.data.updateMoment.uri).toEqual(
        'https://www.example.com/updated'
      );
      expect(res.body.errors).toBeUndefined();
    });

    test('should destroy', async () => {
      const destroy = await factory.create('Moment');

      const variables = {
        moment: {
          uuid: destroy.uuid,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyMoment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Moment.findByPk(res.body.data.destroyMoment.id);
      expect(found).toBeNull();
    });
  });
});
