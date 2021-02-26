import { Model } from 'sequelize';
import { isString } from './validators';
export default (sequelize, DataTypes) => {
  class HCProvider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {
        HCProvider,
        HCProviderInvite,
        Clinician,
        HCProviderClinician,
      }: any = this.sequelize?.models;

      HCProvider.hasMany(HCProviderInvite, {
        foreignKey: 'providerId',
        constraints: true,
      });

      HCProvider.belongsToMany(Clinician, {
        through: HCProviderClinician,
        foreignKey: 'hcProviderId',
      });
    }
  }
  HCProvider.init(
    {
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
    },
    {
      sequelize,
      modelName: 'HCProvider',
    }
  );
  return HCProvider;
};
