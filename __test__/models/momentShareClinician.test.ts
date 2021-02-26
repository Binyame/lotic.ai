import { factory } from '../utils';

describe('Model - MomentShareClinician', () => {
  test('should create a model', async() => {
    const record = await factory.create('MomentShareClinician');
    expect(record).toBeDefined();
  });

  describe('Validations', () => {
    
    test('should require a valid momentShareId', async () => {
      const momentShare = await factory.create('MomentShare');
      await expect(factory.create('MomentShareClinician', { momentShareId: null })).rejects.toThrow();
      await expect(factory.create('MomentShareClinician', { momentShareId: false })).rejects.toThrow();
      await expect(factory.create('MomentShareClinician', { momentShareId: true })).rejects.toThrow();
      await expect(factory.create('MomentShareClinician', { momentShareId: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('MomentShareClinician', { momentShareId: 'bad-string' })).rejects.toThrow();

      await expect(factory.create('MomentShareClinician', { momentShareId: momentShare.id })).resolves.toBeDefined();
    });

    test('should require a valid clinicianId', async () => {
      const clinician = await factory.create('Clinician');
      await expect(factory.create('MomentShareClinician', { clinicianId: null })).rejects.toThrow();
      await expect(factory.create('MomentShareClinician', { clinicianId: false })).rejects.toThrow();
      await expect(factory.create('MomentShareClinician', { clinicianId: true })).rejects.toThrow();
      await expect(factory.create('MomentShareClinician', { clinicianId: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('MomentShareClinician', { clinicianId: 'bad-string' })).rejects.toThrow();

      await expect(factory.create('MomentShareClinician', { clinicianId: clinician.id })).resolves.toBeDefined();
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