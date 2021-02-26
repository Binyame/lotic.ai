import { factory } from '../utils';

describe('Model - HCProvider', () => {
  test('should create a hcprovider', async() => {
    const record = await factory.create('HCProvider', { name: 'Example' });
    expect(record.name).toEqual('Example');
  });
  describe('Validations', () => {
    test('should require a valid name', async () => {
      await expect(factory.create('HCProvider', { name: null })).rejects.toThrow();
      await expect(factory.create('HCProvider', { name: false })).rejects.toThrow();
      await expect(factory.create('HCProvider', { name: true })).rejects.toThrow();
      await expect(factory.create('HCProvider', { name: 123 })).rejects.toThrow();
      await expect(factory.create('HCProvider', { name: { foo: 'bar' } })).rejects.toThrow();

      await expect(factory.create('HCProvider', { name: 'Name' })).resolves.toBeDefined();
    });
  });

  describe('Relationships', () => {
    let hcProvider, clinician, clinicians;

    beforeAll(async () => {
      clinician = await factory.create('Clinician');
      clinicians = JSON.stringify([clinician.toJSON()]);
      hcProvider = await factory.create('HCProvider');
    });

    test('hasMany HCProviderInvite', async () => {
      const record = await factory.create('HCProviderInvite', {
        clinicians: clinicians,
        providerId: hcProvider.id,
      });

      const found = await hcProvider.getHCProviderInvites();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(record.id);
    });

    test('belongsToMany Clinician through HCProviderClinician', async () => {
      const hcProvider = await factory.create('HCProvider');
      const clinician = await factory.create('Clinician');

      await factory.create('HCProviderClinician', {
        hcProviderId: hcProvider.id,
        clinicianId: clinician.id
      });

      const found = await hcProvider.getClinicians();

      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(clinician.id);
    });
  });
});
