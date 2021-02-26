import { User } from './user';
import { isString, isValidProvider } from './validators';

export default (sequelize, DataTypes) => {
  class Patient extends User {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const {
        Patient,
        Permission,
        Profile,
        Provider,
        Email,
        Address,
        Assessment,
        PatientAssessment,
        PatientAgreement,
        Agreement,
        DataPrint,
        Moment,
        Review,
        ReviewSubmission,
        PatientReview,
        Like,
        Clinician,
        PatientClinician,
      }: any = this.sequelize?.models;

      Patient.hasMany(Permission, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });

      Patient.hasMany(Provider, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });

      Patient.hasMany(Email, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });

      Patient.hasMany(Address, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });

      Patient.hasOne(Profile, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });

      Patient.hasMany(PatientAssessment, {
        foreignKey: 'patientId',
      });

      Patient.hasMany(PatientAgreement, {
        foreignKey: 'patientId',
      });

      Patient.belongsToMany(Review, {
        through: PatientReview,
        foreignKey: 'patientId',
        otherKey: 'reviewId',
      });

      Patient.hasMany(PatientReview, {
        foreignKey: 'patientId',
      });

      Patient.hasMany(DataPrint, {
        foreignKey: 'patientId',
      });

      Patient.hasMany(Moment, {
        foreignKey: 'patientId',
      });

      Patient.hasMany(ReviewSubmission, {
        foreignKey: 'patientId',
      });

      Patient.hasMany(Like, {
        foreignKey: 'patientId',
      });

      Patient.belongsToMany(Clinician, {
        constraints: false,
        through: PatientClinician,
        foreignKey: 'patientId',
      });
    }

    async addPermissions(keys) {
      return super.addPermissions(keys);
    }

    async setStandardPermissions() {
      const keys = [
        'agreement.list',
        'content.list',
        'moment.create',
        'moment.list',
        'moment.read',
        'patientAgreement.create',
        'patientAssessment.destroy',
        'patientAssessment.list',
        'patientReview.destroy',
        'patientReview.list',
        'patientReview.update',
        'review.list',
        'reviewSubmission.create',
      ];

      return this.addPermissions(keys);
    }
  }
  Patient.init(
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
      modelName: 'Patient',
      indexes: [
        {
          name: 'patient_provider_providerId',
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
  return Patient;
};
