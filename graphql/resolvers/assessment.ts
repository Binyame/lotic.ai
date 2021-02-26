import { generateResolvers } from '../resolver';
import { resolver } from 'graphql-sequelize';
import { Op } from 'sequelize';
import db from '../../models';
import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().required(),
  area: Joi.string().required(),
  subCategory: Joi.string().required(),
  hashTag: Joi.string().required(),
  prompts: Joi.array()
    .items(
      Joi.object({
        order: Joi.number().required(),
        durationMs: Joi.number().required(),
        content: Joi.string().required(),
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

export default generateResolvers(
  'Assessment',
  ['patientAssessments', 'prompts', 'moments', 'signalQuestions'],
  {
    Query: {
      // assessments: async (root, args, ctx, info) => {
      //   if (ctx.user.clinician) {
      //     let where = parseWhere(args.where);
      //     if (
      //       where &&
      //       where.ownerId &&
      //       where.ownerId !== ctx.user.clinician.id
      //     ) {
      //       return new Error('You can not get entries with this ownerId');
      //     }
      //     const assessments = await db.Assessment.findAll({
      //       where: {
      //         [where && where.ownerType === 'clinician' ? Op.and : Op.or]: [
      //           { ownerType: 'lotic', ...where },
      //           { ownerId: ctx.user.clinician.id, ...where },
      //         ],
      //       },
      //     });
      //     return assessments;
      //   } else {
      //     return resolver(db.Assessment)(root, args, ctx, info);
      //   }
      // },
      assessment: async (root, args, ctx, info) => {
        if (ctx.user.clinician) {
          const assessment = await db.Assessment.findOne({
            where: {
              id: args.id,
              ownerId: ctx.user.clinician.id,
            },
          });
          return assessment;
        } else {
          return resolver(db.Assessment)(root, args, ctx, info);
        }
      },
    },
    Mutation: {
      createAssessment: async (_, args, ctx) => {
        const area = args.json.area || 'Custom';
        const subCategory = args.json.subCategory || 'Custom';

        let options = {
          ...args.json,
          area,
          subCategory,
        };

        const { error } = schema.validate(options);

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

        const assessment = await ctx.db.Assessment.create(options);

        const { prompts, patientId } = args.json;

        for (const attrs of prompts) {
          const prompt = await ctx.db.Prompt.create(attrs);
          assessment.addPrompt(prompt);
        }

        if (patientId) {
          const paOpts = {
            patientId,
            assessmentId: assessment.id,
            completed: false,
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
            } else {
              await ctx.db.PatientAssessment.create(paOpts);
            }
          } else {
            await ctx.db.PatientAssessment.create(paOpts);
          }
        }

        return assessment;
      },
      updateAssessment: async (_, args, ctx) => {
        if (ctx.user.clinician) {
          const assessment = await ctx.db.Assessment.findByPk(
            args.assessment.id
          );
          if (assessment.ownerId !== ctx.user.clinician.id) {
            return new Error('You can not modify this entry.');
          }
        }
        await ctx.db.Assessment.update(args.assessment, {
          where: {
            id: args.assessment.id,
          },
        });
        return await ctx.db.Assessment.findByPk(args.assessment.id);
      },
      destroyAssessment: async (_, args, ctx) => {
        if (ctx.user.clinician) {
          const assessment = await ctx.db.Assessment.findByPk(
            args.assessment.id
          );
          if (assessment.ownerId !== ctx.user.clinician.id) {
            return new Error('You can not destroy this entry.');
          }
        }
        await ctx.db.Assessment.destroy({
          where: {
            id: args.assessment.id,
          },
        });
        return true;
      },
    },
    Owner: {
      __resolveType(obj, context, info) {
        if (obj.provider === 'loticUser') {
          return 'LoticUser';
        }

        if (obj.provider === 'clinician') {
          return 'Clinician';
        }

        return null;
      },
    },
    Assessment: {
      owner: async (root, args, ctx) => {
        const assessment = await db.Assessment.findByPk(root.id);
        if (assessment.ownerType === 'clinician') {
          return await assessment.getClinician();
        } else {
          return await assessment.getLoticUser();
        }
      },
    },
  }
);
