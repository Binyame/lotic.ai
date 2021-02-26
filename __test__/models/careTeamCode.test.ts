import { factory } from '../utils';

describe('Model - CareTeamCode', () => {
  test('should create an careTeamCode', async () => {
    const clinician = await factory.create('Clinician');
    const record = await factory.create('CareTeamCode', { clinicianId: clinician.id });
    expect(record.clinicianId).toEqual(clinician.id);
  });

  describe('Validations', () => {
    test('requires a valid clinicianId', async () => {
      const clinician = await factory.create('Clinician');
      await expect(
        factory.create('CareTeamCode', { clinicianId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { clinicianId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { clinicianId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { clinicianId: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { clinicianId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('CareTeamCode', { clinicianId: clinician.id })
      ).resolves.toBeDefined();
    });

    test('requires a valid patientName', async () => {
      await expect(
        factory.create('CareTeamCode', { patientName: null })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { patientName: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { patientName: false })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { patientName: true })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { patientName: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('CareTeamCode', { patientName: 'Patient Name' })
      ).resolves.toBeDefined();
    });

    test('requires a valid method', async () => {
      await expect(
        factory.create('CareTeamCode', { method: null })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { method: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { method: false })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { method: true })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { method: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { method: 'random string' })
      ).rejects.toThrow();

      await expect(
        factory.create('CareTeamCode', { method: 'email' })
      ).resolves.toBeDefined();
      await expect(
        factory.create('CareTeamCode', { method: 'sms' })
      ).resolves.toBeDefined();
    });

    test('requires a valid deliveryAddress', async () => {
      await expect(
        factory.create('CareTeamCode', { deliveryAddress: null })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { deliveryAddress: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { deliveryAddress: false })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { deliveryAddress: true })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { deliveryAddress: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('CareTeamCode', {
          deliveryAddress: 'goodemail@example.com',
        })
      ).resolves.toBeDefined();
      await expect(
        factory.create('CareTeamCode', { deliveryAddress: '(123) 456-7890' })
      ).resolves.toBeDefined();
    });

    test('requires a valid expiry', async () => {
      await expect(
        factory.create('CareTeamCode', { expiry: null })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { expiry: false })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { expiry: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { expiry: true })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { expiry: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { expiry: 'asd123' })
      ).rejects.toThrow();

      await expect(
        factory.create('CareTeamCode', { expiry: '2019-12-27T15:20:00.421Z' })
      ).resolves.toBeDefined();
    });

    test('requires a valid usedOn', async () => {
      await expect(
        factory.create('CareTeamCode', { usedOn: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { usedOn: false })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { usedOn: true })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { usedOn: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('CareTeamCode', { usedOn: 'random-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('CareTeamCode', { usedOn: '2019-12-27T15:20:00.421Z' })
      ).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    let clinician, record;

    beforeAll(async () => {
      clinician = await factory.create('Patient');
      record = await factory.create('CareTeamCode', {
        clinicianId: clinician.id,
      });
    });

    test('belongsTo Clinician', async () => {
      const found = await record.getClinician();
      expect(found.id).toEqual(clinician.id);
    });
  });

  describe('LifeCycle', () => {
    describe('beforeValidate', () => {
      test('generates a unique code value', async () => {
        const careTeamCode = await factory.create('CareTeamCode', { code: null });
        expect(careTeamCode.code).toBeDefined();
      });
    });
  })
});
