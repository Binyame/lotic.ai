import { factory } from '../utils';

describe('Model - Permission', () => {
  describe('Validations', () => {
    test('should create a permission', async () => {
      const record = await factory.create('Permission', { key: 'patient.list' });
      expect(record.key).toEqual('patient.list');
    });

    test('should require a valid targetType', async () => {
      await expect(factory.create('Permission', { targetType: null })).rejects.toThrow();
      await expect(factory.create('Permission', { targetType: false })).rejects.toThrow();
      await expect(factory.create('Permission', { targetType: true })).rejects.toThrow();
      await expect(factory.create('Permission', { targetType: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('Permission', { targetType: 'notavalidtype' })).rejects.toThrow();

      await expect(factory.create('Permission', { targetType: 'patient' })).resolves.toBeDefined();
      await expect(factory.create('Permission', { targetType: 'clinician' })).resolves.toBeDefined();
    });
    
    test('should require a valid targetId', async () => {
      const patient = await factory.create('Patient');
      await expect(factory.create('Permission', { targetId: null })).rejects.toThrow();
      await expect(factory.create('Permission', { targetId: false })).rejects.toThrow();
      await expect(factory.create('Permission', { targetId: true })).rejects.toThrow();
      await expect(factory.create('Permission', { targetId: patient.id })).resolves.toBeDefined();
    });

    test('should require a valid key', async () => {
      await expect(factory.create('Permission', { key: null })).rejects.toThrow('notNull');
      await expect(factory.create('Permission', { key: 1 })).rejects.toThrow('key');
      await expect(factory.create('Permission', { key: false })).rejects.toThrow('key');
      await expect(factory.create('Permission', { key: { foo: 'bar' } })).rejects.toThrow('key');
      await expect(factory.create('Permission', { key: 'invalid-key' })).rejects.toThrow('key');
      
      await expect(factory.create('Permission', { key: 'patient.list' })).resolves.toBeDefined();
    });

  });
  describe('Relationships', () => {
    test('belongsTo Patient', async () => {
      const patient = await factory.create('Patient');
      const record = await factory.create('Permission');

      await record.setPatient(patient);

      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });
    test('belongsTo Clinician', async () => {
      const clinician = await factory.create('Clinician');
      const record = await factory.create('Permission');

      await record.setClinician(clinician);

      const found = await record.getClinician();
      expect(found.id).toEqual(clinician.id);
    });
  });
  describe('LifeCycle Events', () => {});
  describe('Instance Methods', () => {});
});
