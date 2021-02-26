import { Model } from 'sequelize';
import { isValidUserType } from './validators';

export default (sequelize, DataTypes) => {
  class Email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const { Email, Patient, Clinician }: any = this.sequelize?.models;

      Email.belongsTo(Patient, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });

      Email.belongsTo(Clinician, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'clinician',
        },
      });
    }
  }
  Email.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      primary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Email',
      indexes: [
        {
          name: 'email_targetType_targetId_email',
          unique: true,
          fields: ['targetType', 'targetId', 'email'],
        },
      ],
    }
  );
  return Email;
};
