import { factory } from '../utils';

describe('Model - DataPrint', () => {
  test('should create a dataPrint', async() => {
    const record = await factory.create('DataPrint', { thumbnailUri: '//example.org/scheme-relative/URIt' });
    expect(record.thumbnailUri).toEqual('//example.org/scheme-relative/URIt');
  });
  describe('Validations', () => {
    test('should require a valid patientId', async () => {
      const patient = await factory.create('Patient');
      await expect(factory.create('DataPrint', { patientId: null })).rejects.toThrow();
      await expect(factory.create('DataPrint', { patientId: false })).rejects.toThrow();
      await expect(factory.create('DataPrint', { patientId: true })).rejects.toThrow();
      await expect(factory.create('DataPrint', { patientId: 'randomstring' })).rejects.toThrow();
      await expect(factory.create('DataPrint', { patientId: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('DataPrint', { patientId: patient.id })).resolves.toBeDefined();
    });

    test('should require a valid svg', async () => {
      await expect(factory.create('DataPrint', { svg: null })).rejects.toThrow();
      await expect(factory.create('DataPrint', { svg: false })).rejects.toThrow();
      await expect(factory.create('DataPrint', { svg: true })).rejects.toThrow();
      await expect(factory.create('DataPrint', { svg: 123 })).rejects.toThrow();
      await expect(factory.create('DataPrint', { svg: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('DataPrint', { svg: 'path-to-svg' })).resolves.toBeDefined();
    });

    test('should require a valid thumbnailUri', async () => {
      await expect(factory.create('DataPrint', { thumbnailUri: null })).rejects.toThrow();
      await expect(factory.create('DataPrint', { thumbnailUri: false })).rejects.toThrow();
      await expect(factory.create('DataPrint', { thumbnailUri: true })).rejects.toThrow();
      await expect(factory.create('DataPrint', { thumbnailUri: 321 })).rejects.toThrow();
      await expect(factory.create('DataPrint', { thumbnailUri: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('DataPrint', { thumbnailUri: '//example.org/scheme-relative/URIt' })).resolves.toBeDefined();
    });

  });

  describe('Relationships', () => {
    let record;

    beforeAll(async () => {
      record = await factory.create('DataPrint');
    });

    test('belongsTo Patient', async () => {
      let patient = await factory.create('Patient');

      record.setPatient(patient);

      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });

  });
});
