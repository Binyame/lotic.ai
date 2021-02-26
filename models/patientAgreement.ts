import { Model } from 'sequelize';
import { isDateCheck, isString } from './validators';

export default (sequelize, DataTypes) => {
  class PatientAgreement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {
        PatientAgreement,
        Patient,
        Agreement,
      }: any = this.sequelize?.models;

      PatientAgreement.belongsTo(Patient, {
        foreignKey: 'patientId',
        targetKey: 'id',
        constraints: false,
      });

      PatientAgreement.belongsTo(Agreement, {
        foreignKey: 'agreementId',
        targetKey: 'id',
        constraints: false,
      });
    }
  }
  PatientAgreement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
      agreementId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
      agreed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      agreedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDateCheck,
        },
      },
    },
    {
      sequelize,
      modelName: 'PatientAgreement',
      indexes: [
        {
          name: 'PatientAgreement_patientId_agreementId_key',
          unique: true,
          fields: ['patientId', 'agreementId'],
        },
      ],
    }
  );
  return PatientAgreement;
};
