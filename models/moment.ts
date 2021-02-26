import { Model, fn } from 'sequelize';
import { isNumber, isString, isValidMomentType } from './validators';
export default (sequelize, DataTypes) => {
  class Moment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const {
        Assessment,
        Patient,
        Moment,
        MomentPrompt,
      }: any = this.sequelize?.models;

      Moment.belongsTo(Patient, {
        foreignKey: 'patientId',
      });

      Moment.belongsTo(Assessment, {
        foreignKey: 'assessmentId',
      });

      Moment.hasMany(MomentPrompt, {
        foreignKey: 'momentUuid',
      });
    }
  }
  Moment.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isValidMomentType,
        },
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumber,
        },
      },
      assessmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isNumber,
        },
      },
      durationMs: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumber,
        },
      },
      uri: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
      mimeType: {
        type: DataTypes.TEXT,
        validate: {
          isString,
        },
      },
    },
    {
      sequelize,
      modelName: 'Moment',
    }
  );
  return Moment;
};
