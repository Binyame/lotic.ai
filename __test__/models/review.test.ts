import { db, factory } from '../utils';

describe('Model - Review', () => {
  test('should create a model', async() => {
    const record = await factory.create('Review', { title: 'New Review' });
    expect(record.title).toEqual('New Review');
  });

  describe('Validations', () => {
    
    test('should require a valid title', async () => {
      await expect(factory.create('Review', { title: null })).rejects.toThrow();
      await expect(factory.create('Review', { title: false })).rejects.toThrow();
      await expect(factory.create('Review', { title: true })).rejects.toThrow();
      await expect(factory.create('Review', { title: 1234 })).rejects.toThrow();

      await expect(factory.create('Review', { title: 'good-string' })).resolves.toBeDefined();
    });

    test('should require a valid ownerId', async () => {
      const lotic = await factory.create('LoticUser');
      await expect(
        factory.create('Review', { ownerId: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Review', { ownerId: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Review', { ownerId: 'random-string' })
      ).rejects.toThrow();
      await expect(
        factory.create('Review', { ownerId: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Review', { ownerId: lotic.id })
      ).resolves.toBeDefined();
    });

    test('should require a valid ownerType', async () => {
      await expect(
        factory.create('Review', { ownerType: false })
      ).rejects.toThrow();
      await expect(
        factory.create('Review', { ownerType: true })
      ).rejects.toThrow();
      await expect(
        factory.create('Review', { ownerType: 123 })
      ).rejects.toThrow();
      await expect(
        factory.create('Review', { ownerType: { foo: 'bar' } })
      ).rejects.toThrow();

      await expect(
        factory.create('Review', { ownerType: 'random-string' })
      ).rejects.toThrow();

      await expect(
        factory.create('Review', { ownerType: 'clinician' })
      ).resolves.toBeDefined();
      await expect(
        factory.create('Review', { ownerType: 'lotic' })
      ).resolves.toBeDefined();
    });
    
  });
  
  describe('Relationships', () => {
    let review;

    beforeAll(async () => {
      review = await factory.create('Review');
    });

    test('hasMany SignalQuestion', async () => {
      const record = await factory.create('SignalQuestion', {
        reviewId: review.id
      });

      const found = await review.getSignalQuestions();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('belongsToMany Patient through PatientReview', async () => {
      const patient = await factory.create('Patient');

      await factory.create('PatientReview', {
        patientId: patient.id,
        reviewId: review.id
      });

      const found = await review.getPatients();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(patient.id);
    });

    test('belongsTo Clinician', async () => {
      const clinician = await factory.create('Clinician');
      const review = await factory.create('Review', {
        ownerId: clinician.id,
        ownerType: 'clinician',
      });

      const found = await review.getClinician();

      expect(found).toBeDefined();
      expect(found.id).toEqual(clinician.id);
      expect(found).toBeInstanceOf(db.Clinician);
    });

    test('belongsTo LoticUser', async () => {
      const loticUser = await factory.create('LoticUser');
      const review = await factory.create('Review', {
        ownerId: loticUser.id,
        ownerType: 'lotic',
      });

      const found = await review.getLoticUser();

      expect(found).toBeDefined();
      expect(found.id).toEqual(loticUser.id);
      expect(found).toBeInstanceOf(db.LoticUser);
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