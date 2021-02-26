import jwt from 'jsonwebtoken';
import { factory, db } from '../utils';
import lru from '../../services/lru';

describe('Model - LoticUser', () => {
  test('it creates a loticUser', async () => {
    const record = await factory.create('LoticUser', { providerId: '1234@example.com' });
    expect(record.providerId).toEqual('1234@example.com');
  });

  describe('Validations', () => {
    test('should require a valid provider', async () => {
      await expect(factory.create('LoticUser', { provider: null })).rejects.toThrow();
      await expect(factory.create('LoticUser', { provider: false })).rejects.toThrow();
      await expect(factory.create('LoticUser', { provider: true })).rejects.toThrow();
      await expect(factory.create('LoticUser', { provider: 1234 })).rejects.toThrow();
      await expect(factory.create('LoticUser', { provider: 'random-string' })).rejects.toThrow();

      await expect(factory.create('LoticUser', { provider: 'loticUser' })).resolves.toBeDefined();
    });

    test('should require a valid providerId', async () => {
      await expect(factory.create('LoticUser', { providerId: null })).rejects.toThrow();
      await expect(factory.create('LoticUser', { providerId: false })).rejects.toThrow();
      await expect(factory.create('LoticUser', { providerId: true })).rejects.toThrow();
      await expect(factory.create('LoticUser', { providerId: 1234 })).rejects.toThrow();

      await expect(factory.create('LoticUser', { providerId: 'some-provider-id' })).resolves.toBeDefined();
    });

    test('should require a valid providerKey', async () => {
      await expect(factory.create('LoticUser', { providerKey: null })).rejects.toThrow();
      await expect(factory.create('LoticUser', { providerKey: false })).rejects.toThrow();
      await expect(factory.create('LoticUser', { providerKey: true })).rejects.toThrow();
      await expect(factory.create('LoticUser', { providerKey: 1234 })).rejects.toThrow();

      await expect(factory.create('LoticUser', { providerKey: 'some-provider-key' })).resolves.toBeDefined();
    });

    test('should not allow duplicate provider + providerId', async () => {
      const existing = await factory.create('LoticUser');
      const { provider, providerId } = existing;
      await expect(factory.create('LoticUser', { provider, providerId })).rejects.toThrow();
    });
  });

  describe('Relationships', () => {
    let loticUser;

    beforeAll(async () => {
      loticUser = await factory.create('LoticUser');
    });

    test('hasMany Permission', async () => {
      const record = await factory.create('Permission', {
        targetId: loticUser.id,
        targetType: 'loticUser'
      });
      const found = await loticUser.getPermissions();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Provider', async () => {
      const record = await factory.create('Provider', {
        targetId: loticUser.id,
        targetType: 'loticUser'
      });
      const found = await loticUser.getProviders();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Email', async () => {
      const record = await factory.create('Email', {
        targetId: loticUser.id,
        targetType: 'loticUser'
      });
      const found = await loticUser.getEmails();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Address', async () => {
      const loticUser = await factory.create('LoticUser');
      const record = await factory.create('Address', {
        targetId: loticUser.id,
        targetType: 'loticUser'
      });
      const found = await loticUser.getAddresses();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasOne Profile', async () => {
      const loticUser = await factory.create('LoticUser');
      const record = await factory.create('Profile')
      
      await loticUser.setProfile(record);

      const found = await loticUser.getProfile();
      expect(found.id).toEqual(record.id);
    });
  });

  describe('Lifecycle Events', () => {
    describe('beforeCreate', () => {
      test('should hash provider key if provider is "loticUser"', async () => {
        const record = await factory.create('LoticUser', {
          provider: 'loticUser',
          providerKey: 'password1234'
        });

        expect(record.providerKey).not.toEqual('password1234');
      });
      test('should NOT hash providerKey if provider is anything else', async () => {
        const record = await factory.create('LoticUser', {
          provider: 'github',
          providerId: 'someProviderId',
          providerKey: 'someLongKeyGithubGaveMe'
        });

        expect(record.providerKey).toEqual('someLongKeyGithubGaveMe');
      });
    });
    describe('beforeUpdate', () => {
      test('should hash provider key if provider is "loticUser"', async () => {
        const record = await factory.create('LoticUser', {
          provider: 'loticUser',
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
        const record = await factory.create('LoticUser', {
          provider: 'loticUser',
          providerKey: 'password1234'
        });

        await expect(record.authenticate('password1234')).resolves.toEqual(true);
        await expect(record.authenticate('badPassword')).resolves.toEqual(false);
      });
    });

    describe('token', () => {
      test('should get a JWT for a loticUser', async () => {
        const record = await factory.create('LoticUser');
        const token = await record.token();
        const decoded = jwt.decode(token);

        expect(token).toBeDefined();
        expect(decoded.loticUser.id).toBeDefined();
        expect(decoded.loticUser.providerId).toBeDefined();
        expect(decoded.permissions).toBeDefined();
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeDefined();
      });
    });

    describe('accessCode', () => {
      test('should create an accessCode in LRU cache whose value is a valid jwt for the loticUser', async () => {
        const record = await factory.create('LoticUser');
        const code = await record.accessCode();
        
        expect(code).toBeDefined();
        const token = lru.get(code);
        expect(token).toBeDefined();
        const decoded = jwt.decode(token);
        expect(decoded.loticUser.id).toBeDefined();
        expect(decoded.loticUser.providerId).toBeDefined();
        expect(decoded.permissions).toBeDefined();
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeDefined();
      });
    });

    describe('addPermissions', () => {
      test('adds permissions by key', async () => {
        const loticUser = await factory.create('LoticUser');
        await loticUser.addPermissions(['loticUser.list', 'loticUser.read']);

        const permissions = await db.Permission.findAll({
          where: { targetType: 'loticUser', targetId: loticUser.id },
        });
        expect(permissions.length).toEqual(2);
        const keys = permissions.map((p) => p.key);
        expect(keys.indexOf('loticUser.list')).toBeGreaterThan(-1);
        expect(keys.indexOf('loticUser.read')).toBeGreaterThan(-1);
      });

      test("doesn't bork if you add the same key twice", async () => {
        const loticUser = await factory.create('LoticUser');
        await loticUser.addPermissions(['loticUser.list']);

        await expect(loticUser.addPermissions(['loticUser.list'])).resolves.toBeDefined();

        const permissions = await db.Permission.findAll({
          where: { targetType: 'loticUser', targetId: loticUser.id },
        });

        expect(permissions.length).toEqual(1);
      });
    });

    describe('makeSuper', () => {
      test('adds all permissions', async () => {
        const loticUser = await factory.create('LoticUser');
        await loticUser.makeSuper();

        const permissions = await db.Permission.findAll({
          where: { targetType: 'loticUser', targetId: loticUser.id },
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
