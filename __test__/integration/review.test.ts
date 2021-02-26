import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    reviews {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    review(id: $id) {
      id
      patients {
        id
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
    createReview(json: $json) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($review: ReviewUpdate) {
    updateReview(review: $review) {
      id
      title
    }
  }
`;

const DESTROY = `
  mutation destroy($review: ReviewDestroy) {
    destroyReview(review: $review) {
      id
    }
  }
`;

function getCreateJSON(type, id) {
  return {
    title: `${type}:${id} Created`,
    signalQuestions: [
      { content: 'content 1', type: 'boolean', trigger: { foo: 'bar' } },
      { content: 'content 2', type: 'boolean', trigger: { foo: 'bar' } },
      { content: 'content 3', type: 'boolean', trigger: { foo: 'bar' } }
    ]
  };
}

describe('Integration - Review', () => {
  let record, owner;

  beforeAll(async () => {
    owner = await factory.create('Clinician');
    record = await factory.create('Review', {
      ownerId: owner.id,
      ownerType: 'clinician',
    });

    await factory.create('SignalQuestion', {
      reviewId: record.id
    });

    const patient = await factory.create('Patient');
    await factory.create('PatientReview', {
      reviewId: record.id,
      patientId: patient.id,
    });

    await factory.create('Review');
    await factory.create('Review');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.reviews).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.review).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const json = getCreateJSON('Anonymous', null);
      const variables = {
        json
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        review: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Review');

      const variables = {
        review: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyReview).toBeNull();
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

      expect(res.body.data.reviews).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.review).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.read');
    });
    test('should NOT create', async () => {
      const json = getCreateJSON('LoticUser', usr.id);
      const variables = {
        json
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.create');
    });
    test('should NOT update', async () => {
      const variables = {
        review: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Review');

      const variables = {
        review: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.destroy');
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

      expect(res.body.data.reviews).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.review).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.read');
    });
    test('should NOT create', async () => {
      const json = getCreateJSON('Clinician', usr.id);
      const variables = {
        json
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.create');
    });
    test('should NOT update', async () => {
      const variables = {
        review: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Review');

      const variables = {
        review: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.destroy');
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

      expect(res.body.data.reviews).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.review).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('review.read');
    });
    test('should NOT create', async () => {
      const json = getCreateJSON('Patient', usr.id);
      const variables = {
        json
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        review: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Review');

      const variables = {
        review: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token, usr;

    beforeAll(async () => {
      usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'review.list',
        'review.read',
        'review.create',
        'review.update',
        'review.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.reviews).toBeDefined();
      expect(res.body.data.reviews.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.review).toBeDefined();
      expect(res.body.data.review.id).toEqual(record.id);
      expect(res.body.data.review.patients.length).toBeGreaterThan(0);
      expect(res.body.data.review.signalQuestions.length).toBeGreaterThan(0);
      expect(res.body.data.review.owner.id).toEqual(owner.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const json = getCreateJSON('LoticUser', usr.id);
      const variables = {
        json
      }
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Review.findByPk(res.body.data.createReview.id);
      const signalQuestions = await found.getSignalQuestions();
      expect(signalQuestions.length).toEqual(3);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        review: {
          id: record.id,
          title: 'New Title',
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReview).toBeDefined();
      expect(res.body.data.updateReview.title).toEqual('New Title');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Review');

      const variables = {
        review: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Review.findByPk(res.body.data.destroyReview.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token, review, usr;

    beforeAll(async () => {
      usr = await factory.create('Clinician');
      review = await factory.create('Review', {
        ownerId: usr.id,
        ownerType: 'clinician',
      });

      await factory.create('SignalQuestion', {
        reviewId: review.id
      });

      const patient = await factory.create('Patient');
      await factory.create('PatientReview', {
        reviewId: review.id,
        patientId: patient.id,
      });
      await usr.addPermissions([
        'review.list',
        'review.read',
        'review.create',
        'review.update',
        'review.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.reviews).toBeDefined();
      expect(res.body.data.reviews.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.review).toEqual(null);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      const res = await query(READ, { id: review.id }, token);

      expect(res.body.data.review).toBeDefined();
      expect(res.body.data.review.id).toEqual(review.id);
      expect(res.body.data.review.patients.length).toBeGreaterThan(0);
      expect(res.body.data.review.signalQuestions.length).toBeGreaterThan(0);
      expect(res.body.data.review.owner.id).toEqual(usr.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const json = getCreateJSON('Clinician', usr.id);
      const variables = {
        json
      }
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Review.findByPk(res.body.data.createReview.id);
      const signalQuestions = await found.getSignalQuestions();
      expect(signalQuestions.length).toEqual(3);
      expect(found).toBeDefined();
    });
    test('should create and assign to own Patient', async () => {
      const json = getCreateJSON('Clinician', usr.id);
      const patient = await factory.create('Patient');
      await factory.create('PatientClinician', {
        patientId: patient.id,
        clinicianId: usr.id
      });

      const variables = {
        json: {
          ...json,
          patientId: patient.id
        },
      };

      const res = await mutate(CREATE, variables, token);
      expect(res.body.data.createReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Review.findByPk(res.body.data.createReview.id);

      expect(found).toBeDefined();
      const pr = await patient.getPatientReviews();

      expect(pr.length).toEqual(1);
      expect(pr[0].reviewId).toEqual(found.id);
    });
    test('should NOT create and assign to another Clincians Patient', async () => {
      const json = getCreateJSON('Clinician', usr.id);
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
      expect(res.body.data.createReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Forbidden.');
    });
    test('should NOT update', async () => {
      const variables = {
        review: {
          id: record.id,
          title: 'New Title',
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'You can not modify this entry.'
      );
    });
    test('should update my own', async () => {
      const variables = {
        review: {
          id: review.id,
          title: 'New Title',
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReview).toBeDefined();
      expect(res.body.data.updateReview.title).toEqual('New Title');
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Review');

      const variables = {
        review: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReview).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'You can not destroy this entry.'
      );
    });
    test('should destroy my own', async () => {
      const destroy =  await factory.create('Review', {
        ownerId: usr.id
      });

      const variables = {
        review: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReview).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Review.findByPk(res.body.data.destroyReview.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token, usr;

    beforeAll(async () => {
      usr = await factory.create('Patient');
      await usr.addPermissions([
        'review.list',
        'review.read',
        'review.create',
        'review.update',
        'review.destroy',
      ]);
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.reviews).toEqual([]);
      expect(res.body.errors).toBeUndefined();
    });
    test('should list my own', async () => {
      const record = await factory.create('Review');
      await factory.create('PatientReview', {
        reviewId: record.id,
        patientId: usr.id
      });

      const res = await query(LIST, undefined, token);

      expect(res.body.data.reviews.length).toEqual(1);
      expect(res.body.data.reviews[0].id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();

    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.review).toEqual(null);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      const record = await factory.create('Review');
      await factory.create('PatientReview', {
        reviewId: record.id,
        patientId: usr.id
      });

      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.review.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();

    });
    test('should NOT create', async () => {
      const json = getCreateJSON('Patient', usr.id);
      const variables = {
        json
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        review: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Review');

      const variables = {
        review: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReview).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
  });
});
