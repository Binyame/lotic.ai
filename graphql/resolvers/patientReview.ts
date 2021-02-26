import { resolver } from 'graphql-sequelize';
import { generateResolvers } from '../resolver';

export default generateResolvers('PatientReview', ['patient', 'review'], {
  Query: {
    patientReviews: async (root, args, ctx, info) => {
      if (ctx.user.patient) {
        const patient = await ctx.db.Patient.findByPk(ctx.user.patient.id);
        let newArgs = {
          ...args,
          where: { ...args.where, patientId: patient.id },
        };
        return resolver(ctx.db.PatientReview)(root, newArgs, ctx, info);
      } else {
        return resolver(ctx.db.PatientReview)(root, args, ctx, info);
      }
    },
    patientReview: async (root, args, ctx, info) => {
      if (ctx.user.patient) {
        const patient = await ctx.db.Patient.findByPk(ctx.user.patient.id);
        const patientReviews = await patient.getPatientReviews({
          where: { id: args.id },
        });

        return patientReviews[0];
      } else {
        return resolver(ctx.db.PatientReview)(root, args, ctx, info);
      }
    },
  },
});
