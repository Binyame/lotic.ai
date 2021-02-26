import { Model } from 'sequelize';
import { isValidPatientAssessmentType } from './validators';

export default (sequelize, DataTypes) => {
  class PatientAssessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const {
        PatientAssessment,
        Patient,
        Assessment,
      }: any = this.sequelize?.models;

      PatientAssessment.belongsTo(Patient, {
        foreignKey: 'patientId',
        targetKey: 'id',
        constraints: false,
      });

      PatientAssessment.belongsTo(Assessment, {
        foreignKey: 'assessmentId',
        targetKey: 'id',
        constraints: false,
      });
    }
  }
  PatientAssessment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
      assessmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isValidPatientAssessmentType,
        },
      },
      bookmarked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'PatientAssessment',
    }
  );
  return PatientAssessment;
};
