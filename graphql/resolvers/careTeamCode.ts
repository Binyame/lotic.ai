import { generateResolvers } from '../resolver';
import { resolver } from 'graphql-sequelize';

export default generateResolvers('CareTeamCode', ['clinician'], {
  Query: {
    careTeamCodes: async (root, args, ctx, info) => {
      if (ctx.user.clinician) {
        const clinician = await ctx.db.Clinician.findByPk(
          ctx.user.clinician.id
        );
        return clinician.getCareTeamCodes();
      }
      return resolver(ctx.db.CareTeamCode)(root, args, ctx, info);
    },
    careTeamCode: async (root, args, ctx, info) => {
      if (ctx.user.clinician) {
        const clinician = await ctx.db.Clinician.findByPk(
          ctx.user.clinician.id
        );
        const careTeamCodes = await clinician.getCareTeamCodes({
          where: { id: args.id },
        });
        return careTeamCodes[0];
      }
      return resolver(ctx.db.CareTeamCode)(root, args, ctx, info);
    },
  },
});
