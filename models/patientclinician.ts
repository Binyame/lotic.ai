import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class PatientClinician extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const {
        PatientClinician,
        Patient,
        Clinician,
      }: any = this.sequelize?.models;

      PatientClinician.belongsTo(Patient, {
        foreignKey: 'patientId',
        targetKey: 'id',
        constraints: false,
      });

      PatientClinician.belongsTo(Clinician, {
        foreignKey: 'clinicianId',
        targetKey: 'id',
        constraints: false,
      });
    }
  }
  PatientClinician.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      clinicianId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PatientClinician',
      indexes: [
        {
          name: 'PatientClinician_patientId_clinicianId_key',
          unique: true,
          fields: ['patientId', 'clinicianId'],
        },
      ],
    }
  );
  return PatientClinician;
};
