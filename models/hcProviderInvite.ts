import { Model } from 'sequelize';
import { isString, isValidClinicians } from './validators';

export default (sequelize, DataTypes) => {
  class HCProviderInvite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { HCProviderInvite, HCProvider }: any = this.sequelize?.models;

      HCProviderInvite.belongsTo(HCProvider, {
        foreignKey: 'providerId',
        constraints: false,
      });
    }
  }
  HCProviderInvite.init(
    {
      code: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      providerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      clinicians: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          isValidClinicians,
        },
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'HCProviderInvite',
      indexes: [
        {
          name: 'HCProviderInvite_providerId_key',
          unique: true,
          fields: ['providerId'],
        },
      ],
    }
  );
  return HCProviderInvite;
};
