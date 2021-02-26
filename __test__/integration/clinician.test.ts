import { factory, db, query, mutate } from '../utils';

const LIST = `
  query list {
    clinicians {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    clinician(id: $id) {
      id
      permissions {
        id
      }
      addresses {
        id
      }
      emails {
        id
      }
      primaryEmail {
        id
      }
      profile {
        id
      }
      providers {
        id
      }
      clinicianAgreements {
        id
      }
      momentShares {
        id
      }
      patients {
        id
      }
      HCProviders {
        id
      }
    }
  }
`;

const CREATE = `
  mutation create($clinician: ClinicianCreate) {
    createClinician(clinician: $clinician) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($clinician: ClinicianUpdate) {
    updateClinician(clinician: $clinician) {
      id
      providerId
    }
  }
`;

const DESTROY = `
  mutation destroy($clinician: ClinicianDestroy) {
    destroyClinician(clinician: $clinician) {
      id
    }
  }
`;

const ADD_MOMENT_SHARE = `
  mutation add($clinicianId: Int, $momentShareId: Int) {
    addMomentShare(clinicianId: $clinicianId, momentShareId: $momentShareId) {
      id
    }
  }
`;

const ADD_PATIENT = `
  mutation add($clinicianId: Int, $patientId: Int) {
    addPatient(clinicianId: $clinicianId, patientId: $patientId) {
      id
    }
  }
`;

const ADD_HC_PROVIDER = `
  mutation add($clinicianId: Int, $hcProviderId: Int) {
    addHCProvider(clinicianId: $clinicianId, hcProviderId: $hcProviderId) {
      id
    }
  }
`;

describe('Integration - Clinician', () => {
  let record;

  beforeAll(async () => {
    record = await factory.create('Clinician');
    const opts = { targetType: 'clinician', targetId: record.id };
    await factory.create('Email', opts);
    await factory.create('Provider', opts);
    await factory.create('Profile', opts);
    await factory.create('Address', opts);
    await factory.create('ClinicianAgreement', { clinicianId: record.id });
    await factory.create('MomentShareClinician', { clinicianId: record.id });
    await factory.create('PatientClinician', { clinicianId: record.id });
    await factory.create('HCProviderClinician', { clinicianId: record.id });
    await record.addPermissions(['no-permission']);

    await factory.create('Clinician');
    await factory.create('Clinician');
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.clinicians).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.clinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Clinician');
      const variables = {
        clinician: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        clinician: {
          id: record.id,
          providerId: 'updated@example.com',
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updateClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Clinician');

      const variables = {
        clinician: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
  });
  describe('LoticUser: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.clinicians).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Clinician');
      const variables = {
        clinician: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.create');
    });
    test('should NOT update', async () => {
      const variables = {
        clinician: {
          id: record.id,
          providerId: 'updated@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Clinician');

      const variables = {
        clinician: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.destroy');
    });
  });
  describe('Clinician: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.clinicians).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Clinician');
      const variables = {
        clinician: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.create');
    });
    test('should NOT update', async () => {
      const variables = {
        clinician: {
          id: record.id,
          providerId: 'updated@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Clinician');

      const variables = {
        clinician: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.destroy');
    });
  });
  describe('Patient: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      token = await usr.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.clinicians).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Clinician');
      const variables = {
        clinician: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.create');
    });
    test('should NOT update', async () => {
      const variables = {
        clinician: {
          id: record.id,
          providerId: 'updated@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Clinician');

      const variables = {
        clinician: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinician).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('clinician.destroy');
    });
  });
  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'clinician.list',
        'clinician.read',
        'clinician.create',
        'clinician.update',
        'clinician.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.clinicians).toBeDefined();
      expect(res.body.data.clinicians.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinician).toBeDefined();
      expect(res.body.data.clinician.id).toEqual(record.id);
      expect(
        res.body.data.clinician.clinicianAgreements.length
      ).toBeGreaterThan(0);
      expect(res.body.data.clinician.permissions.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.addresses.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.emails.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.providers.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.momentShares.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.patients.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.profile.id).toBeDefined();
      expect(res.body.data.clinician.HCProviders.length).toEqual(0);

      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Clinician');
      const variables = {
        clinician: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinician).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Clinician.findByPk(
        res.body.data.createClinician.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        clinician: {
          id: record.id,
          providerId: 'updated@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinician).toBeDefined();
      expect(res.body.data.updateClinician.providerId).toEqual(
        'updated@example.com'
      );
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Clinician');

      const variables = {
        clinician: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinician).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Clinician.findByPk(
        res.body.data.destroyClinician.id
      );
      expect(found).toBeNull();
    });
    test('should add momentShare', async () => {
      const clinician = await factory.create('Clinician');
      const momentShare = await factory.create('MomentShare');

      const variables = {
        clinicianId: clinician.id,
        momentShareId: momentShare.id,
      };
      const res = await mutate(ADD_MOMENT_SHARE, variables, token);

      expect(res.body.data.addMomentShare).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await clinician.getMomentShares();
      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(momentShare.id);
     });
    test('should add patient', async () => {
      const clinician = await factory.create('Clinician');
      const patient = await factory.create('Patient');

      const variables = {
        clinicianId: clinician.id,
        patientId: patient.id,
      };
      const res = await mutate(ADD_PATIENT, variables, token);

      expect(res.body.data.addPatient).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await clinician.getPatients();
      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(patient.id);
    });
    test('should add hcProvider', async () => {
      const clinician = await factory.create('Clinician');
      const hcProvider = await factory.create('HCProvider');

      const variables = {
        clinicianId: clinician.id,
        hcProviderId: hcProvider.id,
      };
      const res = await mutate(ADD_HC_PROVIDER, variables, token);

      expect(res.body.data.addHCProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await clinician.getHCProviders();
      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(hcProvider.id);
    });
  });
  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = record;
      await usr.addPermissions([
        'clinician.list',
        'clinician.read',
        'clinician.create',
        'clinician.update',
        'clinician.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.clinicians).toBeDefined();
      expect(res.body.data.clinicians.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinician).toBeDefined();
      expect(res.body.data.clinician.id).toEqual(record.id);
      expect(res.body.data.clinician.permissions.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.addresses.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.emails.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.providers.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.profile.id).toBeDefined();
      expect(res.body.data.clinician.momentShares.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.patients.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.HCProviders.length).toBeGreaterThan(0);
      expect(
        res.body.data.clinician.clinicianAgreements.length
      ).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Clinician');
      const variables = {
        clinician: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinician).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Clinician.findByPk(
        res.body.data.createClinician.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        clinician: {
          id: record.id,
          providerId: 'updated@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinician).toBeDefined();
      expect(res.body.data.updateClinician.providerId).toEqual(
        'updated@example.com'
      );
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Clinician');

      const variables = {
        clinician: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinician).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Clinician.findByPk(
        res.body.data.destroyClinician.id
      );
      expect(found).toBeNull();
    });
    test('should add momentShare', async () => {
      const clinician = await factory.create('Clinician');
      const momentShare = await factory.create('MomentShare');

      const variables = {
        clinicianId: clinician.id,
        momentShareId: momentShare.id,
      };
      const res = await mutate(ADD_MOMENT_SHARE, variables, token);

      expect(res.body.data.addMomentShare).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await clinician.getMomentShares();
      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(momentShare.id);
      });

    test('should add patient', async () => {
      const clinician = await factory.create('Clinician');
      const patient = await factory.create('Patient');

      const variables = {
        clinicianId: clinician.id,
        patientId: patient.id,
      };
      const res = await mutate(ADD_PATIENT, variables, token);

      expect(res.body.data.addPatient).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await clinician.getPatients();
      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(patient.id);
    });
    test('should add hcProvider', async () => {
      const clinician = await factory.create('Clinician');
      const hcProvider = await factory.create('HCProvider');

      const variables = {
        clinicianId: clinician.id,
        hcProviderId: hcProvider.id,
      };
      const res = await mutate(ADD_HC_PROVIDER, variables, token);

      expect(res.body.data.addHCProvider).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await clinician.getHCProviders();
      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(hcProvider.id);
    });
  });
  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      await usr.addPermissions([
        'clinician.list',
        'clinician.read',
        'clinician.create',
        'clinician.update',
        'clinician.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.clinicians).toBeDefined();
      expect(res.body.data.clinicians.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.clinician).toBeDefined();
      expect(res.body.data.clinician.id).toEqual(record.id);
      expect(res.body.data.clinician.permissions.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.addresses.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.emails.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.providers.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.profile.id).toBeDefined();
      expect(res.body.data.clinician.momentShares.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.patients.length).toBeGreaterThan(0);
      expect(res.body.data.clinician.HCProviders.length).toEqual(0);
      expect(
        res.body.data.clinician.clinicianAgreements.length
      ).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Clinician');
      const variables = {
        clinician: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createClinician).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Clinician.findByPk(
        res.body.data.createClinician.id
      );
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        clinician: {
          id: record.id,
          providerId: 'updated@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updateClinician).toBeDefined();
      expect(res.body.data.updateClinician.providerId).toEqual(
        'updated@example.com'
      );
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const destroy = await factory.create('Clinician');

      const variables = {
        clinician: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyClinician).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Clinician.findByPk(
        res.body.data.destroyClinician.id
      );
      expect(found).toBeNull();
    });
    test('should add momentShare', async () => {
      const clinician = await factory.create('Clinician');
      const momentShare = await factory.create('MomentShare');

      const variables = {
        clinicianId: clinician.id,
        momentShareId: momentShare.id,
      };
      const res = await mutate(ADD_MOMENT_SHARE, variables, token);

      expect(res.body.data.addMomentShare).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await clinician.getMomentShares();
      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(momentShare.id);
      });

    test('should add patient', async () => {
      const clinician = await factory.create('Clinician');
      const patient = await factory.create('Patient');

      const variables = {
        clinicianId: clinician.id,
        patientId: patient.id,
      };
      const res = await mutate(ADD_PATIENT, variables, token);

      expect(res.body.data.addPatient).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await clinician.getPatients();
      expect(found.length).toEqual(1);
      expect(found[0].id).toEqual(patient.id);
    });
    test('should NOT add hcProvider', async () => {
      const clinician = await factory.create('Clinician');
      const hcProvider = await factory.create('HCProvider');

      const variables = {
        clinicianId: clinician.id,
        hcProviderId: hcProvider.id,
      };
      const res = await mutate(ADD_HC_PROVIDER, variables, token);

      expect(res.body.data.addHCProvider).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
  });
});
