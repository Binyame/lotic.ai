import db from '../../models';
import { resolver } from 'graphql-sequelize';
import { generateResolvers } from '../resolver';
import { Op } from 'sequelize';
import Joi from 'joi';

const schema = Joi.object({
  title: Joi.string().required(),
  signalQuestions: Joi.array()
    .items(
      Joi.object({
        content: Joi.string().required(),
        type: Joi.string().required(),
        trigger: Joi.object().required(),
      })
    )
    .min(1)
    .required(),
  patientId: Joi.number().optional(),
});

const parseWhere = (where) => {
  let result: any = {};
  Object.entries(where).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((item) => {
        value[Op[item]] = value[item];
        delete value[item];
      });
    }
    result = { ...result, [key]: value };
  });
  return result;
};

export default generateResolvers('Review', ['patients', 'signalQuestions'], {
  Query: {
    reviews: async (root, args, ctx, info) => {
      if (ctx.user.patient) {
        const patient = await db.Patient.findByPk(ctx.user.patient.id);
        return patient.getReviews(args);
      } else if (ctx.user.clinician) {
        let where = args.where ? parseWhere(args.where) : {};
        if (where && where.ownerId && where.ownerId !== ctx.user.clinician.id) {
          return new Error('You can not get entries with this ownerId');
        }
        const reviews = await db.Review.findAll({
          where: {
            [where && where.ownerType === 'clinician' ? Op.and : Op.or]: [
              { ownerType: 'lotic', ...where },
              { ownerId: ctx.user.clinician.id, ...where },
            ],
          },
        });
        return reviews;
      } else {
        return resolver(db.Review)(root, args, ctx, info);
      }
    },
    review: async (root, args, ctx, info) => {
      if (ctx.user.patient) {
        const patient = await db.Patient.findByPk(ctx.user.patient.id);
        const reviews = await patient.getReviews({ where: { id: args.id } });

        return reviews[0];
      } else if (ctx.user.clinician) {
        const review = await db.Review.findOne({
          where: {
            id: args.id,
            ownerId: ctx.user.clinician.id,
          },
        });
        return review;
      } else {
        return resolver(db.Review)(root, args, ctx, info);
      }
    },
  },
  Mutation: {
    createReview: async (_, args, ctx) => {
      let options = {
        ...args.json,
      };

      const { error } = schema.validate(args.json);

      if (error) {
        return new Error(error.details[0].message);
      }

      const ownerType = ctx.user.clinician ? 'clinician' : 'lotic';
      let ownerId;

      if (ownerType === 'clinician') {
        ownerId = ctx.user.clinician.id;
      }

      if (ownerType === 'lotic') {
        ownerId = ctx.user.loticUser.id;
      }

      if (!ownerId) {
        throw new Error('Owner id is null.');
      }

      options.ownerType = ownerType;
      options.ownerId = ownerId;

      const review = await ctx.db.Review.create(options);

      const { signalQuestions, patientId } = args.json;

      for (const attrs of signalQuestions) {
        attrs.reviewId = review.id;
        const signalQuestion = await ctx.db.SignalQuestion.create(attrs);
        review.addSignalQuestion(signalQuestion);
      }

      if (patientId) {
        const paOpts = {
          patientId,
          reviewId: review.id,
          type: ownerType,
        };
        if (ownerType === 'clinician') {
          const pc = await ctx.db.PatientClinician.findOne({
            where: {
              patientId,
              clinicianId: ownerId,
            },
          });

          if (!pc) {
            throw new Error('Forbidden.');
          }
        }
        await ctx.db.PatientReview.create(paOpts);
      }

      return review;
    },
    updateReview: async (_, args, ctx) => {
      if (ctx.user.clinician) {
        const review = await ctx.db.Review.findByPk(args.review.id);
        if (review.ownerId !== ctx.user.clinician.id) {
          return new Error('You can not modify this entry.');
        }
      }
      await ctx.db.Review.update(args.review, {
        where: {
          id: args.review.id,
        },
      });
      return await ctx.db.Review.findByPk(args.review.id);
    },
    destroyReview: async (_, args, ctx) => {
      if (ctx.user.clinician) {
        const review = await ctx.db.Review.findByPk(args.review.id);
        if (review.ownerId !== ctx.user.clinician.id) {
          return new Error('You can not destroy this entry.');
        }
      }
      await ctx.db.Review.destroy({
        where: {
          id: args.review.id,
        },
      });
      return true;
    },
  },
  Review: {
    owner: async (root, args, ctx) => {
      const review = await db.Review.findByPk(root.id);
      if (review.ownerType === 'clinician') {
        return await review.getClinician();
      } else {
        return await review.getLoticUser();
      }
    },
  },
});
