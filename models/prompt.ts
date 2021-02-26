import { Model } from 'sequelize';
import { isNumber, isString } from './validators';

export default (sequelize, DataTypes) => {
  class Prompt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const {
        Prompt,
        Assessment,
        AssessmentPrompt,
        MomentPrompt,
      }: any = this.sequelize?.models;

      Prompt.belongsToMany(Assessment, {
        through: AssessmentPrompt,
        foreignKey: 'promptId',
        otherKey: 'assessmentId',
      });

      Prompt.hasMany(MomentPrompt, {
        foreignKey: 'promptId',
      });
    }
  }
  Prompt.init(
    {
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      durationMs: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumber,
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
    },
    {
      sequelize,
      modelName: 'Prompt',
    }
  );
  return Prompt;
};
