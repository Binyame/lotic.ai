import { Model } from 'sequelize';
import { isURL, isString, isValidUserType } from './validators';

export default (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const { Profile, Patient, Clinician }: any = this.sequelize?.models;

      Profile.belongsTo(Patient, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });

      Profile.belongsTo(Clinician, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'clinician',
        },
      });
    }
  }
  Profile.init(
    {
      targetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      targetType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidUserType,
        },
      },
      avatarUri: {
        type: DataTypes.STRING,
        validate: {
          isURL,
        },
      },
      lat: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
        },
      },
      lng: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
        },
      },
      shortDescription: {
        type: DataTypes.TEXT,
        validate: {
          isString,
        },
      },
      longDescription: {
        type: DataTypes.TEXT,
        validate: {
          isString,
        },
      },
      title: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
      githubUser: {
        type: DataTypes.STRING,
        validate: {
          isString,
        },
      },
    },
    {
      sequelize,
      modelName: 'Profile',
    }
  );
  return Profile;
};
