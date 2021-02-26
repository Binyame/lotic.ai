import jwt from 'jsonwebtoken';
import { factory, db } from '../utils';
import lru from '../../services/lru';

describe.skip('Model - User', () => {
  test('it creates a user', async () => {
    const record = await factory.create('User', { providerId: '1234@example.com' });
    expect(record.providerId).toEqual('1234@example.com');
  });

  describe('Validations', () => {
    test('should require a valid provider', async () => {
      await expect(factory.create('User', { provider: null })).rejects.toThrow();
      await expect(factory.create('User', { provider: false })).rejects.toThrow();
      await expect(factory.create('User', { provider: true })).rejects.toThrow();
      await expect(factory.create('User', { provider: 1234 })).rejects.toThrow();
      await expect(factory.create('User', { provider: 'random-string' })).rejects.toThrow();

      await expect(factory.create('User', { provider: 'local' })).resolves.toBeDefined();
    });

    test('should require a valid providerId', async () => {
      await expect(factory.create('User', { providerId: null })).rejects.toThrow();
      await expect(factory.create('User', { providerId: false })).rejects.toThrow();
      await expect(factory.create('User', { providerId: true })).rejects.toThrow();
      await expect(factory.create('User', { providerId: 1234 })).rejects.toThrow();

      await expect(factory.create('User', { providerId: 'some-provider-id' })).resolves.toBeDefined();
    });

    test('should require a valid providerKey', async () => {
      await expect(factory.create('User', { providerKey: null })).rejects.toThrow();
      await expect(factory.create('User', { providerKey: false })).rejects.toThrow();
      await expect(factory.create('User', { providerKey: true })).rejects.toThrow();
      await expect(factory.create('User', { providerKey: 1234 })).rejects.toThrow();

      await expect(factory.create('User', { providerKey: 'some-provider-key' })).resolves.toBeDefined();
    });

    test('should not allow duplicate provider + providerId', async () => {
      const existing = await factory.create('User');
      const { provider, providerId } = existing;
      await expect(factory.create('User', { provider, providerId })).rejects.toThrow();
    });
  });

  describe('Relationships', () => {
    let user;

    beforeAll(async () => {
      user = await factory.create('User');
    });

    test('hasMany Permission', async () => {
      const record = await factory.create('Permission', { userId: user.id });
      const found = await user.getPermissions();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Provider', async () => {
      const record = await factory.create('Provider', { userId: user.id });
      const found = await user.getProviders();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Email', async () => {
      const record = await factory.create('Email', { userId: user.id });
      const found = await user.getEmails();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Address', async () => {
      const user = await factory.create('User');
      const record = await factory.create('Address', {
        targetId: user.id,
        targetType: 'user'
      });
      const found = await user.getAddresses();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasOne Profile', async () => {
      const user = await factory.create('User');
      const record = await factory.create('Profile')
      
      await user.setProfile(record);

      const found = await user.getProfile();
      expect(found.id).toEqual(record.id);
    });
  });

  describe('Lifecycle Events', () => {
    describe('beforeCreate', () => {
      test('should hash provider key if provider is "local"', async () => {
        const record = await factory.create('User', {
          provider: 'local',
          providerKey: 'password1234'
        });

        expect(record.providerKey).not.toEqual('password1234');
      });
      test('should NOT hash providerKey if provider is anything else', async () => {
        const record = await factory.create('User', {
          provider: 'github',
          providerId: 'someProviderId',
          providerKey: 'someLongKeyGithubGaveMe'
        });

        expect(record.providerKey).toEqual('someLongKeyGithubGaveMe');
      });
    });
    describe('beforeUpdate', () => {
      test('should hash provider key if provider is "local"', async () => {
        const record = await factory.create('User', {
          provider: 'local',
          providerKey: 'password1234'
        });

        const originalKey = record.providerKey;

        record.providerKey = '1234Password';
        await record.save();

        expect(record.providerKey).not.toEqual('password1234');
        expect(record.providerKey).not.toEqual(originalKey);
        expect(record.providerKey).not.toEqual('1234Password');
      });
    })
  });

  describe('Instance Methods', () => {
    
    describe('authenticate', () => {
      test('should compare a password', async () => {
        const record = await factory.create('User', {
          provider: 'local',
          providerKey: 'password1234'
        });

        await expect(record.authenticate('password1234')).resolves.toEqual(true);
        await expect(record.authenticate('badPassword')).resolves.toEqual(false);
      });
    });

    describe('token', () => {
      test('should get a JWT for a user', async () => {
        const record = await factory.create('User');
        const token = await record.token();
        const decoded = jwt.decode(token);

        expect(token).toBeDefined();
        expect(decoded.user.id).toBeDefined();
        expect(decoded.user.providerId).toBeDefined();
        expect(decoded.permissions).toBeDefined();
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeDefined();
      });
    });

    describe('accessCode', () => {
      test('should create an accessCode in LRU cache whose value is a valid jwt for the user', async () => {
        const record = await factory.create('User');
        const code = await record.accessCode();
        
        expect(code).toBeDefined();
        const token = lru.get(code);
        expect(token).toBeDefined();
        const decoded = jwt.decode(token);
        expect(decoded.user.id).toBeDefined();
        expect(decoded.user.providerId).toBeDefined();
        expect(decoded.permissions).toBeDefined();
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeDefined();
      });
    });

    describe('addPermissions', () => {
      test('adds permissions by key', async () => {
        const user = await factory.create('User');
        await user.addPermissions(['user.list', 'user.read']);

        const permissions = await db.Permission.findAll({
          where: { userId: user.id },
        });
        expect(permissions.length).toEqual(2);
        const keys = permissions.map((p) => p.key);
        expect(keys.indexOf('user.list')).toBeGreaterThan(-1);
        expect(keys.indexOf('user.read')).toBeGreaterThan(-1);
      });

      test("doesn't bork if you add the same key twice", async () => {
        const user = await factory.create('User');
        await user.addPermissions(['user.list']);

        await expect(user.addPermissions(['user.list'])).resolves.toBeDefined();

        const permissions = await db.Permission.findAll({
          where: { userId: user.id },
        });

        expect(permissions.length).toEqual(1);
      });
    });

    describe('makeSuper', () => {
      test('adds all permissions', async () => {
        const user = await factory.create('User');
        await user.makeSuper();

        const permissions = await db.Permission.findAll({
          where: { userId: user.id },
        });
        const keys = permissions.map((p) => p.key);
        const perm = new db.Permission();
        const validKeys = perm.validKeys;

        for (const k of validKeys) {
          expect(keys.indexOf(k)).toBeGreaterThan(-1);
        }
      });
    });
  });
});
