import { resolver } from 'graphql-sequelize';
import { generateResolvers } from '../resolver';
import { get } from 'lodash';

export default generateResolvers('Address', ['patient'], {
  Query: {
    addresses: async (root, args, ctx, info) => {
      if (ctx.user.patient) {
        const patient = await ctx.db.Patient.findByPk(ctx.user.patient.id);
        return patient.getAddresses(args);
      } else {
        return resolver(ctx.db.Address)(root, args, ctx, info);
      }
    },
    address: async (root, args, ctx, info) => {
      if (ctx.user.patient) {
        const patient = await ctx.db.Patient.findByPk(ctx.user.patient.id);
        const addresses = await patient.getAddresses({
          where: { id: args.id },
        });
        return addresses[0];
      } else {
        return resolver(ctx.db.Address)(root, args, ctx, info);
      }
    },
  },
  Mutation: {
    createAddress: async (_, args, ctx) => {
      const patientId = ctx?.user?.patient?.id;
      const { targetId } = args.address;

      if (patientId === targetId || !patientId) {
        const record = await ctx.db.Address.create(args.address);
        return record;
      }

      return new Error('You are not the current patient.');
    },
    updateAddress: async (_, args, ctx) => {
      const patientId = ctx?.user?.patient?.id;
      const address = await ctx.db.Address.findByPk(args.address.id);
      const { targetId } = address;

      if (patientId === targetId || !patientId) {
        await ctx.db.Address.update(args.address, {
          where: {
            id: args.address.id,
          },
        });
        return await ctx.db.Address.findByPk(args.address.id);
      }
      return new Error('You can not modify this entry.');
    },
    destroyAddress: async (_, args, ctx) => {
      const patientId = ctx?.user?.patient?.id;
      const address = await ctx.db.Address.findByPk(args.address.id);
      const { targetId } = address;

      if (patientId === targetId || !patientId) {
        await ctx.db.Address.destroy({
          where: {
            id: args.address.id,
          },
        });
        return true;
      }

      return new Error('You can not destroy this entry.');
    },
  },
});
