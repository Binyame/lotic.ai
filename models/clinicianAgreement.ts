import { Model } from 'sequelize';
import { isDateCheck } from './validators';
export default (sequelize, DataTypes) => {
  class ClinicianAgreement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      const {
        ClinicianAgreement,
        Agreement,
        Clinician,
      }: any = this.sequelize?.models;

      ClinicianAgreement.belongsTo(Clinician, {
        foreignKey: 'clinicianId',
        targetKey: 'id',
        constraints: false,
      });

      ClinicianAgreement.belongsTo(Agreement, {
        foreignKey: 'agreementId',
        targetKey: 'id',
        constraints: false,
      });
    }
  }
  ClinicianAgreement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      clinicianId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      agreementId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      agreed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      agreedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDateCheck,
        },
      },
    },
    {
      sequelize,
      modelName: 'ClinicianAgreement',
      indexes: [
        {
          name: 'ClinicianAgreement_clinicianId_agreementId_key',
          unique: true,
          fields: ['clinicianId', 'agreementId'],
        },
      ],
    }
  );
  return ClinicianAgreement;
};
