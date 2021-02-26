import { resolver } from 'graphql-sequelize';
import { generateResolvers } from '../resolver';

export default generateResolvers('PatientAgreement', ['patient', 'agreement'], {
  Query: {
    patientAgreements: async (root, args, ctx, info) => {
      if (ctx.user.patient) {
        const patient = await ctx.db.Patient.findByPk(ctx.user.patient.id);
        return patient.getPatientAgreements(args);
      } else {
        return resolver(ctx.db.PatientAgreement)(root, args, ctx, info);
      }
    },
    patientAgreement: async (root, args, ctx, info) => {
      if (ctx.user.patient) {
        const patient = await ctx.db.Patient.findByPk(ctx.user.patient.id);
        const patientAgreements = await patient.getPatientAgreements({
          where: { id: args.id },
        });

        return patientAgreements[0];
      } else {
        return resolver(ctx.db.PatientAgreement)(root, args, ctx, info);
      }
    },
  },
});
