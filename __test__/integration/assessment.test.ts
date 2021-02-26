import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    assessments {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    assessment(id: $id) {
      id
      name
      area
      patientAssessments {
        id
      }
      prompts {
        id
      }
      moments {
        uuid
      }
      signalQuestions {
        id
      }
      owner {
         ... on Clinician {
            id
         }
      }
    }
  }
`;

const CREATE = `
  mutation create($json: JSON!) {
    createAssessment(json: $json) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($assessment: AssessmentUpdate) {
    updateAssessment(assessment: $assessment) {
      id
      name
    }
  }
`;

const DESTROY = `
  mutation destroy($assessment: AssessmentDestroy) {
    destroyAssessment(assessment: $assessment) {
      id
    }
  }
`;

function getCreateJSON(type, id) {
  return {
    name: `${type}:${id} Created`,
    prompts: [
      { content: 'Question 1', durationMs: 20000, order: 1 },
      { content: 'Question 2', durationMs: 20000, order: 2 },
      { content: 'Question 3', durationMs: 20000, order: 3 },
    ]
  };
}

describe('Integration - Assessment', () => {
  let record, owner;

  beforeAll(async () => {
    owner = await factory.create('Clinician');
    record = await factory.create('Assessment', {
      ownerId: owner.id,
      ownerType: 'clinician',
    });
    const opts = { assessmentId: record.id };

    await factory.create('PatientAssessment', opts);

    const prompt = await factory.create('Prompt');
    await factory.create('AssessmentPrompt', {
      ...opts,
      promptId: prompt.id
    });
    
    await factory.create('Moment', opts);
    await factory.create('SignalQuestion', opts);
    
    await factory.create('Assessment');
    await factory.create('Assessment');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.assessments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.assessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = getCreateJSON('Anonymous', null);
      const variables = {
        json: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        assessment: {
          id: record.id,
          name: 'New Name'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updateAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Assessment');

      const variables = {
        assessment: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroyAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
  });
  describe('LoticUser: without Permissions', () => {
    let token, usr;

    beforeAll(async () => {
      usr = await factory.create('LoticUser');
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.assessments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('assessment.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.assessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('assessment.read');
    });
    test('should NOT create', async () => {
      const json = getCreateJSON('LoticUser', usr.id);;
      const variables = {
        json
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('assessment.create');
    });
    test('should NOT update', async () => {
      const variables = {
        assessment: {
          id: record.id,
          name: 'New Name'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('assessment.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Assessment');

      const variables = {
        assessment: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('assessment.destroy');
    });
  });
  describe('Clinician: without Permissions', () => {
    let token, usr;

    beforeAll(async () => {
      usr = await factory.create('Clinician');
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.assessments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('assessment.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.assessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('assessment.read');
    });
    test('should NOT create', async () => {
      const json = getCreateJSON('Clinician', usr.id);;
      const variables = {
        json
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('assessment.create');
    });
    test('should NOT update', async () => {
      const variables = {
        assessment: {
          id: record.id,
          name: 'New Name'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('assessment.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Assessment');

      const variables = {
        assessment: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('assessment.destroy');
    });
  });
  describe('Patient: without Permissions', () => {
    let token, usr;

    beforeAll(async () => {
      usr = await factory.create('Patient');
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.assessments).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.assessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT create', async () => {
      const json = getCreateJSON('Patient', usr.id);;
      const variables = {
        json
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        assessment: {
          id: record.id,
          name: 'New Name'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Assessment');

      const variables = {
        assessment: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token, usr;

    beforeAll(async () => {
      usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'assessment.list',
        'assessment.read',
        'assessment.create',
        'assessment.update',
        'assessment.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.assessments).toBeDefined();
      expect(res.body.data.assessments.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.assessment).toBeDefined();
      expect(res.body.data.assessment.id).toEqual(record.id);
      expect(res.body.data.assessment.patientAssessments.length).toBeGreaterThan(0);
      expect(res.body.data.assessment.prompts.length).toBeGreaterThan(0);
      expect(res.body.data.assessment.moments.length).toBeGreaterThan(0);
      expect(res.body.data.assessment.owner.id).toEqual(owner.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const json = getCreateJSON('LoticUser', usr.id);;
      const variables = {
        json
      }
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createAssessment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Assessment.findByPk(res.body.data.createAssessment.id);
      const prompts = await found.getPrompts();

      expect(found).toBeDefined();
      expect(prompts.length).toBeGreaterThan(0);
    });
    test('should update', async () => {
      const variables = {
        assessment: {
          id: record.id,
          name: 'New Name',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateAssessment).toBeDefined();
      expect(res.body.data.updateAssessment.name).toEqual('New Name');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Assessment');

      const variables = {
        assessment: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyAssessment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Assessment.findByPk(res.body.data.destroyAssessment.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token, usr, assessment;

    beforeAll(async () => {
      usr = await factory.create('Clinician');
      assessment = await factory.create('Assessment', {
        ownerId: usr.id
      });
      const opts = { assessmentId: assessment.id };

      await factory.create('PatientAssessment', opts);

      const prompt = await factory.create('Prompt');
      await factory.create('AssessmentPrompt', {
        ...opts,
        promptId: prompt.id
      });

      await factory.create('Moment', opts);
      await factory.create('SignalQuestion', opts);
      await usr.addPermissions([
        'assessment.list',
        'assessment.read',
        'assessment.create',
        'assessment.update',
        'assessment.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.assessments).toBeDefined();
      expect(res.body.data.assessments.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.assessment).toEqual(null);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      const res = await query(READ, { id: assessment.id }, token);

      expect(res.body.data.assessment).toBeDefined();
      expect(res.body.data.assessment.id).toEqual(assessment.id);
      expect(res.body.data.assessment.patientAssessments.length).toBeGreaterThan(0);
      expect(res.body.data.assessment.prompts.length).toBeGreaterThan(0);
      expect(res.body.data.assessment.moments.length).toBeGreaterThan(0);
      expect(res.body.data.assessment.owner.id).toEqual(usr.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const json = getCreateJSON('Clinician', usr.id);;

      const variables = {
        json,
      };

      const res = await mutate(CREATE, variables, token);
      expect(res.body.data.createAssessment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Assessment.findByPk(res.body.data.createAssessment.id);

      expect(found).toBeDefined();
      const prompts = await found.getPrompts();

      expect(prompts.length).toEqual(3);
    });
    test('should create and assign to own Patient', async () => {
      const json = getCreateJSON('Clinician', usr.id);;
      const patientId = (await factory.create('Patient')).id;
      await factory.create('PatientClinician', {
        patientId,
        clinicianId: usr.id
      });

      const variables = {
        json: {
          ...json,
          patientId
        },
      };

      const res = await mutate(CREATE, variables, token);
      expect(res.body.data.createAssessment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Assessment.findByPk(res.body.data.createAssessment.id);

      expect(found).toBeDefined();
      const pa = await found.getPatientAssessments();

      expect(pa.length).toEqual(1);
      expect(pa[0].patientId).toEqual(patientId);
    });
    test('should NOT create and assign to another Clincians Patient', async () => {
      const json = getCreateJSON('Clinician', usr.id);;
      const patientId = (await factory.create('Patient')).id;
      const otherClincian = await factory.create('Clinician');
      await factory.create('PatientClinician', {
        patientId,
        clinicianId: otherClincian.id
      });

      const variables = {
        json: {
          ...json,
          patientId
        },
      };

      const res = await mutate(CREATE, variables, token);
      expect(res.body.data.createAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Forbidden.');
    });
    test('should NOT update', async () => {
      const variables = {
        assessment: {
          id: record.id,
          name: 'New Name',
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAssessment).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'You can not modify this entry.'
      );
    });
    test('should update my own', async () => {
      const variables = {
        assessment: {
          id: assessment.id,
          name: 'New Name',
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateAssessment).toBeDefined();
      expect(res.body.data.updateAssessment.name).toEqual('New Name');
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Assessment');

      const variables = {
        assessment: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyAssessment).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'You can not destroy this entry.'
      );
    });
    test('should destroy my own', async () => {
      const destroy =  await factory.create('Assessment', {
        ownerId: usr.id
      });

      const variables = {
        assessment: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyAssessment).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Assessment.findByPk(res.body.data.destroyAssessment.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token, usr;

    beforeAll(async () => {
      usr = await factory.create('Patient');
      await usr.addPermissions([
        'assessment.list',
        'assessment.read',
        'assessment.create',
        'assessment.update',
        'assessment.destroy',
      ]);
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.assessments).toBeNull();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.assessment).toBeNull();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT create', async () => {
      const json = getCreateJSON('Patient', usr.id);;
      const variables = {
        json
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createAssessment).toBeNull();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        assessment: {
          id: record.id,
          name: 'New Name',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateAssessment).toBeNull();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Assessment');

      const variables = {
        assessment: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyAssessment).toBeNull();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
  });
});
