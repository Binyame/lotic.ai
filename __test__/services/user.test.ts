import { get } from 'lodash';
import { db, factory } from '../utils';
import { UserService, UserServiceOptions } from '../../services/user';

describe('Services - UserService', () => {
  describe('new', () => {
    test('patient', async () => {
      const agreement = await factory.create('Agreement');
      const assessment = await factory.create('Assessment', {
        permanent: true,
      });
      const clinician = await factory.create('Clinician');

      const code = await factory.create('CareTeamCode', {
        clinicianId: clinician.id,
      });
      const careTeamCode = {
        codeId: code.id,
        clinicianId: clinician.id,
      };

      const options: UserServiceOptions = {
        provider: 'patient',
        providerId: 'sample-patient@example.com',
        providerKey: 'password1234',
        permissions: ['patient.list', 'patient.create'],
        name: 'Patient Sample',
        emails: [
          { email: 'test1@example.com', primary: true },
          { email: 'test2@example.com', primary: false },
          { email: 'test3@example.com', primary: false },
        ],
        avatarUri: 'https://img.example.com/1',
        terms: [{ id: agreement.id, agreedAt: new Date() }],
        careTeamCode,
      };

      const service = new UserService(options);

      await service.upsertUser();

      // Creates a patient
      const patients = await db.Patient.findAll({
        where: { providerId: options.providerId },
      });
      expect(patients.length).toEqual(1);
      const patient = patients[0];
      expect(patient.provider).toEqual('patient');
      expect(patient.providerId).toEqual(options.providerId);
      expect(patient.providerKey).not.toEqual(options.providerKey);

      // Does not create a provider
      const providers = await db.Provider.findAll({
        where: {
          targetType: 'patient',
          targetId: patient.id,
          providerId: options.providerId,
        },
      });
      expect(providers.length).toEqual(0);

      // Adds the right permissions
      const permissions = await patient.getPermissions();

      const permissionKeys = permissions.map((p) => p.key);
      expect(permissionKeys).toContain('patientAssessment.list');
      expect(permissionKeys).toContain('review.list');
      expect(permissionKeys).toContain('moment.list');
      expect(permissionKeys).toContain('moment.read');
      expect(permissionKeys).toContain('moment.create');
      expect(permissionKeys).toContain('reviewSubmission.create');

      // Creates a profile
      const profiles = await db.Profile.findAll({
        where: { targetType: 'patient', targetId: patient.id },
      });
      expect(profiles.length).toEqual(1);
      const profile = profiles[0];
      expect(profile.avatarUri).toEqual(options.avatarUri);
      expect(profile.name).toEqual(options.name);

      // Creates an email
      const emails = await db.Email.findAll({
        where: { targetType: 'patient', targetId: patient.id },
      });
      expect(emails.length).toEqual(3);
      const keys = emails.map((e) => e.email);
      expect(keys).toContain(get(options, 'emails.0.email'));
      expect(keys).toContain(get(options, 'emails.1.email'));
      expect(keys).toContain(get(options, 'emails.2.email'));

      // Creates a PatientAgreement
      const patientAgreements = await db.PatientAgreement.findAll({
        where: { patientId: patient.id },
      });
      expect(patientAgreements.length).toEqual(1);
      expect(patientAgreements[0].agreementId).toEqual(agreement.id);

      // Creates a PatientClinician
      const patientClinicians = await db.PatientClinician.findAll({
        where: { patientId: patient.id },
      });
      expect(patientClinicians.length).toEqual(1);
      expect(patientClinicians[0].clinicianId).toEqual(clinician.id);

      // Updates CareTeamCode with new usedOn date
      const careTeamCodes = await db.CareTeamCode.findAll({
        where: { id: code.id },
      });

      expect(careTeamCodes.length).toEqual(1);
      expect(careTeamCodes[0].usedOn).not.toEqual(code.usedOn);

      // Adds any permanent assessments
      const patientAssessments = await db.PatientAssessment.findAll({
        where: {
          patientId: patient.id,
        },
      });

      expect(patientAssessments.length).toEqual(1);
      expect(patientAssessments[0].id).toEqual(assessment.id);
    });

    test('clinician', async () => {
      const agreement = await factory.create('Agreement');

      const hcProvider = await factory.create('HCProvider');

      const options: UserServiceOptions = {
        provider: 'clinician',
        providerId: 'sample-clinician@example.com',
        providerKey: 'password1234',
        permissions: ['clinician.list', 'clinician.create'],
        name: 'Clinician Sample',
        emails: [
          { email: 'test1@example.com', primary: true },
          { email: 'test2@example.com', primary: false },
          { email: 'test3@example.com', primary: false },
        ],
        avatarUri: 'https://img.example.com/1',
        terms: [{ id: agreement.id, agreedAt: new Date() }],
        hcProviderId: hcProvider.id,
      };

      const service = new UserService(options);

      await service.upsertUser();

      // Creates a clinician
      const clinicians = await db.Clinician.findAll({
        where: { providerId: options.providerId },
      });
      expect(clinicians.length).toEqual(1);
      const clinician = clinicians[0];
      expect(clinician.provider).toEqual('clinician');
      expect(clinician.providerId).toEqual(options.providerId);
      expect(clinician.providerKey).not.toEqual(options.providerKey);

      // Does not create a provider
      const providers = await db.Provider.findAll({
        where: {
          targetType: 'clinician',
          targetId: clinician.id,
          providerId: options.providerId,
        },
      });
      expect(providers.length).toEqual(0);

      // Creates a profile
      const profiles = await db.Profile.findAll({
        where: { targetType: 'clinician', targetId: clinician.id },
      });
      expect(profiles.length).toEqual(1);
      const profile = profiles[0];
      expect(profile.avatarUri).toEqual(options.avatarUri);
      expect(profile.name).toEqual(options.name);

      // Creates a email
      const emails = await db.Email.findAll({
        where: { targetType: 'clinician', targetId: clinician.id },
      });
      expect(emails.length).toEqual(3);
      const keys = emails.map((e) => e.email);
      expect(keys).toContain(get(options, 'emails.0.email'));
      expect(keys).toContain(get(options, 'emails.1.email'));
      expect(keys).toContain(get(options, 'emails.2.email'));

      // Creates a ClinicianAgreement
      const clinicianAgreements = await db.ClinicianAgreement.findAll({
        where: { clinicianId: clinician.id },
      });
      expect(clinicianAgreements.length).toEqual(1);
      expect(clinicianAgreements[0].agreementId).toEqual(agreement.id);

      // Creates a hcProviderClinician
      const hcProviderClinicians = await db.HCProviderClinician.findAll({
        where: { hcProviderId: hcProvider.id },
      });
      expect(hcProviderClinicians.length).toEqual(1);
      expect(hcProviderClinicians[0].clinicianId).toEqual(clinician.id);
    });

    test('loticUser', async () => {
      const options: UserServiceOptions = {
        provider: 'loticUser',
        providerId: 'sample-loticuser@example.com',
        providerKey: 'password1234',
        permissions: ['loticUser.list', 'loticUser.create'],
        name: 'Lotic Sample',
        emails: [
          { email: 'test1@example.com', primary: true },
          { email: 'test2@example.com', primary: false },
          { email: 'test3@example.com', primary: false },
        ],
        avatarUri: 'https://img.example.com/1',
      };

      const service = new UserService(options);

      await service.upsertUser();

      // Creates a loticUser
      const loticUsers = await db.LoticUser.findAll({
        where: { providerId: options.providerId },
      });
      expect(loticUsers.length).toEqual(1);
      const loticUser = loticUsers[0];
      expect(loticUser.provider).toEqual('loticUser');
      expect(loticUser.providerId).toEqual(options.providerId);
      expect(loticUser.providerKey).not.toEqual(options.providerKey);

      // Does not create a provider
      const providers = await db.Provider.findAll({
        where: {
          targetType: 'loticUser',
          targetId: loticUser.id,
          providerId: options.providerId,
        },
      });
      expect(providers.length).toEqual(0);

      // Creates a profile
      const profiles = await db.Profile.findAll({
        where: { targetType: 'loticUser', targetId: loticUser.id },
      });
      expect(profiles.length).toEqual(1);
      const profile = profiles[0];
      expect(profile.avatarUri).toEqual(options.avatarUri);
      expect(profile.name).toEqual(options.name);

      // Creates a email
      const emails = await db.Email.findAll({
        where: { targetType: 'loticUser', targetId: loticUser.id },
      });
      expect(emails.length).toEqual(3);
      const keys = emails.map((e) => e.email);
      expect(keys).toContain(get(options, 'emails.0.email'));
      expect(keys).toContain(get(options, 'emails.1.email'));
      expect(keys).toContain(get(options, 'emails.2.email'));
    });

    test('social', async () => {
      const options: UserServiceOptions = {
        provider: 'github',
        providerId: '123456',
        accessToken: 'xxxxxxx1',
        refreshToken: 'rrrrrrr1',
        permissions: ['patient.list', 'patient.create'],
        name: 'User Service',
        emails: [
          { email: 'test1@example.com', primary: true },
          { email: 'test2@example.com', primary: false },
          { email: 'test3@example.com', primary: false },
        ],
        avatarUri: 'https://img.example.com/1',
        githubUser: 'ghuser1',
      };

      const service = new UserService(options);

      await service.upsertUser();

      // Creates a patient
      const patients = await db.Patient.findAll({
        where: { providerId: options.providerId },
      });
      expect(patients.length).toEqual(1);
      const patient = patients[0];
      expect(patient.provider).toEqual('github');
      expect(patient.providerId).toEqual(options.providerId);
      expect(patient.providerKey).toEqual(options.accessToken);

      // Creates a provider
      const providers = await db.Provider.findAll({
        where: {
          targetType: 'patient',
          targetId: patient.id,
          providerId: options.providerId,
        },
      });
      expect(providers.length).toEqual(1);
      const provider = providers[0];
      expect(provider.provider).toEqual('github');
      expect(provider.providerId).toEqual(options.providerId);
      expect(provider.accessToken).toEqual(options.accessToken);
      expect(provider.targetType).toEqual('patient');
      expect(provider.targetId).toEqual(patient.id);

      // Creates a profile
      const profiles = await db.Profile.findAll({
        where: { targetType: 'patient', targetId: patient.id },
      });
      expect(profiles.length).toEqual(1);
      const profile = profiles[0];
      expect(profile.avatarUri).toEqual(options.avatarUri);
      expect(profile.name).toEqual(options.name);
      expect(profile.githubUser).toEqual(options.githubUser);

      // Creates a email
      const emails = await db.Email.findAll({
        where: { targetType: 'patient', targetId: patient.id },
      });
      expect(emails.length).toEqual(3);
      const keys = emails.map((e) => e.email);
      expect(keys).toContain(get(options, 'emails.0.email'));
      expect(keys).toContain(get(options, 'emails.1.email'));
      expect(keys).toContain(get(options, 'emails.2.email'));
    });
  });

  describe('existing', () => {
    test('patient', async () => {
      const patient = await factory.create('Patient', {
        provider: 'patient',
        providerKey: 'oldkey',
      });

      const hcProvider = await factory.create('HCProvider');

      const opts = {
        targetType: 'patient',
        targetId: patient.id,
      };

      await factory.create('Profile', {
        ...opts,
        avatarUri: 'https://www.olduri.com',
        name: 'Old Name',
      });

      const email = await factory.create('Email', {
        ...opts,
        email: 'previous@example.com',
      });

      const options: UserServiceOptions = {
        provider: 'patient',
        providerId: patient.providerId,
        providerKey: 'newkey',
        permissions: ['patient.list', 'patient.create'],
        name: 'New Patient Name',
        emails: [{ email: 'test1@example.com', primary: true }],
        avatarUri: 'https://www.example.com/1.png',
        hcProviderId: hcProvider.id,
      };

      const service = new UserService(options);

      await service.upsertUser();

      const updated = await db.Patient.findByPk(patient.id, {
        include: [db.Profile, db.Provider, db.Email],
      });

      expect(updated.providerKey).not.toEqual(options.providerKey);
      await expect(updated.authenticate('oldkey')).resolves.toEqual(true);
      expect(updated.Providers.length).toEqual(0);
      expect(updated.Profile.name).toEqual(options.name);
      expect(updated.Profile.avatarUri).toEqual(options.avatarUri);
      expect(updated.Emails.length).toEqual(2);
      expect(updated.Emails.map((e) => e.email)).toContain(email.email);
      expect(updated.Emails.map((e) => e.email)).toContain(
        get(options, 'emails.0.email')
      );
    });

    test('clinician', async () => {
      const clinician = await factory.create('Clinician', {
        provider: 'clinician',
        providerKey: 'oldkey',
      });

      const hcProvider = await factory.create('HCProvider');

      const opts = {
        targetType: 'clinician',
        targetId: clinician.id,
      };

      await factory.create('Profile', {
        ...opts,
        avatarUri: 'https://www.olduri.com',
        name: 'Old Name',
      });

      const email = await factory.create('Email', {
        ...opts,
        email: 'previous@example.com',
      });

      const options: UserServiceOptions = {
        provider: 'clinician',
        providerId: clinician.providerId,
        providerKey: 'newkey',
        permissions: ['clinician.list', 'clinician.create'],
        name: 'New Clinician Name',
        emails: [{ email: 'test1@example.com', primary: true }],
        avatarUri: 'https://www.example.com/1.png',
        hcProviderId: hcProvider.id,
      };

      const service = new UserService(options);

      await service.upsertUser();

      const updated = await db.Clinician.findByPk(clinician.id, {
        include: [db.Profile, db.Provider, db.Email],
      });

      expect(updated.providerKey).not.toEqual(options.providerKey);
      await expect(updated.authenticate('oldkey')).resolves.toEqual(true);
      expect(updated.Providers.length).toEqual(0);
      expect(updated.Profile.name).toEqual(options.name);
      expect(updated.Profile.avatarUri).toEqual(options.avatarUri);
      expect(updated.Emails.length).toEqual(2);
      expect(updated.Emails.map((e) => e.email)).toContain(email.email);
      expect(updated.Emails.map((e) => e.email)).toContain(
        get(options, 'emails.0.email')
      );
    });

    test('loticUser', async () => {
      const loticUser = await factory.create('LoticUser', {
        provider: 'loticUser',
        providerKey: 'oldkey',
      });

      const opts = {
        targetType: 'loticUser',
        targetId: loticUser.id,
      };

      await factory.create('Profile', {
        ...opts,
        avatarUri: 'https://www.olduri.com',
        name: 'Old Name',
      });

      const email = await factory.create('Email', {
        ...opts,
        email: 'previous@example.com',
      });

      const options: UserServiceOptions = {
        provider: 'loticUser',
        providerId: loticUser.providerId,
        providerKey: 'newkey',
        permissions: ['loticUser.list', 'loticUser.create'],
        name: 'New LoticUser Name',
        emails: [{ email: 'test1@example.com', primary: true }],
        avatarUri: 'https://www.example.com/1.png',
      };

      const service = new UserService(options);

      await service.upsertUser();

      const updated = await db.LoticUser.findByPk(loticUser.id, {
        include: [db.Profile, db.Provider, db.Email],
      });

      expect(updated.providerKey).not.toEqual(options.providerKey);
      await expect(updated.authenticate('oldkey')).resolves.toEqual(true);
      expect(updated.Providers.length).toEqual(0);
      expect(updated.Profile.name).toEqual(options.name);
      expect(updated.Profile.avatarUri).toEqual(options.avatarUri);
      expect(updated.Emails.length).toEqual(2);
      expect(updated.Emails.map((e) => e.email)).toContain(email.email);
      expect(updated.Emails.map((e) => e.email)).toContain(
        get(options, 'emails.0.email')
      );
    });

    test('social', async () => {
      const patient = await factory.create('Patient', {
        provider: 'github',
        providerId: '1234567',
        providerKey: 'oldkey',
      });

      const opts = {
        targetType: 'patient',
        targetId: patient.id,
      };

      await factory.create('Profile', {
        ...opts,
        avatarUri: 'https://www.olduri.com',
        name: 'Old Name',
        githubUser: 'olduser',
      });

      await factory.create('Provider', {
        ...opts,
        provider: 'github',
        providerId: patient.providerId,
        accessToken: patient.providerKey,
      });

      const email = await factory.create('Email', {
        ...opts,
        email: 'previous@example.com',
      });

      const options: UserServiceOptions = {
        provider: 'github',
        providerId: patient.providerId,
        accessToken: 'xxxxxxx1',
        refreshToken: 'rrrrrrr1',
        permissions: ['user.list', 'user.create'],
        name: 'User Service',
        emails: [{ email: 'test1@example.com', primary: true }],
        avatarUri: 'https://www.example.com/1.png',
        githubUser: 'ghuser1',
      };

      const service = new UserService(options);

      await service.upsertUser();

      const updated = await db.Patient.findByPk(patient.id, {
        include: [db.Profile, db.Provider, db.Email],
      });

      expect(updated.providerKey).toEqual(options.accessToken);
      expect(updated.Providers.length).toEqual(1);
      expect(updated.Providers[0].accessToken).toEqual(options.accessToken);
      expect(updated.Profile.name).toEqual(options.name);
      expect(updated.Profile.avatarUri).toEqual(options.avatarUri);
      expect(updated.Profile.githubUser).toEqual(options.githubUser);
      expect(updated.Emails.length).toEqual(2);
      expect(updated.Emails.map((e) => e.email)).toContain(email.email);
      expect(updated.Emails.map((e) => e.email)).toContain(
        get(options, 'emails.0.email')
      );
    });
  });
});
