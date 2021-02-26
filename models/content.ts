import { Model } from 'sequelize';
import { isString, isURL } from './validators';

export default (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Content.init(
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      content: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          isString,
        },
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      sourceUri: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isString,
          isURL,
        },
      },
      thumbnailUri: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isString,
          isURL,
        },
      },
      source: {
        allowNull: true,
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      author: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      area: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      tags: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      preview: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
    },
    {
      sequelize,
      modelName: 'Content',
    }
  );
  return Content;
};
