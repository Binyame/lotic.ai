// describe('something', () => {
//   test('test', () => {
//     expect(1).toEqual(1);
//   })
// })

import { factory, db, query, mutate } from '../utils';
import queueService from '../../services/queue';

const LIST = `
  query list {
    patients {
      id
    }
  }
`;

const READ = `
  query read($id: Int!) {
    patient(id: $id) {
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
      reviews {
        id
      }
      reviewSubmissions {
        id
      }
      clinicians {
        id
      }
      moments {
        uuid
      }
    }
  }
`;

const CREATE = `
  mutation create($patient: PatientCreate) {
    createPatient(patient: $patient) {
      id
    }
  }
`;

const UPDATE = `
  mutation update($patient: PatientUpdate) {
    updatePatient(patient: $patient) {
      id
      providerId
    }
  }
`;

const DESTROY = `
  mutation destroy($patient: PatientDestroy) {
    destroyPatient(patient: $patient) {
      id
    }
  }
`;

const INVITE_PATIENT = `
  mutation invite($patientName: String!, $deliveryAddress: String!) {
    invitePatient(patientName: $patientName, deliveryAddress: $deliveryAddress)
  }
`;

describe('Integration - Patient', () => {
  let record;
  let spy;

  beforeAll(async () => {
    record = await factory.create('Patient');
    const opts = { targetType: 'patient', targetId: record.id };
    await factory.create('Email', opts);
    await factory.create('Provider', opts);
    await factory.create('Profile', opts);
    await factory.create('Address', opts);

    const review = await factory.create('Review');
    await factory.create('PatientReview', {
      reviewId: review.id,
      patientId: record.id,
    });

    await factory.create('PatientClinician', { patientId: record.id });

    await factory.create('ReviewSubmission', {
      patientId: record.id,
    });

    await factory.create('Moment', {
      patientId: record.id,
    });

    await factory.create('Patient', opts);

    await factory.create('Patient');
    await factory.create('Patient');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    spy = null;
  });

  describe('Anonymous', () => {
    test('should NOT list', async () => {
      const res = await query(LIST);

      expect(res.body.data.patients).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id });

      expect(res.body.data.patient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Patient');
      const variables = {
        patient: attrs,
      };

      const res = await mutate(CREATE, variables);

      expect(res.body.data.createPatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT update', async () => {
      const variables = {
        patient: {
          id: record.id,
          providerId: 'updated-email@example.com',
        },
      };
      const res = await mutate(UPDATE, variables);

      expect(res.body.data.updatePatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Not authorized');
    });
    test('should NOT destroy', async () => {
      const variables = {
        patient: {
          id: record.id,
        },
      };
      const res = await mutate(DESTROY, variables);

      expect(res.body.data.destroyPatient).toBeNull();
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

      expect(res.body.data.patients).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Patient');
      const variables = {
        patient: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patient: {
          id: record.id,
          providerId: 'updated-email@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Patient');

      const variables = {
        patient: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.destroy');
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

      expect(res.body.data.patients).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Patient');
      const variables = {
        patient: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patient: {
          id: record.id,
          providerId: 'updated-email@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Patient');

      const variables = {
        patient: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.destroy');
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

      expect(res.body.data.patients).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.list');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.read');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Patient');
      const variables = {
        patient: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.create');
    });
    test('should NOT update', async () => {
      const variables = {
        patient: {
          id: record.id,
          providerId: 'updated-email@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.update');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Patient');

      const variables = {
        patient: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('patient.destroy');
    });
  });

  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'patient.list',
        'patient.read',
        'patient.create',
        'patient.update',
        'patient.destroy',
      ]);
      token = await usr.token();
    });

    test('should list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patients).toBeDefined();
      expect(res.body.data.patients.length).toBeDefined();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read', async () => {
      await record.addPermissions(['no-permission']);
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patient).toBeDefined();
      expect(res.body.data.patient.permissions.length).toBeGreaterThan(0);
      expect(res.body.data.patient.addresses.length).toBeGreaterThan(0);
      expect(res.body.data.patient.emails.length).toBeGreaterThan(0);
      expect(res.body.data.patient.providers.length).toBeGreaterThan(0);
      expect(res.body.data.patient.reviews.length).toBeGreaterThan(0);
      expect(res.body.data.patient.profile.id).toBeDefined();
      expect(res.body.data.patient.reviewSubmissions.length).toBeGreaterThan(0);
      expect(res.body.data.patient.clinicians.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should create', async () => {
      const attrs = await factory.attrs('Patient');
      const variables = {
        patient: attrs,
      };
      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatient).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Patient.findByPk(res.body.data.createPatient.id);
      expect(found).toBeDefined();
    });
    test('should update', async () => {
      const variables = {
        patient: {
          id: record.id,
          providerId: 'updated-email@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatient).toBeDefined();
      expect(res.body.data.updatePatient.providerId).toEqual(
        variables.patient.providerId
      );
      expect(res.body.errors).toBeUndefined();
    });
    test('should destroy', async () => {
      const patient = await factory.create('Patient');

      const variables = {
        patient: {
          id: patient.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatient).toBeDefined();
      expect(res.body.errors).toBeUndefined();

      const found = await db.Patient.findByPk(res.body.data.destroyPatient.id);
      expect(found).toBeNull();
    });
  });

  describe('Clinician: with Permissions', () => {
    let token, usr, patientClinician;

    beforeAll(async () => {
      usr = await factory.create('Clinician');
      await usr.addPermissions([
        'patient.list',
        'patient.read',
        'patient.create',
        'patient.update',
        'patient.destroy',
      ]);
      token = await usr.token();
    });
    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patients).toEqual([]);
      expect(res.body.errors).toBeUndefined();
    });
    test('should list my own', async () => {
      patientClinician = await factory.create('PatientClinician', {
        patientId: record.id,
        clinicianId: usr.id,
      });

      const res = await query(LIST, undefined, token);

      expect(res.body.data.patients).toBeDefined();
      expect(res.body.data.patients.length).toEqual(1);
      expect(res.body.data.patients[0].id).toEqual(patientClinician.patientId);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT read', async () => {
      const patientClinician = await db.PatientClinician.findOne({
        where: {
          patientId: record.id,
          clinicianId: usr.id,
        },
      });
      if (patientClinician) await patientClinician.destroy();

      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patient).toBeNull();
      expect(res.body.errors).toBeUndefined();
    });
    test('should read my own', async () => {
      await record.addPermissions(['no-permission']);
      patientClinician = await factory.create('PatientClinician', {
        patientId: record.id,
        clinicianId: usr.id,
      });
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patient).toBeDefined();
      expect(res.body.data.patient.id).toEqual(patientClinician.patientId);
      expect(res.body.data.patient.permissions.length).toBeGreaterThan(0);
      expect(res.body.data.patient.addresses.length).toBeGreaterThan(0);
      expect(res.body.data.patient.emails.length).toBeGreaterThan(0);
      expect(res.body.data.patient.providers.length).toBeGreaterThan(0);
      expect(res.body.data.patient.reviews.length).toBeGreaterThan(0);
      expect(res.body.data.patient.profile.id).toBeDefined();
      expect(res.body.data.patient.reviewSubmissions.length).toBeGreaterThan(0);
      expect(res.body.data.patient.clinicians.length).toBeGreaterThan(0);
      expect(res.body.data.patient.moments.length).toBeGreaterThan(0);
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Patient');
      const variables = {
        patient: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const patientClinician = await db.PatientClinician.findOne({
        where: {
          patientId: record.id,
          clinicianId: usr.id,
        },
      });
      if (patientClinician) await patientClinician.destroy();

      const variables = {
        patient: {
          id: record.id,
          providerId: 'updated-email@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch(
        'You can not modify this entry.'
      );
    });
    test('should update my own', async () => {
      await factory.create('PatientClinician', {
        patientId: record.id,
        clinicianId: usr.id,
      });

      const variables = {
        patient: {
          id: record.id,
          providerId: 'updated-email@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatient).toBeDefined();
      expect(res.body.data.updatePatient.providerId).toEqual(
        variables.patient.providerId
      );
      expect(res.body.errors).toBeUndefined();
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Patient');

      const variables = {
        patient: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatient).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should invitePatient', async () => {
      spy = jest
        .spyOn(queueService, 'addJob')
        .mockImplementationOnce(() => Promise.resolve());
      const variables = {
        patientName: 'Invite Patient 1',
        deliveryAddress: 'invite1@example.com',
      };

      const res = await mutate(INVITE_PATIENT, variables, token);

      expect(res.body.data.invitePatient).toEqual(`Patient invited.`);
      expect(res.body.errors).toBeUndefined();
      expect(queueService.addJob).toHaveBeenCalledTimes(1);
      expect(queueService.addJob).toHaveBeenCalledWith('patientInviteEmail', {
        clinicianId: usr.id,
        ...variables,
      });
    });
  });

  describe('Patient: with Permissions', () => {
    let token;
    let patient;

    beforeAll(async () => {
      patient = await factory.create('Patient');
      await patient.addPermissions([
        'patient.list',
        'patient.read',
        'patient.create',
        'patient.update',
        'patient.destroy',
      ]);
      token = await patient.token();
    });

    test('should NOT list', async () => {
      const res = await query(LIST, undefined, token);

      expect(res.body.data.patients).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT read', async () => {
      const res = await query(READ, { id: record.id }, token);

      expect(res.body.data.patient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT create', async () => {
      const attrs = await factory.attrs('Patient');
      const variables = {
        patient: attrs,
      };

      const res = await mutate(CREATE, variables, token);

      expect(res.body.data.createPatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT update', async () => {
      const variables = {
        patient: {
          id: record.id,
          providerId: 'updated-email@example.com',
        },
      };
      const res = await mutate(UPDATE, variables, token);

      expect(res.body.data.updatePatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT destroy', async () => {
      const destroy = await factory.create('Patient');

      const variables = {
        patient: {
          id: destroy.id,
        },
      };
      const res = await mutate(DESTROY, variables, token);

      expect(res.body.data.destroyPatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
    test('should NOT invitePatient', async () => {
      spy = jest
        .spyOn(queueService, 'addJob')
        .mockImplementationOnce(() => Promise.resolve());
      const variables = {
        patientName: 'Invite Patient 1',
        deliveryAddress: 'invite1@example.com',
      };

      const res = await mutate(INVITE_PATIENT, variables, token);

      expect(res.body.data.invitePatient).toBeNull();
      expect(res.body.errors).toBeDefined();
      expect(queueService.addJob).toHaveBeenCalledTimes(0);
      expect(res.body.errors[0].message).toMatch('Denied.');
    });
  });
});
