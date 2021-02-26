import { resolver } from 'graphql-sequelize';
import { generateResolvers } from '../resolver';

export default generateResolvers(
  'PatientAssessment',
  ['patient', 'assessment'],
  {
    Query: {
      patientAssessments: async (root, args, ctx, info) => {
        if (ctx.user.patient) {
          const patient = await ctx.db.Patient.findByPk(ctx.user.patient.id);
          let newArgs = {
            ...args,
            where: { ...args.where, patientId: patient.id },
          };
          return resolver(ctx.db.PatientAssessment)(root, newArgs, ctx, info);
        } else {
          return resolver(ctx.db.PatientAssessment)(root, args, ctx, info);
        }
      },
      patientAssessment: async (root, args, ctx, info) => {
        if (ctx.user.patient) {
          const patient = await ctx.db.Patient.findByPk(ctx.user.patient.id);
          const patientAssessments = await patient.getPatientAssessments({
            where: { id: args.id },
          });

          return patientAssessments[0];
        } else {
          return resolver(ctx.db.PatientAssessment)(root, args, ctx, info);
        }
      },
    },
  }
);
