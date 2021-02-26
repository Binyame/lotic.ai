import { factory, query } from '../utils';
import db from '../../models';

describe('Model - Like', () => {
  test('should create a content', async () => {
    const record = await factory.create('Content', { title: 'New Title' });
    expect(record.title).toEqual('New Title');
  });

  describe('Validations', () => {
    test('should require a valid patientId', async () => {
      const patient = await factory.create('Patient');
      await expect(
        factory.create('Like', { patientId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Like', { patientId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Like', { patientId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Like', { patientId: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('Like', { patientId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Like', { patientId: patient.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid contentId', async () => {
      const content = await factory.create('Content');
      await expect(
        factory.create('Like', { contentId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Like', { contentId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Like', { contentId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Like', { contentId: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('Like', { contentId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Like', { contentId: content.id })
      ).resolves.toBeDefined();
    });

    test('should soft delete', async () => {
      const data = await factory.create('Like', { name: 'Asd' });
      let id = data.dataValues.id;
      await data.destroy();

      const foundOne = await db.Like.findOne({
        where: { id: id },
      });
      const foundTwo = await db.Like.findOne({
        where: { id: id },
        paranoid: false,
      });

      expect(foundOne).toBeNull();
      expect(foundTwo.id).toEqual(id);
    });
  });

  describe('Relationships', () => {
    let patient, content, record;

    beforeAll(async () => {
      patient = await factory.create('Patient');
      content = await factory.create('Content');
      record = await factory.create('Like', {
        patientId: patient.id,
        contentId: content.id,
      });
    });

    test('belongsTo Patient', async () => {
      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });

    test('belongsTo Content', async () => {
      const found = await record.getContent();
      expect(found.id).toEqual(content.id);
    });
  });
});
