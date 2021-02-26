import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AssessmentPrompt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {
        AssessmentPrompt,
        Assessment,
        Prompt,
      }: any = this.sequelize?.models;

      AssessmentPrompt.belongsTo(Assessment, {
        foreignKey: 'assessmentId',
        targetKey: 'id',
        constraints: false,
      });

      AssessmentPrompt.belongsTo(Prompt, {
        foreignKey: 'promptId',
        targetKey: 'id',
        constraints: false,
      });
    }
  }
  AssessmentPrompt.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      assessmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
      promptId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
    },
    {
      sequelize,
      modelName: 'AssessmentPrompt',
      indexes: [
        {
          name: 'AssessmentPrompt_assessmentId_promptId_key',
          unique: true,
          fields: ['assessmentId', 'promptId'],
        },
      ],
    }
  );
  return AssessmentPrompt;
};
