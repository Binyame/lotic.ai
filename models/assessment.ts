import { Model } from 'sequelize';
import { isString, isValidOwnerType } from './validators';

export default (sequelize, DataTypes) => {
  class Assessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const {
        Assessment,
        Clinician,
        PatientAssessment,
        Prompt,
        AssessmentPrompt,
        Moment,
        SignalQuestion,
        LoticUser,
      }: any = this.sequelize?.models;

      Assessment.hasMany(PatientAssessment, {
        foreignKey: 'assessmentId',
      });

      Assessment.belongsToMany(Prompt, {
        through: AssessmentPrompt,
        foreignKey: 'assessmentId',
        otherKey: 'promptId',
      });

      Assessment.hasMany(Moment, {
        foreignKey: 'assessmentId',
        constraints: false,
      });

      Assessment.hasMany(SignalQuestion, {
        foreignKey: 'assessmentId',
      });

      Assessment.belongsTo(Clinician, {
        foreignKey: 'ownerId',
        constraints: false,
      });

      Assessment.belongsTo(LoticUser, {
        foreignKey: 'ownerId',
        constraints: false,
      });
    }
  }
  Assessment.init(
    {
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
      area: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
      subCategory: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
      hashTag: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isString,
        },
      },
      permanent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      ownerType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidOwnerType,
        },
      },
    },
    {
      sequelize,
      modelName: 'Assessment',
    }
  );
  return Assessment;
};
