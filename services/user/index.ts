import { difference, camelCase } from 'lodash';
import db from '../../models';

type CareTeamCode = {
  codeId: string | null;
  clinicianId: string | null;
};

export type UserServiceOptions = {
  provider: String;
  providerId: String;
  providerKey?: String;
  accessToken?: String;
  refreshToken?: String;
  permissions?: String[];
  name?: String;
  emails?: any[];
  avatarUri?: String;
  githubUser?: String;
  terms?: any[];
  careTeamCode?: CareTeamCode;
  hcProviderId?: String;
};

export class UserService {
  options: UserServiceOptions;
  include: any;
  user: any;
  created: boolean;
  terms: any;

  constructor(options: UserServiceOptions) {
    this.options = options;
    this.include = [db.Permission, db.Provider, db.Profile, db.Email];
    this.created = false;
    this.terms = options.terms;
  }

  async upsertUser() {
    const { include } = this;
    const { provider, providerId, accessToken, providerKey } = this.options;

    console.log('provider id == ', providerId);

    const preferredKey = providerKey || accessToken;

    const [user, created] = await this.model().findOrCreate({
      where: { providerId },
      defaults: {
        provider,
        providerKey: preferredKey,
      },
    });

    this.user = user;
    this.created = created;

    if (!this.isLocalProvider()) {
      if (user.providerKey !== preferredKey) {
        await user.update({ providerKey: preferredKey });
      }
    }

    await this.buildCompleteProfile();
    await this.user.reload({ include });

    return this.user;
  }

  async addPermissions() {
    const type = this.type();

    if (type === 'clinician' || type === 'patient') {
      await this.user.setStandardPermissions();
    }
  }

  async upsertProvider() {
    if (this.isLocalProvider()) {
      return;
    }

    const { user } = this;
    const { provider, providerId, accessToken } = this.options;

    const options = {
      providerId,
      accessToken,
    };

    let record = await db.Provider.findOne({
      where: { targetType: this.type(), targetId: user.id, provider },
    });

    if (record) {
      await record.update(options);
    } else {
      record = await db.Provider.create({
        targetType: this.type(),
        targetId: user.id,
        provider,
        ...options,
      });
    }

    return record;
  }

  async upsertProfile() {
    const { user } = this;
    const { name, avatarUri, githubUser } = this.options;

    let options: any = {};

    if (name) {
      options.name = name;
    }

    if (avatarUri) {
      options.avatarUri = avatarUri;
    }

    if (githubUser) {
      options.githubUser = githubUser;
    }

    let record = await db.Profile.findOne({
      where: { targetType: this.type(), targetId: user.id },
    });

    if (record) {
      await record.update(options);
    } else {
      record = await db.Profile.create({
        targetType: this.type(),
        targetId: user.id,
        ...options,
      });
    }

    return record;
  }

  getUserEmails() {
    const { user } = this;
    return db.Email.findAll({
      where: { targetType: this.type(), targetId: user.id },
    });
  }

  async upsertHCProviderClinician() {
    const { user } = this;
    const type = this.type();

    if (type !== 'clinician') {
      return;
    }

    const hcProvider = await db.HCProvider.findOne({
      where: { id: this.options.hcProviderId },
    });
    const options = {
      clinicianId: user.id,
      hcProviderId: hcProvider.dataValues.id,
    };
    await db.HCProviderClinician.create(options);
  }

  async upsertAgreements() {
    const { terms, user } = this;

    if (!terms || !terms.length) {
      return;
    }

    const type = this.type();

    const join =
      type === 'patient' ? db.PatientAgreement : db.ClinicianAgreement;
    const key = type === 'patient' ? 'patientId' : 'clinicianId';

    for (const item of terms) {
      if (item.id) {
        const agreement = await db.Agreement.findOne({
          where: { id: item.id },
        });

        if (agreement) {
          let options = {
            agreementId: item.id,
            agreed: true,
            agreedAt: item.agreedAt,
          };

          options[key] = user.id;

          await join.create(options);
        }
      }
    }
  }

  async upsertEmail() {
    if (!this.options.emails || !this.options.emails.length) {
      return;
    }

    const { user } = this;
    const { emails } = this.options;

    const existingRecords = await this.getUserEmails();
    const existingKeys = existingRecords.map((i) => i.email);
    const emailKeys = emails.map((i) => i.email);
    const newEmails = difference(emailKeys, existingKeys);

    if (newEmails.length) {
      const options = newEmails.map((e) => ({
        targetType: this.type(),
        targetId: user.id,
        email: e,
        primary: false,
      }));

      await db.Email.bulkCreate(options);

      const records = await this.getUserEmails();
      const hasPrimary = records.reduce((memo, item) => {
        if (item.primary === true) {
          memo = true;
        }

        return memo;
      }, false);

      if (!hasPrimary) {
        await records[0].update({ primary: true });
      }
    }
  }

  async upsertPatientClinician() {
    const { user } = this;
    const { careTeamCode } = this.options;
    const type = this.type();

    if (type !== 'patient' || !careTeamCode) {
      return;
    }
    const options = {
      patientId: user.id,
      clinicianId: careTeamCode.clinicianId,
    };

    await db.PatientClinician.create(options);
  }

  async updateCareTeamCode() {
    const { careTeamCode } = this.options;
    const type = this.type();

    if (type !== 'patient' || !careTeamCode) {
      return;
    }

    let record = await db.CareTeamCode.findOne({
      where: { id: careTeamCode.codeId },
    });

    const options = {
      usedOn: Date.now(),
    };

    if (record) {
      await record.update(options);
    }
  }

  async addPermanentAssessments() {
    const type = this.type();

    if (type !== 'patient') {
      return;
    }

    const permanentAssessment = await db.Assessment.findOne({
      where: { permanent: true },
    });

    if (!permanentAssessment) {
      return;
    }

    const patientId = this.user.id;
    const assessmentId = permanentAssessment.id;

    await db.PatientAssessment.create({
      patientId,
      assessmentId,
      completed: false,
      type: 'lotic',
    });
  }

  async buildCompleteProfile() {
    await this.addPermissions();
    await this.upsertProvider();
    await this.upsertProfile();
    await this.upsertEmail();
    await this.upsertAgreements();
    await this.upsertPatientClinician();
    await this.updateCareTeamCode();
    await this.upsertHCProviderClinician();
    // await this.addPermanentAssessments();
  }

  reload() {
    const { include } = this;
    return this.user.reload({
      include,
    });
  }

  type() {
    const model = this.model();
    const instance = new model();
    return camelCase(instance.constructor.name);
  }

  model() {
    let model;

    switch (this.options.provider) {
      case 'loticUser':
        model = db.LoticUser;
        break;
      case 'clinician':
        model = db.Clinician;
        break;
      default:
        model = db.Patient;
        break;
    }

    return model;
  }

  isLocalProvider() {
    return (
      ['patient', 'clinician', 'loticUser'].indexOf(
        this.options.provider as any
      ) > -1
    );
  }
}

export default UserService;
