import { factory } from '../utils';

describe('Model - PatientClinician', () => {
  test('should create an a patient clinician', async () => {
    const record = await factory.create('PatientClinician');
    expect(record).toBeDefined();
  });

  describe('Validations', () => {
    test('requires a valid patientId', async () => {
      const patient = await factory.create('Patient');
      await expect(
        factory.create('PatientClinician', { patientId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientClinician', { patientId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientClinician', { patientId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientClinician', { patientId: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientClinician', { patientId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('PatientClinician', { patientId: patient.id })
      ).resolves.toBeDefined();
    });

    test('requires a valid clinicianId', async () => {
      const clinician = await factory.create('Clinician');
      await expect(
        factory.create('PatientClinician', { clinicianId: null })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientClinician', { clinicianId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientClinician', { clinicianId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientClinician', { clinicianId: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('PatientClinician', { clinicianId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('PatientClinician', { clinicianId: clinician.id })
      ).resolves.toBeDefined();
    });
  });
});
