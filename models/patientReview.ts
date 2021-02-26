import { Model } from 'sequelize';
import { isValidPatientAssessmentType } from './validators';

export default (sequelize, DataTypes) => {
  class PatientReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const { PatientReview, Patient, Review }: any = this.sequelize?.models;

      PatientReview.belongsTo(Patient, {
        foreignKey: 'patientId',
        targetKey: 'id',
        constraints: true,
      });

      PatientReview.belongsTo(Review, {
        foreignKey: 'reviewId',
        targetKey: 'id',
        constraints: true,
      });
    }
  }
  PatientReview.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isValidPatientAssessmentType,
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'PatientReview',
    }
  );
  return PatientReview;
};
