import { User } from './user';
import { isString, isValidProvider } from './validators';

export default (sequelize, DataTypes) => {
  class Clinician extends User {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const {
        Clinician,
        Permission,
        Profile,
        Provider,
        Email,
        Address,
        ClinicianAgreement,
        MomentShare,
        MomentShareClinician,
        Patient,
        PatientClinician,
        HCProvider,
        HCProviderClinician,
        CareTeamCode,
      }: any = this.sequelize?.models;

      Clinician.hasMany(Permission, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'clinician',
        },
      });

      Clinician.hasMany(Provider, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'clinician',
        },
      });

      Clinician.hasMany(Email, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'clinician',
        },
      });

      Clinician.hasMany(Address, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'clinician',
        },
      });

      Clinician.hasOne(Profile, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'clinician',
        },
      });

      Clinician.hasMany(ClinicianAgreement, {
        foreignKey: 'clinicianId',
      });

      Clinician.belongsToMany(MomentShare, {
        constraints: false,
        through: MomentShareClinician,
        foreignKey: 'clinicianId',
      });

      Clinician.belongsToMany(Patient, {
        constraints: false,
        through: PatientClinician,
        foreignKey: 'clinicianId',
      });
      Clinician.belongsToMany(HCProvider, {
        through: HCProviderClinician,
        foreignKey: 'clinicianId',
      });

      Clinician.hasMany(CareTeamCode, {
        foreignKey: 'clinicianId',
      });
    }

    async addPermissions(keys) {
      return super.addPermissions(keys);
    }

    async setStandardPermissions() {
      const keys = [
        'assessment.create',
        'assessment.list',
        'assessment.read',
        'assessment.update',
        'moment.read',
        'patient.create',
        'patient.list',
        'patient.read',
        'patient.update',
        'patientAssessment.create',
        'patientReview.create',
        'patientReview.list',
        'review.create',
        'review.list',
        'review.read',
        'review.update',
        'reviewSubmission.read',
      ];

      return this.addPermissions(keys);
    }
  }
  Clinician.init(
    {
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidProvider,
        },
      },
      providerId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isString,
        },
      },
      providerKey: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isString,
        },
      },
    },
    {
      sequelize,
      modelName: 'Clinician',
      indexes: [
        {
          name: 'clinician_provider_providerId',
          unique: true,
          fields: ['provider', 'providerId'],
        },
      ],
      hooks: {
        async beforeCreate(instance: any) {
          await instance.hashPassword(instance);
        },
        async beforeUpdate(instance: any) {
          await instance.hashPassword(instance);
        },
      },
    }
  );
  return Clinician;
};
