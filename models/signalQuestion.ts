import { Model } from 'sequelize';
import { isString, isJSON } from './validators';

function isValidSignalType(value) {
  if (['boolean', 'scale'].indexOf(value) < 0) {
    throw new Error('Invalid type');
  }
}

export default (sequelize, DataTypes) => {
  class SignalQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const {
        SignalQuestion,
        Review,
        Assessment,
      }: any = this.sequelize?.models;

      SignalQuestion.belongsTo(Review, {
        foreignKey: 'reviewId',
      });

      SignalQuestion.belongsTo(Assessment, {
        foreignKey: 'assessmentId',
      });
    }
  }
  SignalQuestion.init(
    {
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assessmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidSignalType,
        },
      },
      trigger: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'SignalQuestion',
    }
  );
  return SignalQuestion;
};
