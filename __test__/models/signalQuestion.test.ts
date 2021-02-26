import { factory } from '../utils';

describe('Model - SignalQuestion', () => {
  test('should create a model', async () => {
    const record = await factory.create('SignalQuestion', {
      content: 'Some Content',
    });
    expect(record.content).toEqual('Some Content');
  });

  describe('Validations', () => {
    test('should require a valid reviewId', async () => {
      const review = await factory.create('Review');

      await expect(
        factory.create('SignalQuestion', { reviewId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { reviewId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { reviewId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { reviewId: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { reviewId: 'bad-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('SignalQuestion', { reviewId: review.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid assessmentId', async () => {
      const assessment = await factory.create('Assessment');

      await expect(
        factory.create('SignalQuestion', { assessmentId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { assessmentId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { assessmentId: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { assessmentId: 'bad-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('SignalQuestion', { assessmentId: assessment.id })
      ).resolves.toBeDefined();
      await expect(
        factory.create('SignalQuestion', { assessmentId: null })
      ).resolves.toBeDefined();
    });

    test('should require a valid content', async () => {
      await expect(
        factory.create('SignalQuestion', { content: null })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { content: false })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { content: true })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { content: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { content: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('SignalQuestion', { content: 'good-string' })
      ).resolves.toBeDefined();
    });

    test('should require a valid type', async () => {
      await expect(
        factory.create('SignalQuestion', { type: null })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { type: false })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { type: true })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { type: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { type: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('SignalQuestion', { type: 'bad-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('SignalQuestion', { type: 'boolean' })
      ).resolves.toBeDefined();
      await expect(
        factory.create('SignalQuestion', { type: 'scale' })
      ).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    let record;

    beforeAll(async () => {
      record = await factory.create('SignalQuestion');
    });

    test('belongsTo Review', async () => {
      let review = await factory.create('Review');

      record.setReview(review);

      const found = await record.getReview();
      expect(found.id).toEqual(review.id);
    });

    test('belongsTo Assessment', async () => {
      let assessment = await factory.create('Assessment');

      record.setAssessment(assessment);

      const found = await record.getAssessment();
      expect(found.id).toEqual(assessment.id);
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
