import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class HCProviderClinician extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {
        HCProviderClinician,
        Clinician,
        HCProvider,
      }: any = this.sequelize?.models;

      HCProviderClinician.belongsTo(HCProvider, {
        foreignKey: 'hcProviderId',
        targetKey: 'id',
      });

      HCProviderClinician.belongsTo(Clinician, {
        foreignKey: 'clinicianId',
        targetKey: 'id',
      });
    }
  }
  HCProviderClinician.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      hcProviderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      clinicianId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'HCProviderClinician',
      indexes: [
        {
          name: 'HCProviderClinician_hcProviderId_clinicianId_key',
          unique: true,
          fields: ['hcProviderId', 'clinicianId'],
        },
      ],
    }
  );
  return HCProviderClinician;
};
