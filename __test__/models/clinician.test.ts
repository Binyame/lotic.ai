import jwt from 'jsonwebtoken';
import { factory, db } from '../utils';
import lru from '../../services/lru';

describe('Model - Clinician', () => {
  test('it creates a clinician', async () => {
    const record = await factory.create('Clinician', {
      providerId: '1234@example.com',
    });
    expect(record.providerId).toEqual('1234@example.com');
  });

  describe('Validations', () => {
    test('should require a valid provider', async () => {
      await expect(
        factory.create('Clinician', { provider: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Clinician', { provider: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Clinician', { provider: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Clinician', { provider: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Clinician', { provider: 'random-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('Clinician', { provider: 'clinician' })
      ).resolves.toBeDefined();
    });

    test('should require a valid providerId', async () => {
      await expect(
        factory.create('Clinician', { providerId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Clinician', { providerId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Clinician', { providerId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Clinician', { providerId: 1234 })
      ).rejects.toThrow();

      await expect(
        factory.create('Clinician', { providerId: 'some-provider-id' })
      ).resolves.toBeDefined();
    });

    test('should require a valid providerKey', async () => {
      await expect(
        factory.create('Clinician', { providerKey: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Clinician', { providerKey: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Clinician', { providerKey: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Clinician', { providerKey: 1234 })
      ).rejects.toThrow();

      await expect(
        factory.create('Clinician', { providerKey: 'some-provider-key' })
      ).resolves.toBeDefined();
    });

    test('should not allow duplicate provider + providerId', async () => {
      const existing = await factory.create('Clinician');
      const { provider, providerId } = existing;
      await expect(
        factory.create('Clinician', { provider, providerId })
      ).rejects.toThrow();
    });
  });

  describe('Relationships', () => {
    let clinician;

    beforeAll(async () => {
      clinician = await factory.create('Clinician');
    });

    test('hasMany Permission', async () => {
      const record = await factory.create('Permission', {
        targetId: clinician.id,
        targetType: 'clinician',
      });
      const found = await clinician.getPermissions();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Provider', async () => {
      const record = await factory.create('Provider', {
        targetId: clinician.id,
        targetType: 'clinician',
      });
      const found = await clinician.getProviders();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Email', async () => {
      const record = await factory.create('Email', {
        targetId: clinician.id,
        targetType: 'clinician',
      });
      const found = await clinician.getEmails();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Address', async () => {
      const clinician = await factory.create('Clinician');
      const record = await factory.create('Address', {
        targetId: clinician.id,
        targetType: 'clinician',
      });
      const found = await clinician.getAddresses();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasOne Profile', async () => {
      const clinician = await factory.create('Clinician');
      const record = await factory.create('Profile');

      await clinician.setProfile(record);

      const found = await clinician.getProfile();
      expect(found.id).toEqual(record.id);
    });

    test('hasMany ClinicianAgreement', async () => {
      const agreement = await factory.create('Agreement');
      const clinicianAgreement = await factory.create('ClinicianAgreement', {
        clinicianId: clinician.id,
        agreementId: agreement.id,
      });

      const found = await clinician.getClinicianAgreements();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(clinicianAgreement.id);
    });

    test('belongsToMany MomentShare through MomentShareClinician', async () => {
      const share = await factory.create('MomentShare');

      await factory.create('MomentShareClinician', {
        momentShareId: share.id,
        clinicianId: clinician.id,
      });

      const found = await clinician.getMomentShares();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(share.id);
    });

    test('belongsToMany Patient through PatientClinician', async () => {
      const patient = await factory.create('Patient');
      const clinician = await factory.create('Clinician');

      await factory.create('PatientClinician', {
        patientId: patient.id,
        clinicianId: clinician.id,
      });

      const found = await clinician.getPatients();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(patient.id);
    });

    test('belongsToMany HCProvider through HCProviderClinician', async () => {
      const hcProvider = await factory.create('HCProvider');

      await factory.create('HCProviderClinician', {
        hcProviderId: hcProvider.id,
        clinicianId: clinician.id,
      });

      const found = await clinician.getHCProviders();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(hcProvider.id);
    });

    test('hasMany CareTeamCode', async () => {
      const clinician = await factory.create('Clinician');
      const careTeamCode = await factory.create('CareTeamCode', {
        clinicianId: clinician.id,
      });

      const found = await clinician.getCareTeamCodes();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(careTeamCode.id);
    });
  });

  describe('Lifecycle Events', () => {
    describe('beforeCreate', () => {
      test('should hash provider key if provider is "clinician"', async () => {
        const record = await factory.create('Clinician', {
          provider: 'clinician',
          providerKey: 'password1234',
        });

        expect(record.providerKey).not.toEqual('password1234');
      });
      test('should NOT hash providerKey if provider is anything else', async () => {
        const record = await factory.create('Clinician', {
          provider: 'github',
          providerId: 'someProviderId',
          providerKey: 'someLongKeyGithubGaveMe',
        });

        expect(record.providerKey).toEqual('someLongKeyGithubGaveMe');
      });
    });
    describe('beforeUpdate', () => {
      test('should hash provider key if provider is "clinician"', async () => {
        const record = await factory.create('Clinician', {
          provider: 'clinician',
          providerKey: 'password1234',
        });

        const originalKey = record.providerKey;

        record.providerKey = '1234Password';
        await record.save();

        expect(record.providerKey).not.toEqual('password1234');
        expect(record.providerKey).not.toEqual(originalKey);
        expect(record.providerKey).not.toEqual('1234Password');
      });
    });
  });

  describe('Instance Methods', () => {
    describe('authenticate', () => {
      test('should compare a password', async () => {
        const record = await factory.create('Clinician', {
          provider: 'clinician',
          providerKey: 'password1234',
        });

        await expect(record.authenticate('password1234')).resolves.toEqual(
          true
        );
        await expect(record.authenticate('badPassword')).resolves.toEqual(
          false
        );
      });
    });

    describe('token', () => {
      test('should get a JWT for a clinician', async () => {
        const record = await factory.create('Clinician');
        const token = await record.token();
        const decoded = jwt.decode(token);

        expect(token).toBeDefined();
        expect(decoded.clinician.id).toBeDefined();
        expect(decoded.clinician.providerId).toBeDefined();
        expect(decoded.permissions).toBeDefined();
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeDefined();
      });
    });

    describe('accessCode', () => {
      test('should create an accessCode in LRU cache whose value is a valid jwt for the clinician', async () => {
        const record = await factory.create('Clinician');
        const code = await record.accessCode();

        expect(code).toBeDefined();
        const token = lru.get(code);
        expect(token).toBeDefined();
        const decoded = jwt.decode(token);
        expect(decoded.clinician.id).toBeDefined();
        expect(decoded.clinician.providerId).toBeDefined();
        expect(decoded.permissions).toBeDefined();
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeDefined();
      });
    });

    describe('addPermissions', () => {
      test('adds permissions by key', async () => {
        const clinician = await factory.create('Clinician');
        await clinician.addPermissions(['clinician.list', 'clinician.read']);

        const permissions = await db.Permission.findAll({
          where: { targetType: 'clinician', targetId: clinician.id },
        });
        expect(permissions.length).toEqual(2);
        const keys = permissions.map((p) => p.key);
        expect(keys.indexOf('clinician.list')).toBeGreaterThan(-1);
        expect(keys.indexOf('clinician.read')).toBeGreaterThan(-1);
      });

      test("doesn't bork if you add the same key twice", async () => {
        const clinician = await factory.create('Clinician');
        await clinician.addPermissions(['clinician.list']);

        await expect(
          clinician.addPermissions(['clinician.list'])
        ).resolves.toBeDefined();

        const permissions = await db.Permission.findAll({
          where: { targetType: 'clinician', targetId: clinician.id },
        });

        expect(permissions.length).toEqual(1);
      });
    });

    describe('makeSuper', () => {
      test('adds all permissions', async () => {
        const clinician = await factory.create('Clinician');
        await clinician.makeSuper();

        const permissions = await db.Permission.findAll({
          where: { targetType: 'clinician', targetId: clinician.id },
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
