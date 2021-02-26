import { factory } from '../utils';

describe('Model - Content', () => {
  test('should create a model', async () => {
    const record = await factory.create('Content', { title: 'New Title' });
    expect(record.title).toEqual('New Title');
  });

  describe('Validations', () => {
    test('should require a valid title', async () => {
      await expect(
        factory.create('Content', { title: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { title: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { title: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { title: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { title: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Content', { title: 'Good Title' })
      ).resolves.toBeDefined();
    });

    test('should require a valid content', async () => {
      await expect(
        factory.create('Content', { content: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { content: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { content: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { content: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { content: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Content', { content: 'Good Title' })
      ).resolves.toBeDefined();
    });

    test('should require a valid type', async () => {
      await expect(factory.create('Content', { type: null })).rejects.toThrow();
      await expect(
        factory.create('Content', { type: false })
      ).rejects.toThrow();
      await expect(factory.create('Content', { type: true })).rejects.toThrow();
      await expect(factory.create('Content', { type: 1234 })).rejects.toThrow();
      await expect(
        factory.create('Content', { type: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Content', { type: 'Good Title' })
      ).resolves.toBeDefined();
    });

    test('should require a valid sourceUri', async () => {
      await expect(
        factory.create('Content', { sourceUri: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { sourceUri: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { sourceUri: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { sourceUri: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { sourceUri: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { sourceUri: 'Good Title' })
      ).rejects.toThrow();

      await expect(
        factory.create('Content', {
          sourceUri: 'https://www.example.com/content',
        })
      ).resolves.toBeDefined();
    });

    test('should require a valid thumbnailUri', async () => {
      await expect(
        factory.create('Content', { thumbnailUri: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { thumbnailUri: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { thumbnailUri: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { thumbnailUri: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { thumbnailUri: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { thumbnailUri: 'Good Title' })
      ).rejects.toThrow();

      await expect(
        factory.create('Content', {
          thumbnailUri: 'https://www.example.com/content',
        })
      ).resolves.toBeDefined();
    });

    test('should require a valid source', async () => {
      await expect(factory.create('Content', { source: false })).rejects.toThrow();
      await expect(factory.create('Content', { source: true })).rejects.toThrow();
      await expect(factory.create('Content', { source: 1234 })).rejects.toThrow();
      await expect(factory.create('Content', { source: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('Content', { source: 'Good Title' })).resolves.toBeDefined();
    });

    test('should require a valid author', async () => {
      await expect(
        factory.create('Content', { author: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { author: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { author: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { author: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { author: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Content', { author: 'Good author' })
      ).resolves.toBeDefined();
    });

    test('should require a valid area', async () => {
      await expect(factory.create('Content', { area: null })).rejects.toThrow();
      await expect(
        factory.create('Content', { area: false })
      ).rejects.toThrow();
      await expect(factory.create('Content', { area: true })).rejects.toThrow();
      await expect(factory.create('Content', { area: 1234 })).rejects.toThrow();
      await expect(
        factory.create('Content', { area: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Content', { area: 'Good area' })
      ).resolves.toBeDefined();
    });

    test('should require a valid tags', async () => {
      await expect(factory.create('Content', { tags: null })).rejects.toThrow();
      await expect(
        factory.create('Content', { tags: false })
      ).rejects.toThrow();
      await expect(factory.create('Content', { tags: true })).rejects.toThrow();
      await expect(factory.create('Content', { tags: 1234 })).rejects.toThrow();
      await expect(
        factory.create('Content', { tags: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { tags: 'String' })
      ).rejects.toThrow();

      await expect(
        factory.create('Content', { tags: ['tag1', 'tag2'] })
      ).resolves.toBeDefined();
    });

    test('should require a valid preview', async () => {
      await expect(
        factory.create('Content', { preview: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { preview: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { preview: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { preview: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Content', { preview: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Content', { preview: 'Good preview' })
      ).resolves.toBeDefined();
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
