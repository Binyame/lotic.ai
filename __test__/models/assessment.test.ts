import { db, factory } from '../utils';

describe('Model - Assessment', () => {
  test('should create an assessment', async () => {
    const record = await factory.create('Assessment', { name: 'New Name' });
    expect(record.name).toEqual('New Name');
    expect(record.permanent).toEqual(false);
  });

  describe('Validations', () => {
    test('should require a valid name', async () => {
      await expect(
        factory.create('Assessment', { name: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { name: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { name: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { name: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { name: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Assessment', { title: 'Good Name' })
      ).resolves.toBeDefined();
    });

    test('should require a valid area', async () => {
      await expect(
        factory.create('Assessment', { area: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { area: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { area: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { area: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { name: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Assessment', { area: 'Good Area' })
      ).resolves.toBeDefined();
    });

    test('should require a valid subCategory', async () => {
      await expect(
        factory.create('Assessment', { subCategory: null })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { subCategory: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { subCategory: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { subCategory: 1234 })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { name: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Assessment', { subCategory: 'Good Subcategory' })
      ).resolves.toBeDefined();
    });

    test('should require a valid ownerId', async () => {
      const lotic = await factory.create('LoticUser');
      await expect(
        factory.create('Assessment', { ownerId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { ownerId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { ownerId: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { ownerId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Assessment', { ownerId: lotic.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid ownerType', async () => {
      await expect(
        factory.create('Assessment', { ownerType: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { ownerType: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { ownerType: 123 })
      ).rejects.toThrow();
      await expect(
        factory.create('Assessment', { ownerType: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Assessment', { ownerType: 'random-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('Assessment', { ownerType: 'clinician' })
      ).resolves.toBeDefined();
      await expect(
        factory.create('Assessment', { ownerType: 'lotic' })
      ).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    let assessment;

    beforeAll(async () => {
      assessment = await factory.create('Assessment');
    });

    test('hasMany PatientAssessment', async () => {
      const pa = await factory.create('PatientAssessment', {
        assessmentId: assessment.id,
      });

      const found = await assessment.getPatientAssessments();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(pa.id);
    });

    test('hasMany Moment', async () => {
      const record = await factory.create('Moment', {
        assessmentId: assessment.id,
      });

      const found = await assessment.getMoments();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('belongsToMany Prompts through AssessmentPrompt', async () => {
      const prompt = await factory.create('Prompt');

      await factory.create('AssessmentPrompt', {
        assessmentId: assessment.id,
        promptId: prompt.id,
      });

      const found = await assessment.getPrompts();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(prompt.id);
    });

    test('hasMany SignalQuestion', async () => {
      const record = await factory.create('SignalQuestion', {
        assessmentId: assessment.id,
      });

      const found = await assessment.getSignalQuestions();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('belongsTo Clinician', async () => {
      const clinician = await factory.create('Clinician');
      const assessment = await factory.create('Assessment', {
        ownerId: clinician.id,
        ownerType: 'clinician',
      });

      const found = await assessment.getClinician();

      expect(found).toBeDefined();
      expect(found.id).toEqual(clinician.id);
      expect(found).toBeInstanceOf(db.Clinician);
    });

    test('belongsTo LoticUser', async () => {
      const loticUser = await factory.create('LoticUser');
      const assessment = await factory.create('Assessment', {
        ownerId: loticUser.id,
        ownerType: 'lotic',
      });

      const found = await assessment.getLoticUser();

      expect(found).toBeDefined();
      expect(found.id).toEqual(loticUser.id);
      expect(found).toBeInstanceOf(db.LoticUser);
    });
  });
});
