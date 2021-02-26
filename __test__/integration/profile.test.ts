import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    profiles {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    profile(id: $id) {
      id
      patient {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($profile: ProfileCreate) {
    createProfile(profile: $profile) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($profile: ProfileUpdate) {
    updateProfile(profile: $profile) {
      id
      title
    }
  }
`;

const DESTROY = `
  mutation destroy($profile: ProfileDestroy) {
    destroyProfile(profile: $profile) {
      id
    }
  }
`;

describe('Integration - Profile', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('Profile');
    await factory.create('Profile');
    await factory.create('Profile');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);
    
      expect(res.body.data.profiles).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });
    
      expect(res.body.data.profile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Profile');
      const variables = {
        profile: attrs
      };

      const res = await mutate(CREATE, variables);
    
      expect(res.body.data.createProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        profile: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables);
    
      expect(res.body.data.updateProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Profile');

      const variables = {
        profile: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables);
    
      expect(res.body.data.destroyProfile).toBeNull();
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
    
      expect(res.body.data.profiles).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.profile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Profile');
      const variables = {
        profile: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.create');
    });
    test('should NOT update', async () => {
      const variables = {
        profile: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Profile');

      const variables = {
        profile: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.destroy');
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
    
      expect(res.body.data.profiles).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.profile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Profile');
      const variables = {
        profile: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.create');
    });
    test('should NOT update', async () => {
      const variables = {
        profile: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Profile');

      const variables = {
        profile: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.destroy');
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
    
      expect(res.body.data.profiles).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.profile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Profile');
      const variables = {
        profile: attrs
      };

      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.create');
    });
    test('should NOT update', async () => {
      const variables = {
        profile: {
          id: record.id,
          title: 'New Title'
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Profile');

      const variables = {
        profile: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProfile).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('profile.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'profile.list',
        'profile.read',
        'profile.create',
        'profile.update',
        'profile.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.profiles).toBeDefined();
      expect(res.body.data.profiles.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.profile).toBeDefined();
      expect(res.body.data.profile.id).toEqual(record.id);
      expect(res.body.data.profile.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Profile');
      const variables = {
        profile: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProfile).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Profile.findByPk(res.body.data.createProfile.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        profile: {
          id: record.id,
          title: 'New Title',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProfile).toBeDefined();
      expect(res.body.data.updateProfile.title).toEqual('New Title');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Profile');

      const variables = {
        profile: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProfile).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Profile.findByPk(res.body.data.destroyProfile.id);
      expect(found).toBeNull();
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'profile.list',
        'profile.read',
        'profile.create',
        'profile.update',
        'profile.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.profiles).toBeDefined();
      expect(res.body.data.profiles.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.profile).toBeDefined();
      expect(res.body.data.profile.id).toEqual(record.id);
      expect(res.body.data.profile.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Profile');
      const variables = {
        profile: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProfile).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Profile.findByPk(res.body.data.createProfile.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        profile: {
          id: record.id,
          title: 'New Title',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProfile).toBeDefined();
      expect(res.body.data.updateProfile.title).toEqual('New Title');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Profile');

      const variables = {
        profile: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProfile).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Profile.findByPk(res.body.data.destroyProfile.id);
      expect(found).toBeNull();
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'profile.list',
        'profile.read',
        'profile.create',
        'profile.update',
        'profile.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);
    
      expect(res.body.data.profiles).toBeDefined();
      expect(res.body.data.profiles.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);
    
      expect(res.body.data.profile).toBeDefined();
      expect(res.body.data.profile.id).toEqual(record.id);
      expect(res.body.data.profile.patient.id).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Profile');
      const variables = {
        profile: attrs
      }
      const res = await mutate(CREATE, variables, token);
    
      expect(res.body.data.createProfile).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Profile.findByPk(res.body.data.createProfile.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        profile: {
          id: record.id,
          title: 'New Title',
        }
      }
      const res = await mutate(UPDATE, variables, token);
    
      expect(res.body.data.updateProfile).toBeDefined();
      expect(res.body.data.updateProfile.title).toEqual('New Title');
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Profile');

      const variables = {
        profile: {
          id: destroy.id,
        }
      }
      const res = await mutate(DESTROY, variables, token);
    
      expect(res.body.data.destroyProfile).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Profile.findByPk(res.body.data.destroyProfile.id);
      expect(found).toBeNull();
    });
  });
});
