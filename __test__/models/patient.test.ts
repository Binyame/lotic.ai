import jwt from 'jsonwebtoken';
import { factory, db } from '../utils';
import lru from '../../services/lru';
import { textSpanIntersection } from 'typescript';

describe('Model - Patient', () => {
  test('it creates a patient', async () => {
    const record = await factory.create('Patient', {
      providerId: '1234@example.com',
    });
    expect(record.providerId).toEqual('1234@example.com');
  });

  describe('Validations', () => {
    test('should require a valid provider', async () => {
      await expect(
        factory.create('Patient', { provider: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Patient', { provider: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Patient', { provider: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Patient', { provider: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Patient', { provider: 'random-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('Patient', { provider: 'patient' })
      ).resolves.toBeDefined();
    });

    test('should require a valid providerId', async () => {
      await expect(
        factory.create('Patient', { providerId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Patient', { providerId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Patient', { providerId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Patient', { providerId: 1234 })
      ).rejects.toThrow();

      await expect(
        factory.create('Patient', { providerId: 'some-provider-id' })
      ).resolves.toBeDefined();
    });

    test('should require a valid providerKey', async () => {
      await expect(
        factory.create('Patient', { providerKey: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Patient', { providerKey: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Patient', { providerKey: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Patient', { providerKey: 1234 })
      ).rejects.toThrow();

      await expect(
        factory.create('Patient', { providerKey: 'some-provider-key' })
      ).resolves.toBeDefined();
    });

    test('should not allow duplicate provider + providerId', async () => {
      const existing = await factory.create('Patient');
      const { provider, providerId } = existing;
      await expect(
        factory.create('Patient', { provider, providerId })
      ).rejects.toThrow();
    });
  });

  describe('Relationships', () => {
    let patient;

    beforeAll(async () => {
      patient = await factory.create('Patient');
    });

    test('hasMany Permission', async () => {
      const record = await factory.create('Permission', {
        targetId: patient.id,
        targetType: 'patient',
      });
      const found = await patient.getPermissions();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Provider', async () => {
      const record = await factory.create('Provider', {
        targetId: patient.id,
        targetType: 'patient',
      });
      const found = await patient.getProviders();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Email', async () => {
      const record = await factory.create('Email', {
        targetId: patient.id,
        targetType: 'patient',
      });
      const found = await patient.getEmails();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Address', async () => {
      const patient = await factory.create('Patient');
      const record = await factory.create('Address', {
        targetId: patient.id,
        targetType: 'patient',
      });
      const found = await patient.getAddresses();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasOne Profile', async () => {
      const patient = await factory.create('Patient');
      const record = await factory.create('Profile');

      await patient.setProfile(record);

      const found = await patient.getProfile();
      expect(found.id).toEqual(record.id);
    });

    test('hasMany PatientAssessment', async () => {
      const pa = await factory.create('PatientAssessment', {
        patientId: patient.id,
      });

      const found = await patient.getPatientAssessments();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(pa.id);
    });

    test('hasMany PatientAgreement', async () => {
      const pa = await factory.create('PatientAgreement', {
        patientId: patient.id,
      });

      const found = await patient.getPatientAgreements();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(pa.id);
    });

    test('hasMany DataPrint', async () => {
      const record = await factory.create('DataPrint', {
        patientId: patient.id,
      });

      const found = await patient.getDataPrints();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('hasMany Moment', async () => {
      const record = await factory.create('Moment', {
        patientId: patient.id,
      });

      const found = await patient.getMoments();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('belongsToMany Review through PatientReview', async () => {
      const patient = await factory.create('Patient');
      const review = await factory.create('Review');

      await factory.create('PatientReview', {
        patientId: patient.id,
        reviewId: review.id,
      });

      const found = await patient.getReviews();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(review.id);
    });

    test('hasMany PatientReview', async () => {
      const patient = await factory.create('Patient');
      const review = await factory.create('Review');

      const patientReview = await factory.create('PatientReview', {
        patientId: patient.id,
        reviewId: review.id,
      });

      const found = await patient.getPatientReviews();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(patientReview.id);
    });

    test('hasMany ReviewSubmission', async () => {
      const record = await factory.create('ReviewSubmission', {
        patientId: patient.id,
      });

      const found = await patient.getReviewSubmissions();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('belongsToMany Clinician through PatientClinician', async () => {
      const patient = await factory.create('Patient');
      const clinician = await factory.create('Clinician');

      await factory.create('PatientClinician', {
        patientId: patient.id,
        clinicianId: clinician.id,
      });

      const found = await patient.getClinicians();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(clinician.id);
    });
  });

  describe('Lifecycle Events', () => {
    describe('beforeCreate', () => {
      test('should hash provider key if provider is "patient"', async () => {
        const record = await factory.create('Patient', {
          provider: 'patient',
          providerKey: 'password1234',
        });

        expect(record.providerKey).not.toEqual('password1234');
      });
      test('should NOT hash providerKey if provider is anything else', async () => {
        const record = await factory.create('Patient', {
          provider: 'github',
          providerId: 'someProviderId',
          providerKey: 'someLongKeyGithubGaveMe',
        });

        expect(record.providerKey).toEqual('someLongKeyGithubGaveMe');
      });
    });
    describe('beforeUpdate', () => {
      test('should hash provider key if provider is "patient"', async () => {
        const record = await factory.create('Patient', {
          provider: 'patient',
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
        const record = await factory.create('Patient', {
          provider: 'patient',
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
      test('should get a JWT for a patient', async () => {
        const record = await factory.create('Patient');
        const token = await record.token();
        const decoded = jwt.decode(token);

        expect(token).toBeDefined();
        expect(decoded.patient.id).toBeDefined();
        expect(decoded.patient.providerId).toBeDefined();
        expect(decoded.permissions).toBeDefined();
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeDefined();
      });
    });

    describe('accessCode', () => {
      test('should create an accessCode in LRU cache whose value is a valid jwt for the patient', async () => {
        const record = await factory.create('Patient');
        const code = await record.accessCode();

        expect(code).toBeDefined();
        const token = lru.get(code);
        expect(token).toBeDefined();
        const decoded = jwt.decode(token);
        expect(decoded.patient.id).toBeDefined();
        expect(decoded.patient.providerId).toBeDefined();
        expect(decoded.permissions).toBeDefined();
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeDefined();
      });
    });

    describe('addPermissions', () => {
      test('adds permissions by key', async () => {
        const patient = await factory.create('Patient');
        await patient.addPermissions(['patient.list', 'patient.read']);

        const permissions = await db.Permission.findAll({
          where: { targetType: 'patient', targetId: patient.id },
        });
        expect(permissions.length).toEqual(2);
        const keys = permissions.map((p) => p.key);
        expect(keys.indexOf('patient.list')).toBeGreaterThan(-1);
        expect(keys.indexOf('patient.read')).toBeGreaterThan(-1);
      });

      test("doesn't bork if you add the same key twice", async () => {
        const patient = await factory.create('Patient');
        await patient.addPermissions(['patient.list']);

        await expect(
          patient.addPermissions(['patient.list'])
        ).resolves.toBeDefined();

        const permissions = await db.Permission.findAll({
          where: { targetType: 'patient', targetId: patient.id },
        });

        expect(permissions.length).toEqual(1);
      });
    });

    describe('makeSuper', () => {
      test('adds all permissions', async () => {
        const patient = await factory.create('Patient');
        await patient.makeSuper();

        const permissions = await db.Permission.findAll({
          where: { targetType: 'patient', targetId: patient.id },
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
