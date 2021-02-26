import { Model } from 'sequelize';
import { isString, isValidOwnerType } from './validators';

export default (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      const {
        Review,
        Patient,
        PatientReview,
        SignalQuestion,
        ReviewSubmission,
        Clinician,
        LoticUser,
      }: any = this.sequelize?.models;

      Review.belongsToMany(Patient, {
        through: PatientReview,
        foreignKey: 'reviewId',
        otherKey: 'patientId',
      });

      Review.hasMany(SignalQuestion, {
        foreignKey: 'reviewId',
      });

      Review.hasMany(ReviewSubmission, {
        foreignKey: 'reviewId',
      });

      Review.belongsTo(Clinician, {
        foreignKey: 'ownerId',
        constraints: false,
      });

      Review.belongsTo(LoticUser, {
        foreignKey: 'ownerId',
        constraints: false,
      });
    }
  }
  Review.init(
    {
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isString,
        },
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      ownerType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidOwnerType,
        },
      },
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );
  return Review;
};
