import { factory } from '../utils';

describe('Model - HCProviderClinician', () => {
  test('should create a model', async() => {
    const record = await factory.create('HCProviderClinician');
    expect(record).toBeDefined();
  });


  describe('Validations', () => {
    
    test('should require a valid hcProviderId', async () => {
      const hcProvider = await factory.create('HCProvider');
      await expect(factory.create('HCProviderClinician', { hcProviderId: null })).rejects.toThrow();
      await expect(factory.create('HCProviderClinician', { hcProviderId: false })).rejects.toThrow();
      await expect(factory.create('HCProviderClinician', { hcProviderId: true })).rejects.toThrow();
      await expect(factory.create('HCProviderClinician', { hcProviderId: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('HCProviderClinician', { hcProviderId: 'bad-string' })).rejects.toThrow();

      await expect(factory.create('HCProviderClinician', { hcProviderId: hcProvider.id })).resolves.toBeDefined();
    });

    test('should require a valid clinicianId', async () => {
      const clinician = await factory.create('Clinician');
      await expect(factory.create('HCProviderClinician', { clinicianId: null })).rejects.toThrow();
      await expect(factory.create('HCProviderClinician', { clinicianId: false })).rejects.toThrow();
      await expect(factory.create('HCProviderClinician', { clinicianId: true })).rejects.toThrow();
      await expect(factory.create('HCProviderClinician', { clinicianId: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('HCProviderClinician', { clinicianId: 'bad-string' })).rejects.toThrow();

      await expect(factory.create('HCProviderClinician', { clinicianId: clinician.id })).resolves.toBeDefined();
    });
  });
  
  describe('Relationships', () => {});
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