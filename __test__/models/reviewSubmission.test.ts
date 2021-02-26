import { factory } from '../utils';

describe('Model - ReviewSubmission', () => {
  test('should create a model', async () => {
    const record = await factory.create('ReviewSubmission', {
      body: { foo: 'bar' },
    });
    expect(record.body).toEqual({ foo: 'bar' });
  });

  describe('Validations', () => {
    test('should require a valid patientId', async () => {
      const patient = await factory.create('Patient');

      await expect(
        factory.create('ReviewSubmission', { patientId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { patientId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { patientId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { patientId: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { patientId: 'bad-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('ReviewSubmission', { patientId: patient.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid reviewId', async () => {
      const review = await factory.create('Review', { title: 'New Review' });

      await expect(
        factory.create('ReviewSubmission', { reviewId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { reviewId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { reviewId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { reviewId: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { reviewId: 'bad-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('ReviewSubmission', { reviewId: review.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid body', async () => {
      await expect(
        factory.create('ReviewSubmission', { body: null })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { body: false })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { body: true })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { body: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('ReviewSubmission', { body: 'bad-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('ReviewSubmission', { body: { foo: 'bar' } })
      ).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    let record;

    beforeAll(async () => {
      record = await factory.create('ReviewSubmission');
    });

    test('belongsTo Patient', async () => {
      let patient = await factory.create('Patient');

      record.setPatient(patient);

      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
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
