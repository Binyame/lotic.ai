import { factory, db } from '../utils';

describe('Model - Provider', () => {
  test('it creates a user', async () => {
    const record = await factory.create('Provider', { providerId: '1234@example.com' });
    expect(record.providerId).toEqual('1234@example.com');
  });

  describe('Validations', () => {
    test('should require a valid targetType', async () => {
      await expect(factory.create('Provider', { targetType: null })).rejects.toThrow();
      await expect(factory.create('Provider', { targetType: false })).rejects.toThrow();
      await expect(factory.create('Provider', { targetType: true })).rejects.toThrow();
      await expect(factory.create('Provider', { targetType: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('Provider', { targetType: 'notavalidtype' })).rejects.toThrow();

      await expect(factory.create('Provider', { targetType: 'patient' })).resolves.toBeDefined();
      await expect(factory.create('Provider', { targetType: 'clinician' })).resolves.toBeDefined();
    });
    
    test('should require a valid targetId', async () => {
      const patient = await factory.create('Patient');
      await expect(factory.create('Provider', { targetId: null })).rejects.toThrow();
      await expect(factory.create('Provider', { targetId: false })).rejects.toThrow();
      await expect(factory.create('Provider', { targetId: true })).rejects.toThrow();
      await expect(factory.create('Provider', { targetId: patient.id })).resolves.toBeDefined();
    });

    test('should require a valid provider', async () => {
      await expect(factory.create('Provider', { provider: null })).rejects.toThrow();
      await expect(factory.create('Provider', { provider: false })).rejects.toThrow();
      await expect(factory.create('Provider', { provider: true })).rejects.toThrow();
      await expect(factory.create('Provider', { provider: 1234 })).rejects.toThrow();
      await expect(factory.create('Provider', { provider: 'random-string' })).rejects.toThrow();

      await expect(factory.create('Provider', { provider: 'patient' })).resolves.toBeDefined();
    });

    test('should require a valid providerId', async () => {
      await expect(factory.create('Provider', { providerId: null })).rejects.toThrow();
      await expect(factory.create('Provider', { providerId: false })).rejects.toThrow();
      await expect(factory.create('Provider', { providerId: true })).rejects.toThrow();
      await expect(factory.create('Provider', { providerId: 1234 })).rejects.toThrow();

      await expect(factory.create('Provider', { providerId: 'some-provider-id' })).resolves.toBeDefined();
    });

    test('should require a valid accessToken', async () => {
      await expect(factory.create('Provider', { accessToken: null })).rejects.toThrow();
      await expect(factory.create('Provider', { accessToken: false })).rejects.toThrow();
      await expect(factory.create('Provider', { accessToken: true })).rejects.toThrow();
      await expect(factory.create('Provider', { accessToken: 1234 })).rejects.toThrow();

      await expect(factory.create('Provider', { accessToken: 'some-provider-key' })).resolves.toBeDefined();
    });

    test('should not allow duplicate targetType + targetId + provider + providerId', async () => {
      const existing = await factory.create('Provider');
      const {
        targetType,
        targetId,
        provider,
        providerId
      } = existing;

      await expect(factory.create('Provider', {
        targetType,
        targetId,
        provider,
        providerId
      })).rejects.toThrow();
    });
  });

  describe('Relationships', () => {
    test('belongsTo Patient', async () => {
      const patient = await factory.create('Patient');
      const record = await factory.create('Provider');

      await record.setPatient(patient);

      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });
    test('belongsTo Clinician', async () => {
      const clinician = await factory.create('Clinician');
      const record = await factory.create('Provider');

      await record.setClinician(clinician);

      const found = await record.getClinician();
      expect(found.id).toEqual(clinician.id);
    });
  });

  describe('Lifecycle Events', () => {});

  describe('Instance Methods', () => {});
});
