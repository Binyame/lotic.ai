import { v4 } from 'uuid';
import { factory } from '../utils';

describe('Model - MomentShare', () => {
  test('should create a model', async() => {
    const record = await factory.create('MomentShare', { uri: 'https://www.example.com/moment/asfdfd' });
    expect(record.uri).toEqual('https://www.example.com/moment/asfdfd');
  });

  describe('Validations', () => {
    
    test('should require a valid momentUuid', async () => {
      const moment = await factory.create('Moment');
      await expect(factory.create('MomentShare', { momentUuid: null })).rejects.toThrow();
      await expect(factory.create('MomentShare', { momentUuid: false })).rejects.toThrow();
      await expect(factory.create('MomentShare', { momentUuid: true })).rejects.toThrow();
      await expect(factory.create('MomentShare', { momentUuid: 1234 })).rejects.toThrow();
      await expect(factory.create('MomentShare', { momentUuid: 'bad-string' })).rejects.toThrow();

      await expect(factory.create('MomentShare', { momentUuid: moment.uuid })).resolves.toBeDefined();
    });

    test('should reject invalid uri', async () => {
      await expect(factory.create('MomentShare', { uri: 1 })).rejects.toThrow();
      await expect(factory.create('MomentShare', { uri: false })).rejects.toThrow();
      await expect(factory.create('MomentShare', { uri: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('MomentShare', { uri: 'test@example.com' })).rejects.toThrow();

      await expect(factory.create('MomentShare', { uri: 'https://www.example.com/image.png' })).resolves.toBeDefined();
    });
  });
  
  describe('Relationships', () => {
    test('belongsTo Moment', async () => {
      const moment = await factory.create('Moment');
      const record = await factory.create('MomentShare');

      await record.setMoment(moment);

      const found = await record.getMoment();
      expect(found.uuid).toEqual(moment.uuid);
    });

    test('belongsToMany Clinician through MomentShareClinician', async () => {
      const momentShare = await factory.create('MomentShare');
      const clinician = await factory.create('Clinician');

      await factory.create('MomentShareClinician', {
        momentShareId: momentShare.id,
        clinicianId: clinician.id
      });

      const found = await momentShare.getClinicians();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(clinician.id);
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