import { factory } from '../utils';

describe('Model - Address', () => {
  test('should create a model', async() => {
    const record = await factory.create('Address', { region: 'Texas' });
    expect(record.region).toEqual('Texas');
  });

  describe('Validations', () => {
    
    test('should require a valid targetType', async () => {
      await expect(factory.create('Address', { targetType: null })).rejects.toThrow();
      await expect(factory.create('Address', { targetType: false })).rejects.toThrow();
      await expect(factory.create('Address', { targetType: true })).rejects.toThrow();
      await expect(factory.create('Address', { targetType: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('Address', { targetType: 'notavalidtype' })).rejects.toThrow();

      await expect(factory.create('Address', { targetType: 'patient' })).resolves.toBeDefined();
      await expect(factory.create('Address', { targetType: 'clinician' })).resolves.toBeDefined();
    });
    
    test('should require a valid targetId', async () => {
      const patient = await factory.create('Patient');
      await expect(factory.create('Address', { targetId: null })).rejects.toThrow();
      await expect(factory.create('Address', { targetId: false })).rejects.toThrow();
      await expect(factory.create('Address', { targetId: true })).rejects.toThrow();
      await expect(factory.create('Address', { targetId: patient.id })).resolves.toBeDefined();
    });

    test('should reject invalid region', async () => {
      await expect(factory.create('Address', { region: 1 })).rejects.toThrow('string');
      await expect(factory.create('Address', { region: false })).rejects.toThrow('string');
      await expect(factory.create('Address', { region: { foo: 'bar' } })).rejects.toThrow('string');
      await expect(factory.create('Address', { region: 'region' })).resolves.toBeDefined();
    });

    test('should reject invalid country', async () => {
      await expect(factory.create('Address', { country: 1 })).rejects.toThrow('string');
      await expect(factory.create('Address', { country: false })).rejects.toThrow('string');
      await expect(factory.create('Address', { country: { foo: 'bar' } })).rejects.toThrow('string');
      await expect(factory.create('Address', { country: 'country' })).resolves.toBeDefined();
    });

    test('should reject invalid locality', async () => {
      await expect(factory.create('Address', { locality: 1 })).rejects.toThrow('string');
      await expect(factory.create('Address', { locality: false })).rejects.toThrow('string');
      await expect(factory.create('Address', { locality: { foo: 'bar' } })).rejects.toThrow('string');
      await expect(factory.create('Address', { locality: 'locality' })).resolves.toBeDefined();
    });

    test('should reject invalid postalCode', async () => {
      await expect(factory.create('Address', { postalCode: 1 })).rejects.toThrow('string');
      await expect(factory.create('Address', { postalCode: false })).rejects.toThrow('string');
      await expect(factory.create('Address', { postalCode: { foo: 'bar' } })).rejects.toThrow('string');
      await expect(factory.create('Address', { postalCode: 'postalCode' })).resolves.toBeDefined();
    });

    test('should reject invalid address1', async () => {
      await expect(factory.create('Address', { address1: 1 })).rejects.toThrow('string');
      await expect(factory.create('Address', { address1: false })).rejects.toThrow('string');
      await expect(factory.create('Address', { address1: { foo: 'bar' } })).rejects.toThrow('string');
      await expect(factory.create('Address', { address1: 'address1' })).resolves.toBeDefined();
    });

    test('should reject invalid address2', async () => {
      await expect(factory.create('Address', { address2: 1 })).rejects.toThrow('string');
      await expect(factory.create('Address', { address2: false })).rejects.toThrow('string');
      await expect(factory.create('Address', { address2: { foo: 'bar' } })).rejects.toThrow('string');
      await expect(factory.create('Address', { address2: 'address2' })).resolves.toBeDefined();
    });

    test('should reject invalid address2', async () => {
      await expect(factory.create('Address', { address2: 1 })).rejects.toThrow('string');
      await expect(factory.create('Address', { address2: false })).rejects.toThrow('string');
      await expect(factory.create('Address', { address2: { foo: 'bar' } })).rejects.toThrow('string');
      await expect(factory.create('Address', { address2: 'address2' })).resolves.toBeDefined();
    });

    test('should reject invalid address4', async () => {
      await expect(factory.create('Address', { address4: 1 })).rejects.toThrow('string');
      await expect(factory.create('Address', { address4: false })).rejects.toThrow('string');
      await expect(factory.create('Address', { address4: { foo: 'bar' } })).rejects.toThrow('string');
      await expect(factory.create('Address', { address4: 'address4' })).resolves.toBeDefined();
    });
  });
  
  describe('Relationships', () => {
    test('belongsTo Patient', async () => {
      const patient = await factory.create('Patient');
      const record = await factory.create('Address');

      await record.setPatient(patient);

      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });
    test('belongsTo Clinician', async () => {
      const clinician = await factory.create('Clinician');
      const record = await factory.create('Address');

      await record.setClinician(clinician);

      const found = await record.getClinician();
      expect(found.id).toEqual(clinician.id);
    });
  });
  describe('Hooks', () => {
    describe('beforeValidate', () => {});
    describe('afterValidate', () => {});
    describe('beforeCreate', () => {});
    describe('beforeDestroy', () => {});
    describe('beforeUpdate', () => {});
    describe('beforeSave', () => {});
    describe('beforeUpsert', () => {});
    describe('afterCreate', () => {});
    describe('afterDestroy', () => {});
    describe('afterUpdate', () => {});
    describe('afterSave', () => {});
    describe('afterUpsert', () => {});
  });
  describe('Instance Methods', () => {});
});