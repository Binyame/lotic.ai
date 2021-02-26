import db from '../../models';
import { factory } from '../utils';

describe('Model - PatientReview', () => {
  test('should create a model', async () => {
    const record = await factory.create('PatientReview');
    expect(record).toBeDefined();
  });

  describe('Validations', () => {
    test('should require a valid patientId', async () => {
      const patient = await factory.create('Patient');

      await expect(
        factory.create('PatientReview', { patientId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { patientId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { patientId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { patientId: 'bad-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { patientId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('PatientReview', { patientId: patient.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid reviewId', async () => {
      const review = await factory.create('Review');

      await expect(
        factory.create('PatientReview', { reviewId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { reviewId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { reviewId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { reviewId: 'bad-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { reviewId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('PatientReview', { reviewId: review.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid type', async () => {
      await expect(
        factory.create('PatientReview', { type: null })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { type: false })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { type: true })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { type: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { type: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientReview', { type: 'Good Title' })
      ).rejects.toThrow();

      await expect(
        factory.create('PatientReview', { type: 'lotic' })
      ).resolves.toBeDefined();
      await expect(
        factory.create('PatientReview', { type: 'clinician' })
      ).resolves.toBeDefined();
    });

    test('should soft delete', async () => {
      const data = await factory.create('PatientReview');
      let id = data.dataValues.id;
      await data.destroy();

      const foundOne = await db.PatientReview.findOne({
        where: { id: id },
      });
      const foundTwo = await db.PatientReview.findOne({
        where: { id: id },
        paranoid: false,
      });

      expect(foundOne).toBeNull();
      expect(foundTwo.id).toEqual(id);
    });
  });

  describe('Relationships', () => {
    let patient, review, record;

    beforeAll(async () => {
      patient = await factory.create('Patient');
      review = await factory.create('Review');
      record = await factory.create('PatientReview', {
        patientId: patient.id,
        reviewId: review.id,
      });
    });

    test('belongsTo Patient', async () => {
      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });

    test('belongsTo Review', async () => {
      const found = await record.getReview();
      expect(found.id).toEqual(review.id);
    });
  });
});
