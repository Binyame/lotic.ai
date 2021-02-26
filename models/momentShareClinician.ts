import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class MomentShareClinician extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {
        MomentShareClinician,
        Clinician,
        MomentShare,
      }: any = this.sequelize?.models;

      MomentShareClinician.belongsTo(MomentShare, {
        foreignKey: 'momentShareId',
        targetKey: 'id',
        constraints: false,
      });

      MomentShareClinician.belongsTo(Clinician, {
        foreignKey: 'clinicianId',
        targetKey: 'id',
        constraints: false,
      });
    }
  }
  MomentShareClinician.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      momentShareId: {
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
      modelName: 'MomentShareClinician',
      indexes: [
        {
          name: 'MomentShareClinician_momentShareId_clinicianId_key',
          unique: true,
          fields: ['momentShareId', 'clinicianId'],
        },
      ],
    }
  );
  return MomentShareClinician;
};
