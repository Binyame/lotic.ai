import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class MomentPrompt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const { MomentPrompt, Prompt, Moment }: any = this.sequelize?.models;

      MomentPrompt.belongsTo(Prompt, {
        foreignKey: 'promptId',
      });

      MomentPrompt.belongsTo(Moment, {
        foreignKey: 'momentUuid',
      });
    }
  }
  MomentPrompt.init(
    {
      momentUuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      promptId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startTimeMs: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      endTimeMs: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'MomentPrompt',
    }
  );
  return MomentPrompt;
};
