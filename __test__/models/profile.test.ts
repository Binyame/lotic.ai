import { factory } from '../utils';

describe('Model - Profile', () => {
  test('should create a model', async() => {
    const record = await factory.create('Profile', { avatarUri: 'https://www.example.com' });
    expect(record.avatarUri).toEqual('https://www.example.com');
  });

  describe('Validations', () => {
    
    test('should require a valid targetType', async () => {
      await expect(factory.create('Profile', { targetType: null })).rejects.toThrow();
      await expect(factory.create('Profile', { targetType: false })).rejects.toThrow();
      await expect(factory.create('Profile', { targetType: true })).rejects.toThrow();
      await expect(factory.create('Profile', { targetType: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('Profile', { targetType: 'notavalidtype' })).rejects.toThrow();

      await expect(factory.create('Profile', { targetType: 'patient' })).resolves.toBeDefined();
      await expect(factory.create('Profile', { targetType: 'clinician' })).resolves.toBeDefined();
    });
    
    test('should require a valid targetId', async () => {
      const patient = await factory.create('Patient');
      await expect(factory.create('Profile', { targetId: null })).rejects.toThrow();
      await expect(factory.create('Profile', { targetId: false })).rejects.toThrow();
      await expect(factory.create('Profile', { targetId: true })).rejects.toThrow();
      await expect(factory.create('Profile', { targetId: patient.id })).resolves.toBeDefined();
    });

    test('should reject invalid avatarUri', async () => {
      await expect(factory.create('Profile', { avatarUri: 1 })).rejects.toThrow();
      await expect(factory.create('Profile', { avatarUri: false })).rejects.toThrow();
      await expect(factory.create('Profile', { avatarUri: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('Profile', { avatarUri: 'test@example.com' })).rejects.toThrow();

      await expect(factory.create('Profile', { avatarUri: 'https://www.example.com/image.png' })).resolves.toBeDefined();
    });

    test('should reject invalid lat', async () => {
      await expect(factory.create('Profile', { lat: false })).rejects.toThrow();
      await expect(factory.create('Profile', { lat: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('Profile', { lat: 'test@example.com' })).rejects.toThrow();
      await expect(factory.create('Profile', { lat: 'https://www.example.com/image.png' })).rejects.toThrow();

      await expect(factory.create('Profile', { lat: 1123 })).resolves.toBeDefined();
    });

    test('should reject invalid lng', async () => {
      await expect(factory.create('Profile', { lng: false })).rejects.toThrow();
      await expect(factory.create('Profile', { lng: { foo: 'bar' } })).rejects.toThrow();
      await expect(factory.create('Profile', { lng: 'test@example.com' })).rejects.toThrow();
      await expect(factory.create('Profile', { lng: 'https://www.example.com/image.png' })).rejects.toThrow();
      
      await expect(factory.create('Profile', { lng: 1123 })).resolves.toBeDefined();
    });

    test('should reject invalid shortDescription', async () => {
      await expect(factory.create('Profile', { shortDescription: 1 })).rejects.toThrow('string');
      await expect(factory.create('Profile', { shortDescription: false })).rejects.toThrow('string');
      await expect(factory.create('Profile', { shortDescription: { foo: 'bar' } })).rejects.toThrow('string');

      await expect(factory.create('Profile', { shortDescription: 'sample content' })).resolves.toBeDefined();
    });

    test('should reject invalid longDescription', async () => {
      await expect(factory.create('Profile', { longDescription: 1 })).rejects.toThrow('string');
      await expect(factory.create('Profile', { longDescription: false })).rejects.toThrow('string');
      await expect(factory.create('Profile', { longDescription: { foo: 'bar' } })).rejects.toThrow('string');
      
      await expect(factory.create('Profile', { longDescription: 'sample content' })).resolves.toBeDefined();
    });

    test('should reject invalid title', async () => {
      await expect(factory.create('Profile', { title: 1 })).rejects.toThrow('string');
      await expect(factory.create('Profile', { title: false })).rejects.toThrow('string');
      await expect(factory.create('Profile', { title: { foo: 'bar' } })).rejects.toThrow('string');
      
      await expect(factory.create('Profile', { title: 'sample content' })).resolves.toBeDefined();
    });

    test('should reject invalid name', async () => {
      await expect(factory.create('Profile', { name: 1 })).rejects.toThrow('string');
      await expect(factory.create('Profile', { name: false })).rejects.toThrow('string');
      await expect(factory.create('Profile', { name: { foo: 'bar' } })).rejects.toThrow('string');
      
      await expect(factory.create('Profile', { name: 'sample content' })).resolves.toBeDefined();
    });

    test('should reject invalid githubUser', async () => {
      await expect(factory.create('Profile', { githubUser: 1 })).rejects.toThrow('string');
      await expect(factory.create('Profile', { githubUser: false })).rejects.toThrow('string');
      await expect(factory.create('Profile', { githubUser: { foo: 'bar' } })).rejects.toThrow('string');
      
      await expect(factory.create('Profile', { githubUser: 'sample content' })).resolves.toBeDefined();
    });
  });
  
  describe('Relationships', () => {
    test('belongsTo Patient', async () => {
      const patient = await factory.create('Patient');
      const record = await factory.create('Profile');

      await record.setPatient(patient);

      const found = await record.getPatient();
      expect(found.id).toEqual(patient.id);
    });
    test('belongsTo Clinician', async () => {
      const clinician = await factory.create('Clinician');
      const record = await factory.create('Profile');

      await record.setClinician(clinician);

      const found = await record.getClinician();
      expect(found.id).toEqual(clinician.id);
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