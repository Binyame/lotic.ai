import moment from '../../models/moment';
import { factory } from '../utils';

describe('Model - Moment', () => {
  test('should create a moment', async () => {
    const record = await factory.create('Moment', { type: 'video' });
    expect(record.type).toEqual('video');
  });
  describe('Validations', () => {
    test('should require a valid uuid', async () => {
      await expect(factory.create('Moment', { uuid: null })).rejects.toThrow();
      await expect(factory.create('Moment', { uuid: false })).rejects.toThrow();
      await expect(factory.create('Moment', { uuid: true })).rejects.toThrow();
      await expect(factory.create('Moment', { uuid: 123 })).rejects.toThrow();
      await expect(
        factory.create('Moment', { uuid: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Moment', {
          uuid: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
        })
      ).resolves.toBeDefined();
    });

    test('should require a valid type', async () => {
      await expect(factory.create('Moment', { type: null })).rejects.toThrow();
      await expect(factory.create('Moment', { type: false })).rejects.toThrow();
      await expect(factory.create('Moment', { type: true })).rejects.toThrow();
      await expect(factory.create('Moment', { type: 123 })).rejects.toThrow();
      await expect(
        factory.create('Moment', { type: { foo: 'bar' } })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { type: 'type' })
      ).rejects.toThrow();

      await expect(
        factory.create('Moment', { type: 'audio' })
      ).resolves.toBeDefined();
      await expect(
        factory.create('Moment', { type: 'video' })
      ).resolves.toBeDefined();
    });

    test('should require a valid patientId', async () => {
      const patient = await factory.create('Patient');
      await expect(
        factory.create('Moment', { patientId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { patientId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { patientId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { patientId: '123' })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { patientId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Moment', { patientId: patient.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid assessmentId', async () => {
      const assessment = await factory.create('Assessment');

      await expect(
        factory.create('Moment', { assessmentId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { assessmentId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { assessmentId: '123' })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { assessmentId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Moment', { assessmentId: assessment.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid durationMs', async () => {
      await expect(
        factory.create('Moment', { durationMs: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { durationMs: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { durationMs: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { durationMs: '123' })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { durationMs: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Moment', { durationMs: 222 })
      ).resolves.toBeDefined();
    });

    test('should require a valid uri', async () => {
      await expect(factory.create('Moment', { uri: null })).rejects.toThrow();
      await expect(factory.create('Moment', { uri: false })).rejects.toThrow();
      await expect(factory.create('Moment', { uri: true })).rejects.toThrow();
      await expect(factory.create('Moment', { uri: 123 })).rejects.toThrow();
      await expect(
        factory.create('Moment', { uri: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Moment', { uri: 'uri' })
      ).resolves.toBeDefined();
    });

    test('should require a valid mimeType', async () => {
      await expect(
        factory.create('Moment', { mimeType: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { mimeType: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { mimeType: 123 })
      ).rejects.toThrow();
      await expect(
        factory.create('Moment', { mimeType: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Moment', { mimeType: null })
      ).resolves.toBeDefined();
      await expect(
        factory.create('Moment', { mimeType: 'image/jpg' })
      ).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    let record;

    beforeAll(async () => {
      record = await factory.create('Moment');
    });

    test('belongsTo Assessment', async () => {
      let assessment = await factory.create('Assessment');

      record.setAssessment(assessment);

      const found = await record.getAssessment();
      expect(found.id).toEqual(assessment.id);
    });

    test('belongsTo Patient', async () => {
      let patient = await factory.create('Patient');

      record.setPatient(patient);

      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });

    test('hasMany MomentPrompt', async () => {
      const momentPrompt = await factory.create('MomentPrompt', {
        momentUuid: record.uuid,
      });

      const found = await record.getMomentPrompts();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(momentPrompt.id);
    });
  });
});
