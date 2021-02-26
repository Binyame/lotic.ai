import { Model } from 'sequelize';
import { isString, isValidAgreementContent } from './validators';

export default (sequelize, DataTypes) => {
  class Agreement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {
        Agreement,
        PatientAgreement,
        ClinicianAgreement,
      }: any = this.sequelize?.models;

      Agreement.hasMany(PatientAgreement, {
        foreignKey: 'agreementId',
      });

      Agreement.hasMany(ClinicianAgreement, {
        foreignKey: 'agreementId',
      });
    }
  }
  Agreement.init(
    {
      type: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          isString,
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      name: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          isString,
        },
      },
      key: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          isString,
        },
      },
      version: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          isString,
        },
      },
      content: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          isString,
          // isValidAgreementContent,
        },
      },
    },
    {
      sequelize,
      modelName: 'Agreement',
    }
  );
  return Agreement;
};
