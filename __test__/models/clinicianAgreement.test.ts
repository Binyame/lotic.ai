import { factory } from '../utils';

describe('Model - ClinicianAgreement', () => {
  test('should create an clinicianAgreement', async() => {
    const record = await factory.create('ClinicianAgreement', { agreed: false });
    expect(record.agreed).toEqual(false);
  });

  describe('Validations', () => {
    test('requires a valid clinicianId', async () => {
      const clinician = await factory.create('Clinician');
      await expect(factory.create('ClinicianAgreement', { clinicianId: null })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { clinicianId: false })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { clinicianId: true })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { clinicianId: 'random-string' })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { clinicianId: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('ClinicianAgreement', { clinicianId: clinician.id })).resolves.toBeDefined();
    });

    test('requires a valid agreementId', async () => {
      const agreement = await factory.create('Agreement');
      await expect(factory.create('ClinicianAgreement', { agreementId: null })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreementId: false })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreementId: true })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreementId: 'random-string' })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreementId: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('ClinicianAgreement', { agreementId: agreement.id })).resolves.toBeDefined();
    });

    test('requires a valid agreed', async () => {
      await expect(factory.create('ClinicianAgreement', { agreed: null })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreed: 1234 })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreed: 'random-string' })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreed: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('ClinicianAgreement', { agreed: false })).resolves.toBeDefined();
      await expect(factory.create('ClinicianAgreement', { agreed: true })).resolves.toBeDefined();
    });

    test('defaults to false agreed', async () => {
      const ClinicianAgreement = await factory.create('ClinicianAgreement');
      await expect(ClinicianAgreement.agreed).toEqual(false);
    });

    test('requires a valid agreedAt', async () => {
      await expect(factory.create('ClinicianAgreement', { agreedAt: null })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreedAt: false })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreedAt: 1234 })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreedAt: true })).rejects.toThrow();

      await expect(factory.create('ClinicianAgreement', { agreedAt: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('ClinicianAgreement', { agreedAt: 'Good' })).rejects.toThrow();

      await expect(factory.create('ClinicianAgreement', { agreedAt: '2019-12-27T15:20:00.421Z' })).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    let clinician, agreement, record;

    beforeAll(async () => {
      clinician = await factory.create('Patient');
      agreement = await factory.create('Agreement');
      record = await factory.create('ClinicianAgreement', {
        clinicianId: clinician.id,
        agreementId: agreement.id,
      });
    });

    test('belongsTo Agreement', async () => {
      const found = await record.getAgreement();
      expect(found.id).toEqual(agreement.id);
    });

    test('belongsTo Clinician', async () => {
      const found = await record.getClinician();
      expect(found.id).toEqual(clinician.id);
    });
  });

});
