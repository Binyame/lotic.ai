import { Model } from 'sequelize';
import { isString } from './validators';
export default (sequelize, DataTypes) => {
  class DataPrint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      const { Patient, DataPrint }: any = this.sequelize?.models;

      DataPrint.belongsTo(Patient, {
        foreignKey: 'patientId',
        targetKey: 'id',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });
    }
  }
  DataPrint.init(
    {
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      svg: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
      thumbnailUri: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
    },
    {
      sequelize,
      modelName: 'DataPrint',
      indexes: [
        {
          name: 'DataPrint_patientId_key',
          unique: true,
          fields: ['patientId'],
        },
      ],
    }
  );
  return DataPrint;
};
