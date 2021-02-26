import { Model } from 'sequelize';
import { isJSON } from './validators';

export default (sequelize, DataTypes) => {
  class ReviewSubmission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const { ReviewSubmission, Patient, Review }: any = this.sequelize?.models;

      ReviewSubmission.belongsTo(Patient, {
        foreignKey: 'patientId',
      });

      ReviewSubmission.belongsTo(Review, {
        foreignKey: 'reviewId',
      });
    }
  }
  ReviewSubmission.init(
    {
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      body: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          isJSON,
        },
      },
    },
    {
      sequelize,
      modelName: 'ReviewSubmission',
    }
  );
  return ReviewSubmission;
};
