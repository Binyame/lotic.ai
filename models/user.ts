import { Model } from 'sequelize';
import jwt from 'jsonwebtoken';
import { camelCase, pick } from 'lodash';
import { v4 } from 'uuid';

import config from '../config/config';
import { hashPassword, comparePassword } from '../authentication/password';
import lru from '../services/lru';
import { isString, isValidProvider } from './validators';

export class User extends Model {
  modelName() {
    return camelCase(this.constructor.name);
  }
  authenticate(password) {
    if (!password) {
      return Promise.resolve(false);
    }
    return comparePassword(password, (this as any).providerKey);
  }

  async accessCode() {
    const token = await this.token();
    const accessCode = v4();

    lru.set(accessCode, token);

    return accessCode;
  }

  async token() {
    const [record, permissions] = await Promise.all([
      this,
      (this as any).getPermissions(),
    ]);

    let payload = {
      permissions: permissions.map(({ key }) => key),
    };

    const modelName = this.modelName();

    payload[modelName] = pick(record, 'id', 'providerId');

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: '30d',
    });

    return token;
  }

  async hashPassword() {
    const localProviders = ['patient', 'clinician', 'loticUser'];
    const isLocalProvider =
      localProviders.indexOf(this.get('provider' as any)) > -1;

    if (isLocalProvider && this.changed('providerKey' as any)) {
      let val = this.get('providerKey');

      if (!val || val === '') {
        throw new Error('Password can not be empty');
      }

      if (isLocalProvider) {
        this.set('providerId', (this as any).providerId.toLowerCase());
      }

      const hash = await hashPassword(val);
      this.set('providerKey', hash);
    }
  }

  async addPermissions(keys) {
    if (!keys || !keys.length) {
      return;
    }

    const { Permission } = this.sequelize.models;

    for (const key of keys) {
      try {
        const targetType = this.modelName();
        const targetId = (this as any).id;
        await Permission.create({ targetType, targetId, key });
      } catch (e) {
        // Swallow the unique constraint error,
        // bet let PostGres do it's job
        if (e.name !== 'SequelizeUniqueConstraintError') {
          console.log(e);
        }
      }
    }

    return this.reload({
      include: [Permission],
    });
  }

  async makeSuper() {
    const { Permission } = this.sequelize.models;
    const perm = new Permission() as any;
    const keys = perm.validKeys;

    return this.addPermissions(keys);
  }
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate() {
    // define association here
    const {
      User,
      Permission,
      Profile,
      Provider,
      Email,
      Address,
    }: any = this.sequelize?.models;

    User.hasMany(Permission, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    User.hasMany(Provider, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    User.hasMany(Email, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    User.hasMany(Address, {
      foreignKey: 'targetId',
      constraints: false,
      scope: {
        targetType: 'user',
      },
    });

    User.hasOne(Profile, {
      foreignKey: 'userId',
    });
  }
}

export default (sequelize, DataTypes) => {
  User.init(
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
      modelName: 'User',
      indexes: [
        {
          name: 'user_provider_providerId',
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
  return User;
};
