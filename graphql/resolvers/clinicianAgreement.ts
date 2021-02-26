import { resolver } from 'graphql-sequelize';
import { generateResolvers } from '../resolver';
import db from '../../models';

export default generateResolvers(
  'ClinicianAgreement',
  ['clinician', 'agreement'],
  {
    Query: {
      clinicianAgreements: async (root, args, ctx, info) => {
        if (ctx.user.clinician) {
          const clinician = await db.Clinician.findByPk(ctx.user.clinician.id);
          return clinician.getClinicianAgreements(args);
        } else {
          return resolver(db.ClinicianAgreement)(root, args, ctx, info);
        }
      },
      clinicianAgreement: async (root, args, ctx, info) => {
        if (ctx.user.clinician) {
          const clinician = await db.Clinician.findByPk(ctx.user.clinician.id);
          const clinicianAgreements = await clinician.getClinicianAgreements({
            where: { id: args.id },
          });

          return clinicianAgreements[0];
        } else {
          return resolver(db.ClinicianAgreement)(root, args, ctx, info);
        }
      },
    },
  }
);
