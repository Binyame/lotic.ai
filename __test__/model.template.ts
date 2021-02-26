import { factory } from '../utils';

describe('Model - [NAME]', () => {
  test('should create a model', async() => {
    const record = await factory.create('[NAME]', { attribute: 'value' });
    expect(record.attribute).toEqual('value');
  });

  describe('Validations', () => {
    
    test('should require a valid attributeA', async () => {
      await expect(factory.create('[NAME]', { attributeA: null })).rejects.toThrow();
      await expect(factory.create('[NAME]', { attributeA: false })).rejects.toThrow();
      await expect(factory.create('[NAME]', { attributeA: true })).rejects.toThrow();
      await expect(factory.create('[NAME]', { attributeA: 1234 })).rejects.toThrow();
      await expect(factory.create('[NAME]', { attributeA: 'bad-string' })).rejects.toThrow();

      await expect(factory.create('[NAME]', { attributeA: 'good-string' })).resolves.toBeDefined();
    });

    test('should reject invalid attributeB', async () => {
      await expect(factory.create('[NAME]', { attributeB: 1 })).rejects.toThrow('string');
      await expect(factory.create('[NAME]', { attributeB: false })).rejects.toThrow('string');
      await expect(factory.create('[NAME]', { attributeB: { foo: 'bar' } })).rejects.toThrow('string');
      await expect(factory.create('[NAME]', { attributeB: 'SomeName' })).rejects.toThrow();
      await expect(factory.create('[NAME]', { attributeB: 'SomeName@' })).rejects.toThrow();
      await expect(factory.create('[NAME]', { attributeB: 'SomeName@example' })).rejects.toThrow();
      
      await expect(factory.create('[NAME]', { attributeB: 'test@example.com' })).resolves.toBeDefined();
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