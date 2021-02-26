import { factory, query } from '../utils';
import db from '../../models';

describe('Model - PatientAssessment', () => {
  test('should create an assessment', async () => {
    const record = await factory.create('Assessment', { name: 'New Name' });
    expect(record.name).toEqual('New Name');
  });

  describe('Validations', () => {
    test('should require a valid patientId', async () => {
      const patient = await factory.create('Patient');
      await expect(
        factory.create('PatientAssessment', { patientId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { patientId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { patientId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { patientId: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { patientId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('PatientAssessment', { patientId: patient.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid assessmentId', async () => {
      const assessment = await factory.create('Assessment');
      await expect(
        factory.create('PatientAssessment', { assessmentId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { assessmentId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { assessmentId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { assessmentId: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { assessmentId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('PatientAssessment', { assessmentId: assessment.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid completed', async () => {
      await expect(
        factory.create('PatientAssessment', { completed: null })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { completed: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { completed: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { completed: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('PatientAssessment', { completed: false })
      ).resolves.toBeDefined();
      await expect(
        factory.create('PatientAssessment', { completed: true })
      ).resolves.toBeDefined();
    });

    test('completed defaultsTo false', async () => {
      const patientAssessment = await factory.create('PatientAssessment');
      await expect(patientAssessment.completed).toEqual(false);
    });

    test('should require a valid type', async () => {
      await expect(
        factory.create('PatientAssessment', { type: null })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { type: false })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { type: true })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { type: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { type: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientAssessment', { type: 'Good Title' })
      ).rejects.toThrow();

      await expect(
        factory.create('PatientAssessment', { type: 'lotic' })
      ).resolves.toBeDefined();
      await expect(
        factory.create('PatientAssessment', { type: 'clinician' })
      ).resolves.toBeDefined();
    });

    test('should soft delete', async () => {
      const data = await factory.create('PatientAssessment', { name: 'Asd' });
      let id = data.dataValues.id;
      await data.destroy();

      const foundOne = await db.PatientAssessment.findOne({
        where: { id: id },
      });
      const foundTwo = await db.PatientAssessment.findOne({
        where: { id: id },
        paranoid: false,
      });

      expect(foundOne).toBeNull();
      expect(foundTwo.id).toEqual(id);
    });
  });

  test('should require a valid bookmarked', async () => {
    await expect(
      factory.create('PatientAssessment', { bookmarked: 1234 })
    ).rejects.toThrow();
    await expect(
      factory.create('PatientAssessment', { bookmarked: { foo: 'bar' } })
    ).rejects.toThrow();
    await expect(
      factory.create('PatientAssessment', { bookmarked: 'random-string' })
    ).rejects.toThrow();

    await expect(
      factory.create('PatientAssessment', { bookmarked: false })
    ).resolves.toBeDefined();
    await expect(
      factory.create('PatientAssessment', { bookmarked: true })
    ).resolves.toBeDefined();
  });

  describe('Relationships', () => {
    let patient, assessment, record;

    beforeAll(async () => {
      patient = await factory.create('Patient');
      assessment = await factory.create('Assessment');
      record = await factory.create('PatientAssessment', {
        patientId: patient.id,
        assessmentId: assessment.id,
      });
    });

    test('belongsTo Patient', async () => {
      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });

    test('belongsTo Assessment', async () => {
      const found = await record.getAssessment();
      expect(found.id).toEqual(assessment.id);
    });
  });
});
