import { User } from './user';
import { isString, isValidProvider } from './validators';

export default (sequelize, DataTypes) => {
  class LoticUser extends User {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const {
        LoticUser,
        Permission,
        Profile,
        Provider,
        Email,
        Address,
      }: any = this.sequelize?.models;

      LoticUser.hasMany(Permission, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'loticUser',
        },
      });

      LoticUser.hasMany(Provider, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'loticUser',
        },
      });

      LoticUser.hasMany(Email, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'loticUser',
        },
      });

      LoticUser.hasMany(Address, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'loticUser',
        },
      });

      LoticUser.hasOne(Profile, {
        foreignKey: 'targetId',
        constraints: false,
        scope: {
          targetType: 'loticUser',
        },
      });
    }

    async addPermissions(keys) {
      return super.addPermissions(keys);
    }
  }
  LoticUser.init(
    {
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidProvider,
        },
      },
      providerId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isString,
        },
      },
      providerKey: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isString,
        },
      },
    },
    {
      sequelize,
      modelName: 'LoticUser',
      indexes: [
        {
          name: 'loticUser_provider_providerId',
          unique: true,
          fields: ['provider', 'providerId'],
        },
      ],
      hooks: {
        async beforeCreate(instance: any) {
          await instance.hashPassword(instance);
        },
        async beforeUpdate(instance: any) {
          await instance.hashPassword(instance);
        },
      },
    }
  );
  return LoticUser;
};
