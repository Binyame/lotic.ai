import { factory } from '../utils';

describe('Model - Prompt', () => {
  test('should create a prompt', async() => {
    const record = await factory.create('Prompt');
  });
  describe('Validations', () => {
    test('requires a valid order', async () => {
      await expect(factory.create('Prompt', { order: null })).rejects.toThrow();
      await expect(factory.create('Prompt', { order: false })).rejects.toThrow();
      await expect(factory.create('Prompt', { order: true })).rejects.toThrow();
      await expect(factory.create('Prompt', { order: 'random-string' })).rejects.toThrow();
      await expect(factory.create('Prompt', { order: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('Prompt', { order: 1234 })).resolves.toBeDefined();
    });

    test('should require a valid durationMs', async () => {
      await expect(factory.create('Prompt', { durationMs: null })).rejects.toThrow();
      await expect(factory.create('Prompt', { durationMs: false })).rejects.toThrow();
      await expect(factory.create('Prompt', { durationMs: true })).rejects.toThrow();
      await expect(factory.create('Prompt', { durationMs: '123' })).rejects.toThrow();
      await expect(factory.create('Prompt', { durationMs: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('Prompt', { durationMs: 10 })).resolves.toBeDefined();
    });

    test('should require a valid content', async () => {
      await expect(factory.create('Prompt', { content: null })).rejects.toThrow();
      await expect(factory.create('Prompt', { content: false })).rejects.toThrow();
      await expect(factory.create('Prompt', { content: true })).rejects.toThrow();
      await expect(factory.create('Prompt', { content: 1234 })).rejects.toThrow();
      await expect(factory.create('Prompt', { content: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('Prompt', { content: 'Good' })).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    let prompt;

    beforeAll(async () => {
      prompt = await factory.create('Prompt');
    });

    test('belongsToMany Assessment through AssessmentPrompt', async () => {
      const assessment = await factory.create('Assessment');

      await factory.create('AssessmentPrompt', {
        assessmentId: assessment.id,
        promptId: prompt.id
      });

      const found = await prompt.getAssessments();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(assessment.id);
    });

    test('hasMany MomentPrompt', async () => {
      const mp = await factory.create('MomentPrompt', {
        promptId: prompt.id
      });

      const found = await prompt.getMomentPrompts();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(mp.id);
    });
  });
});
