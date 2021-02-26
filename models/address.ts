import { Model } from 'sequelize';
import clinician from '../graphql/resolvers/clinician';
import { isString, isValidUserType } from './validators';

export default (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const { Patient, Clinician, Address }: any = this.sequelize?.models;

      Address.belongsTo(Patient, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });

      Address.belongsTo(Clinician, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'clinician',
        },
      });
    }
  }
  Address.init(
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
      country: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      region: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      locality: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      postalCode: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      address1: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      address2: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      address3: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      address4: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      primary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Address',
    }
  );
  return Address;
};
