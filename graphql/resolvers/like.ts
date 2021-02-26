import { resolver } from 'graphql-sequelize';
import { generateResolvers } from '../resolver';

export default generateResolvers('Like', ['patient', 'content'], {
  Query: {
    likes: async (root, args, ctx, info) => {
      if (ctx.user.patient) {
        const patient = await ctx.db.Patient.findByPk(ctx.user.patient.id);
        let newArgs = {
          ...args,
          where: { ...args.where, patientId: patient.id },
        };
        return resolver(ctx.db.Like)(root, newArgs, ctx, info);
      } else {
        return resolver(ctx.db.Like)(root, args, ctx, info);
      }
    },
    like: async (root, args, ctx, info) => {
      if (ctx.user.patient) {
        const patient = await ctx.db.Patient.findByPk(ctx.user.patient.id);
        const likes = await patient.getLikes({
          where: { id: args.id },
        });

        return likes[0];
      } else {
        return resolver(ctx.db.Like)(root, args, ctx, info);
      }
    },
  },
});
