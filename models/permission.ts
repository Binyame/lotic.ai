import { Model } from 'sequelize';
import { includes, camelCase } from 'lodash';
import { isValidUserType } from './validators';

export default (sequelize, DataTypes) => {
  class Permission extends Model {
    validKeys: string[];

    constructor(args) {
      super(args);

      this.validKeys = ['no-permission'];
      this.generateValidKeys();
    }

    generateValidKeys() {
      const keys = [
        'no-permission', // Used for test cases
      ];

      Object.keys(this.sequelize.models).forEach((key) => {
        const keyName = camelCase(key);
        keys.push(`${keyName}.list`);
        keys.push(`${keyName}.read`);
        keys.push(`${keyName}.create`);
        keys.push(`${keyName}.update`);
        keys.push(`${keyName}.destroy`);
      });

      this.validKeys = keys;
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      const { Permission, Patient, Clinician }: any = this.sequelize?.models;

      Permission.belongsTo(Patient, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'patient',
        },
      });

      Permission.belongsTo(Clinician, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'clinician',
        },
      });
    }
  }

  (Permission as any).init(
    {
      key: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidKey(value) {
            if (!includes((this as any).validKeys, value)) {
              throw new Error('Not a valid key');
            }
          },
        },
      },
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
    },
    {
      sequelize,
      modelName: 'Permission',
      indexes: [
        {
          name: 'target_permission',
          unique: true,
          fields: ['targetType', 'targetId', 'key'],
        },
      ],
    }
  );

  return Permission;
};
