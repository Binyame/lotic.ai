import { templateSettings } from 'lodash';
import { factory } from '../utils';

describe('Model - Email', () => {
  test('should create a model', async() => {
    const record = await factory.create('Email', { email: 'test12345@example.com' });
    expect(record.email).toEqual('test12345@example.com');
  });

  describe('Validations', () => {

    test('should require a valid targetType', async () => {
      await expect(factory.create('Email', { targetType: null })).rejects.toThrow();
      await expect(factory.create('Email', { targetType: false })).rejects.toThrow();
      await expect(factory.create('Email', { targetType: true })).rejects.toThrow();
      await expect(factory.create('Email', { targetType: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('Email', { targetType: 'notavalidtype' })).rejects.toThrow();

      await expect(factory.create('Email', { targetType: 'patient' })).resolves.toBeDefined();
      await expect(factory.create('Email', { targetType: 'clinician' })).resolves.toBeDefined();
    });
    
    test('should require a valid targetId', async () => {
      const patient = await factory.create('Patient');
      await expect(factory.create('Email', { targetId: null })).rejects.toThrow();
      await expect(factory.create('Email', { targetId: false })).rejects.toThrow();
      await expect(factory.create('Email', { targetId: true })).rejects.toThrow();
      await expect(factory.create('Email', { targetId: patient.id })).resolves.toBeDefined();
    });

    test('should require a valid email', async () => {
      await expect(factory.create('Email', { email: null })).rejects.toThrow();
      await expect(factory.create('Email', { email: false })).rejects.toThrow();
      await expect(factory.create('Email', { email: true })).rejects.toThrow();
      await expect(factory.create('Email', { email: 1234 })).rejects.toThrow();
      await expect(factory.create('Email', { email: 'test@' })).rejects.toThrow();
      await expect(factory.create('Email', { email: 'test@test' })).rejects.toThrow();
      await expect(factory.create('Email', { email: '@test' })).rejects.toThrow();

      await expect(factory.create('Email', { email: 'goodemail@example.com' })).resolves.toBeDefined();
    });

    test('should default primary to false', async () => {
      const record = await factory.create('Email');
      expect(record.primary).toEqual(false);
    });

    test('should not allow duplicate targetType + targetId + email', async () => {
      const existing = await factory.create('Email');
      const { targetType, targetId, email } = existing;
      await expect(factory.create('Email', { targetType, targetId, email })).rejects.toThrow();
    });
  });
  
  describe('Relationships', () => {
    test('belongsTo Patient', async () => {
      const patient = await factory.create('Patient');
      const record = await factory.create('Email');

      await record.setPatient(patient);

      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });
    test('belongsTo Clinician', async () => {
      const clinician = await factory.create('Clinician');
      const record = await factory.create('Email');

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