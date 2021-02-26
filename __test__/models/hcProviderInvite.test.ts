import { factory } from '../utils';

describe('Model - HCProviderInvite', () => {
  let clinician, clinicians;

  beforeAll(async () => {
    clinician = await factory.create('Clinician');
    clinicians = JSON.stringify([clinician.toJSON()]);
  });

  test('should create a HCProviderInvite', async() => {
    const record = await factory.create('HCProviderInvite', { code: 'Example', clinicians });
    expect(record.code).toEqual('Example');
  });
  describe('Validations', () => {

    test('requires a valid code', async () => {
      await expect(factory.create('HCProviderInvite', { code: null, clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { code: false, clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { code: true, clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { code: 123, clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { code: { foo: 'bar' }, clinicians })).rejects.toThrow();

      await expect(factory.create('HCProviderInvite', { code: 'Name', clinicians })).resolves.toBeDefined();
    });

    test('requires a valid active', async () => {
      await expect(factory.create('HCProviderInvite', { active: null, clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { active: 1234, clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { active: 'random-string', clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { active: { foo: 'bar' }, clinicians })).rejects.toThrow();

      await expect(factory.create('HCProviderInvite', { active: false, clinicians })).resolves.toBeDefined();
      await expect(factory.create('HCProviderInvite', { active: true, clinicians })).resolves.toBeDefined();
    });

    test('active defaultsTo true', async () => {
      const hcProviderInvite = await factory.create('HCProviderInvite', {
        clinicians
      });
      await expect(hcProviderInvite.active).toEqual(true);
    });

    test('requires a valid providerId', async () => {
      const hcProvider = await factory.create('HCProvider');
      await expect(factory.create('HCProviderInvite', { providerId: null, clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { providerId: false, clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { providerId: true, clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { providerId: 'random-string', clinicians })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { providerId: { foo: 'bar' }, clinicians })).rejects.toThrow();

      await expect(factory.create('HCProviderInvite', { providerId: hcProvider.id, clinicians })).resolves.toBeDefined();
    });

    test('requires a valid clinicians', async () => {
      await expect(factory.create('HCProviderInvite', { clinicians: null })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { clinicians: false })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { clinicians: true })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { clinicians: 'random-string' })).rejects.toThrow();
      await expect(factory.create('HCProviderInvite', { clinicians: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('HCProviderInvite', { clinicians })).resolves.toBeDefined();
    });

    describe('Relationships', () => {
      test('belongsTo HCProvider', async () => {
        const hcProvider = await factory.create('HCProvider');
        const record = await factory.create('HCProviderInvite', {
          clinicians
        });

        await record.setHCProvider(hcProvider);

        const found = await record.getHCProvider();
        expect(found.id).toEqual(hcProvider.id);
      });
    });
  });
});
