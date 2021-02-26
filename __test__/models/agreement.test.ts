import { factory } from '../utils';

describe('Model - Agreement', () => {
  test('it creates an agreement', async () => {
    const record = await factory.create('Agreement', { name: 'New Name' });
    expect(record.name).toEqual('New Name');
  });

  describe('Validations', () => {
    test('should require a valid type', async () => {
      await expect(
        factory.create('Agreement', { type: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { type: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { type: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { type: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { type: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Agreement', { type: 'Good Type' })
      ).resolves.toBeDefined();
    });

    test('should require a valid active', async () => {
      await expect(
        factory.create('Agreement', { active: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { active: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { active: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { active: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Agreement', { active: false })
      ).resolves.toBeDefined();
      await expect(
        factory.create('Agreement', { active: true })
      ).resolves.toBeDefined();
    });

    test('active defaultsTo false', async () => {
      const agreement = await factory.create('Agreement');
      await expect(agreement.active).toEqual(false);
    });

    test('should require a valid name', async () => {
      await expect(
        factory.create('Agreement', { name: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { name: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { name: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { name: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { name: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Agreement', { name: 'Good Name' })
      ).resolves.toBeDefined();
    });

    test('should require a valid key', async () => {
      await expect(
        factory.create('Agreement', { key: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { key: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { key: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { key: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { key: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Agreement', { key: 'Good Key' })
      ).resolves.toBeDefined();
    });

    test('should require a valid version', async () => {
      await expect(
        factory.create('Agreement', { version: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { version: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { version: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { version: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { version: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Agreement', { version: 'Good Version' })
      ).resolves.toBeDefined();
    });

    test('should require a valid content', async () => {
      await expect(
        factory.create('Agreement', { content: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { content: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { content: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { content: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { content: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('Agreement', { content: 'Good Content' })
      ).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    let agreement;

    beforeAll(async () => {
      agreement = await factory.create('Agreement');
    });

    test('hasMany ClinicianAgreement', async () => {
      const clinician = await factory.create('Clinician');
      const clinicianAgreement = await factory.create('ClinicianAgreement', {
        clinicianId: clinician.id,
        agreementId: agreement.id,
      });

      const found = await agreement.getClinicianAgreements();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(clinicianAgreement.id);
    });

    test('hasMany PatientAgreement', async () => {
      const pa = await factory.create('PatientAgreement', {
        agreementId: agreement.id,
      });

      const found = await agreement.getPatientAgreements();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(pa.id);
    });
  });
});
