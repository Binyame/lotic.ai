import { Model } from 'sequelize';
import Hashids from 'hashids/cjs';

import {
  isDateCheck,
  isString,
  isValidCodeDeliveryMethod,
  isValidEmailOrPhoneNumber,
} from './validators';
export default (sequelize, DataTypes) => {
  class CareTeamCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Clinician, CareTeamCode }: any = this.sequelize?.models;

      CareTeamCode.belongsTo(Clinician, {
        foreignKey: 'clinicianId',
      });
    }
  }
  CareTeamCode.init(
    {
      clinicianId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isString,
        },
      },
      patientName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isString,
        },
      },
      method: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidCodeDeliveryMethod,
        },
      },
      deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidEmailOrPhoneNumber,
        },
      },
      expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDateCheck,
        },
      },
      usedOn: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDateCheck,
        },
      },
    },
    {
      sequelize,
      modelName: 'CareTeamCode',
      hooks: {
        beforeValidate: async (instance) => {
          const hashids = new Hashids(instance.get('patientName' as any), 6);
          const unixDate = new Date().getTime();
          const code = hashids.encode(parseInt(unixDate.toString().slice(-6)));
          instance.set('code' as any, code);
        },
      },
    }
  );
  return CareTeamCode;
};
