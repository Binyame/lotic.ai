import { Model } from 'sequelize';
import { isURL } from './validators';

export default (sequelize, DataTypes) => {
  class MomentShare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {
        MomentShare,
        Moment,
        Clinician,
        MomentShareClinician,
      }: any = this.sequelize?.models;

      MomentShare.belongsTo(Moment, {
        foreignKey: 'momentUuid',
      });

      MomentShare.belongsToMany(Clinician, {
        constraints: false,
        through: MomentShareClinician,
        foreignKey: 'momentShareId',
      });
    }
  }
  MomentShare.init(
    {
      momentUuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      uri: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isURL,
        },
      },
    },
    {
      sequelize,
      modelName: 'MomentShare',
    }
  );
  return MomentShare;
};
