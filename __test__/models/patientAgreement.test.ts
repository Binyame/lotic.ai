import { factory } from '../utils';

describe('Model - PatientAgreement', () => {
  test('should create an agreement', async() => {
    const record = await factory.create('Agreement', { name: 'New Name' });
    expect(record.name).toEqual('New Name');
  });

  describe('Validations', () => {
    test('requires a valid patientId', async () => {
      const patient = await factory.create('Patient');
      await expect(factory.create('PatientAgreement', { patientId: null })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { patientId: false })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { patientId: true })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { patientId: 'random-string' })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { patientId: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('PatientAgreement', { patientId: patient.id })).resolves.toBeDefined();
    });

    test('requires a valid agreementId', async () => {
      const agreement = await factory.create('Agreement');
      await expect(factory.create('PatientAgreement', { agreementId: null })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreementId: false })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreementId: true })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreementId: 'random-string' })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreementId: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('PatientAgreement', { agreementId: agreement.id })).resolves.toBeDefined();
    });

    test('requires a valid agreed', async () => {
      await expect(factory.create('PatientAgreement', { agreed: null })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreed: 1234 })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreed: 'random-string' })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreed: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('PatientAgreement', { agreed: false })).resolves.toBeDefined();
      await expect(factory.create('PatientAgreement', { agreed: true })).resolves.toBeDefined();
    });

    test('defaults to false agreed', async () => {
      const PatientAgreement = await factory.create('PatientAgreement');
      await expect(PatientAgreement.agreed).toEqual(false);
    });

    test('requires a valid agreedAt', async () => {
      await expect(factory.create('PatientAgreement', { agreedAt: null })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreedAt: false })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreedAt: 1234 })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreedAt: true })).rejects.toThrow();

      await expect(factory.create('PatientAgreement', { agreedAt: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('PatientAgreement', { agreedAt: 'Good Title' })).rejects.toThrow();

      await expect(factory.create('PatientAgreement', { agreedAt: '2019-12-27T15:19:24.421Z' })).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    let patient, agreement, record;

    beforeAll(async () => {
      patient = await factory.create('Patient');
      agreement = await factory.create('Agreement');
      record = await factory.create('PatientAgreement', {
        patientId: patient.id,
        agreementId: agreement.id,
      });
    });

    test('belongsTo Patient', async () => {
      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });

    test('belongsTo Agreement', async () => {
      const found = await record.getAgreement();
      expect(found.id).toEqual(agreement.id);
    });
  });

});
