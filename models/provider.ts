import { Model } from 'sequelize';
import { isString, isValidProvider, isValidUserType } from './validators';

export default (sequelize, DataTypes) => {
  class Provider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const { Provider, Patient, Clinician }: any = this.sequelize?.models;

      Provider.belongsTo(Patient, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });

      Provider.belongsTo(Clinician, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'clinician',
        },
      });
    }
  }
  Provider.init(
    {
      targetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      targetType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidUserType,
        },
      },
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
      accessToken: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isString,
        },
      },
    },
    {
      sequelize,
      modelName: 'Provider',
      indexes: [
        {
          name: 'provider_targetType_targetId_provider_providerId',
          unique: true,
          fields: ['targetType', 'targetId', 'provider', 'providerId'],
        },
      ],
    }
  );
  return Provider;
};
