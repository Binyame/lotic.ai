import { useReactiveVar } from '@apollo/client';
import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    likes {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    like(id: $id) {
      id
      patient {
        id
      }
      content {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($like: LikeCreate) {
    createLike(like: $like) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($like: LikeUpdate) {
    updateLike(like: $like) {
      id
    }
  }
`;

const DESTROY = `
  mutation destroy($like: LikeDestroy) {
    destroyLike(like: $like) {
      id
    }
  }
`;

describe('Integration - Like', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('Like');
    await factory.create('Like');
    await factory.create('Like');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.likes).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.like).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Like');
      const variables = {
        like: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        like: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Like');

      const variables = {
        like: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyLike).toBeNull();
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

      expect(res.body.data.likes).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.like).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Like');
      const variables = {
        like: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.create');
    });
    test('should NOT update', async () => {
      const variables = {
        like: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Like');

      const variables = {
        like: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.destroy');
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

      expect(res.body.data.likes).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.like).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Like');
      const variables = {
        like: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.create');
    });
    test('should NOT update', async () => {
      const variables = {
        like: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Like');

      const variables = {
        like: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.destroy');
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

      expect(res.body.data.likes).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.like).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('like.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Like');
      const variables = {
        like: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        like: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Like');

      const variables = {
        like: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'Missing permission for like.destroy'
      );
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'like.list',
        'like.read',
        'like.create',
        'like.update',
        'like.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.likes).toBeDefined();
      expect(res.body.data.likes.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });

    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.like).toBeDefined();
      expect(res.body.data.like.id).toEqual(record.id);
      expect(res.body.data.like.patient.id).toBeDefined();
      expect(res.body.data.like.content.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Like');
      const variables = {
        like: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createLike).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Like.findByPk(res.body.data.createLike.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        like: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateLike).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Like');

      const variables = {
        like: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyLike).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Like.findByPk(res.body.data.destroyLike.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'like.list',
        'like.read',
        'like.create',
        'like.update',
        'like.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.likes).toBeDefined();
      expect(res.body.data.likes.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });

    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.like).toBeDefined();
      expect(res.body.data.like.id).toEqual(record.id);
      expect(res.body.data.like.patient.id).toBeDefined();
      expect(res.body.data.like.content.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Like');
      const variables = {
        like: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createLike).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Like.findByPk(res.body.data.createLike.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        like: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateLike).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Like');

      const variables = {
        like: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyLike).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Like.findByPk(res.body.data.destroyLike.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;
    let patient;

    beforeEach(async () => {
      patient = await factory.create('Patient');
      await patient.addPermissions([
        'like.list',
        'like.read',
        'like.create',
        'like.update',
        'like.destroy',
      ]);
      token = await patient.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.likes).toEqual([]);
      expect(res.body.errors).toBeUndefined();
    });
    test('should list my own', async () => {
      const record = await factory.create('Like', {
        patientId: patient.id,
      });

      const res = await query(LIST, undefined, token);

      expect(res.body.data.likes.length).toEqual(1);
      expect(res.body.data.likes[0].id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.like).toEqual(null);
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      const record = await factory.create('Like', {
        patientId: patient.id,
      });

      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.like.id).toEqual(record.id);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Like');
      const variables = {
        like: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        like: {
          id: record.id,
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateLike).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should soft destroy', async () => {
      const destroy = await factory.create('Like');

      const variables = {
        like: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyLike).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const foundOne = await db.Like.findOne({
        where: { id: res.body.data.destroyLike.id },
      });
      const foundTwo = await db.Like.findOne({
        where: { id: res.body.data.destroyLike.id },
        paranoid: false,
      });

      expect(foundOne).toBeNull();
      expect(foundTwo.id).toEqual(res.body.data.destroyLike.id);
    });
  });
});
