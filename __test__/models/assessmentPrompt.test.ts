import { factory } from '../utils';

describe('Model - AssessmentPrompt', () => {
  test('should create an a assessment prompt', async() => {
    const record = await factory.create('AssessmentPrompt');
    expect(record).toBeDefined();
  });

  describe('Validations', () => {
    test('requires a valid assessmentId', async () => {
      const assessment = await factory.create('Assessment');
      await expect(factory.create('AssessmentPrompt', { assessmentId: null })).rejects.toThrow();
      await expect(factory.create('AssessmentPrompt', { assessmentId: false })).rejects.toThrow();
      await expect(factory.create('AssessmentPrompt', { assessmentId: true })).rejects.toThrow();
      await expect(factory.create('AssessmentPrompt', { assessmentId: 'random-string' })).rejects.toThrow();
      await expect(factory.create('AssessmentPrompt', { assessmentId: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('AssessmentPrompt', { assessmentId: assessment.id })).resolves.toBeDefined();
    });

    test('requires a valid promptId', async () => {
      const prompt = await factory.create('Prompt');
      await expect(factory.create('AssessmentPrompt', { promptId: null })).rejects.toThrow();
      await expect(factory.create('AssessmentPrompt', { promptId: false })).rejects.toThrow();
      await expect(factory.create('AssessmentPrompt', { promptId: true })).rejects.toThrow();
      await expect(factory.create('AssessmentPrompt', { promptId: 'random-string' })).rejects.toThrow();
      await expect(factory.create('AssessmentPrompt', { promptId: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('AssessmentPrompt', { promptId: prompt.id })).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    test('belongsTo Assessment', async () => {
      const assessment = await factory.create('Assessment');
      const record = await factory.create('AssessmentPrompt');

      await record.setAssessment(assessment);

      const found = await record.getAssessment();
      expect(found.id).toEqual(assessment.id);
    });

    test('belongsTo Prompt', async () => {
      const prompt = await factory.create('Prompt');
      const record = await factory.create('AssessmentPrompt');

      await record.setPrompt(prompt);

      const found = await record.getPrompt();
      expect(found.id).toEqual(prompt.id);
    });
  });
});
