import { generateResolvers } from '../resolver';
import db from '../../models';

export default generateResolvers(
  'HCProvider',
  ['HCProviderInvites', 'clinicians'],
  {
    Query: {
      hcProviders: async (root, args, ctx, info) => {
        if (ctx.user.clinician) {
          const clinician = await db.Clinician.findByPk(ctx.user.clinician.id);
          return clinician.getHCProviders(args);
        } else {
          return [];
        }
      },
    },
  }
);
