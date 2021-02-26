import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const { Like, Patient, Content }: any = this.sequelize?.models;

      Like.belongsTo(Patient, {
        foreignKey: 'patientId',
        targetKey: 'id',
        constraints: false,
      });

      Like.belongsTo(Content, {
        foreignKey: 'contentId',
        targetKey: 'id',
        constraints: false,
      });
    }
  }
  Like.init(
    {
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
      contentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'Like',
      indexes: [
        {
          name: 'Like_patientId_contentId_key',
          unique: true,
          fields: ['patientId', 'contentId'],
        },
      ],
    }
  );
  return Like;
};
