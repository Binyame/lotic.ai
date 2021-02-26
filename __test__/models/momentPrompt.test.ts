import { factory } from '../utils';

describe('Model - MomentPrompt', () => {
  test('should create a model', async() => {
    const record = await factory.create('MomentPrompt', { startTimeMs: 2000 });
    expect(record.startTimeMs).toEqual(2000);
  });

  describe('Validations', () => {
    
    test('should require a valid momentUuid', async () => {
      const moment = await factory.create('Moment');

      await expect(factory.create('MomentPrompt', { momentUuid: null })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { momentUuid: false })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { momentUuid: true })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { momentUuid: 1234 })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { momentUuid: 'bad-string' })).rejects.toThrow();

      await expect(factory.create('MomentPrompt', { momentUuid: moment.uuid })).resolves.toBeDefined();
    });

    test('should require a valid promptId', async () => {
      const prompt = await factory.create('Prompt');

      await expect(factory.create('MomentPrompt', { promptId: null })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { promptId: false })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { promptId: true })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { promptId: { foo: 'bar' }})).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { promptId: 'bad-string' })).rejects.toThrow();

      await expect(factory.create('MomentPrompt', { promptId: prompt.id })).resolves.toBeDefined();
    });

    test('should require a valid startTimeMs', async () => {
      await expect(factory.create('MomentPrompt', { startTimeMs: null })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { startTimeMs: false })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { startTimeMs: true })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { startTimeMs: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { startTimeMs: 'bad-string' })).rejects.toThrow();

      await expect(factory.create('MomentPrompt', { startTimeMs: 1234 })).resolves.toBeDefined();
    });

    test('should require a valid endTimeMs', async () => {
      await expect(factory.create('MomentPrompt', { endTimeMs: null })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { endTimeMs: false })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { endTimeMs: true })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { endTimeMs: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('MomentPrompt', { endTimeMs: 'bad-string' })).rejects.toThrow();

      await expect(factory.create('MomentPrompt', { endTimeMs: 1234 })).resolves.toBeDefined();
    });
  });
  
  describe('Relationships', () => {

    test('belongsTo Moment', async () => {
      let moment = await factory.create('Moment');
      let record = await factory.create('MomentPrompt', {
        momentUuid: moment.uuid
      });

      const found = await record.getMoment();
      expect(found.uuid).toEqual(moment.uuid);
    });

    test('belongsTo Prompt', async () => {
      let prompt = await factory.create('Prompt');
      let record = await factory.create('MomentPrompt', {
        promptId: prompt.id
      });

      const found = await record.getPrompt();
      expect(found.id).toEqual(prompt.id);
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