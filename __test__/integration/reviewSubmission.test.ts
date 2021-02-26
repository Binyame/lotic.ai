import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    reviewSubmissions {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    reviewSubmission(id: $id) {
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
  mutation create($reviewSubmission: ReviewSubmissionCreate) {
    createReviewSubmission(reviewSubmission: $reviewSubmission) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($reviewSubmission: ReviewSubmissionUpdate) {
    updateReviewSubmission(reviewSubmission: $reviewSubmission) {
      id
      body
    }
  }
`;

const DESTROY = `
  mutation destroy($reviewSubmission: ReviewSubmissionDestroy) {
    destroyReviewSubmission(reviewSubmission: $reviewSubmission) {
      id
    }
  }
`;

describe('Integration - ReviewSubmission', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('ReviewSubmission');
    await factory.create('ReviewSubmission');
    await factory.create('ReviewSubmission');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.reviewSubmissions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.reviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('ReviewSubmission');
      const variables = {
        reviewSubmission: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        reviewSubmission: {
          id: record.id,
          body: { foo: 'bar' },
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('ReviewSubmission');

      const variables = {
        reviewSubmission: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyReviewSubmission).toBeNull();
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

      expect(res.body.data.reviewSubmissions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.reviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('ReviewSubmission');
      const variables = {
        reviewSubmission: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.create');
    });
    test('should NOT update', async () => {
      const variables = {
        reviewSubmission: {
          id: record.id,
          body: { foo: 'bar' },
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('ReviewSubmission');

      const variables = {
        reviewSubmission: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.destroy');
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

      expect(res.body.data.reviewSubmissions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.reviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('ReviewSubmission');
      const variables = {
        reviewSubmission: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.create');
    });
    test('should NOT update', async () => {
      const variables = {
        reviewSubmission: {
          id: record.id,
          body: { foo: 'bar' },
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('ReviewSubmission');

      const variables = {
        reviewSubmission: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.destroy');
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

      expect(res.body.data.reviewSubmissions).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.reviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('ReviewSubmission');
      const variables = {
        reviewSubmission: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.create');
    });
    test('should NOT update', async () => {
      const variables = {
        reviewSubmission: {
          id: record.id,
          body: { foo: 'bar' },
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('ReviewSubmission');

      const variables = {
        reviewSubmission: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReviewSubmission).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('reviewSubmission.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'reviewSubmission.list',
        'reviewSubmission.read',
        'reviewSubmission.create',
        'reviewSubmission.update',
        'reviewSubmission.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.reviewSubmissions).toBeDefined();
      expect(res.body.data.reviewSubmissions.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.reviewSubmission).toBeDefined();
      expect(res.body.data.reviewSubmission.id).toEqual(record.id);
      expect(res.body.data.reviewSubmission.patient.id).toBeDefined();
      expect(res.body.data.reviewSubmission.review.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('ReviewSubmission');
      const variables = {
        reviewSubmission: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReviewSubmission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ReviewSubmission.findByPk(
        res.body.data.createReviewSubmission.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        reviewSubmission: {
          id: record.id,
          body: { foo: 'bar' },
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReviewSubmission).toBeDefined();
      expect(res.body.data.updateReviewSubmission.body).toEqual({ foo: 'bar' });
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('ReviewSubmission');

      const variables = {
        reviewSubmission: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReviewSubmission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ReviewSubmission.findByPk(
        res.body.data.destroyReviewSubmission.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'reviewSubmission.list',
        'reviewSubmission.read',
        'reviewSubmission.create',
        'reviewSubmission.update',
        'reviewSubmission.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.reviewSubmissions).toBeDefined();
      expect(res.body.data.reviewSubmissions.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.reviewSubmission).toBeDefined();
      expect(res.body.data.reviewSubmission.id).toEqual(record.id);
      expect(res.body.data.reviewSubmission.patient.id).toBeDefined();
      expect(res.body.data.reviewSubmission.review.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('ReviewSubmission');
      const variables = {
        reviewSubmission: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReviewSubmission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ReviewSubmission.findByPk(
        res.body.data.createReviewSubmission.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        reviewSubmission: {
          id: record.id,
          body: { foo: 'bar' },
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReviewSubmission).toBeDefined();
      expect(res.body.data.updateReviewSubmission.body).toEqual({ foo: 'bar' });
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('ReviewSubmission');

      const variables = {
        reviewSubmission: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReviewSubmission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ReviewSubmission.findByPk(
        res.body.data.destroyReviewSubmission.id
      );
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'reviewSubmission.list',
        'reviewSubmission.read',
        'reviewSubmission.create',
        'reviewSubmission.update',
        'reviewSubmission.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.reviewSubmissions).toBeDefined();
      expect(res.body.data.reviewSubmissions.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.reviewSubmission).toBeDefined();
      expect(res.body.data.reviewSubmission.id).toEqual(record.id);
      expect(res.body.data.reviewSubmission.patient.id).toBeDefined();
      expect(res.body.data.reviewSubmission.review.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('ReviewSubmission');
      const variables = {
        reviewSubmission: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createReviewSubmission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ReviewSubmission.findByPk(
        res.body.data.createReviewSubmission.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        reviewSubmission: {
          id: record.id,
          body: { foo: 'bar' },
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateReviewSubmission).toBeDefined();
      expect(res.body.data.updateReviewSubmission.body).toEqual({ foo: 'bar' });
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('ReviewSubmission');

      const variables = {
        reviewSubmission: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyReviewSubmission).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.ReviewSubmission.findByPk(
        res.body.data.destroyReviewSubmission.id
      );
      expect(found).toBeNull();
    });
  });
});
