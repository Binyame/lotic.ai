import { generateResolvers } from '../resolver';
import db from '../../models';
import { hashPassword } from '../../authentication/password';

export default generateResolvers(
  'Clinician',
  [
    'addresses',
    'emails',
    'permissions',
    'profile',
    'providers',
    'clinicianAgreements',
    'momentShares',
    'patients',
    'HCProviders',
  ],
  {
    Mutation: {
      addMomentShare: async (_, args, ctx) => {
        const { clinicianId, momentShareId } = args;

        const record = await ctx.db.MomentShareClinician.create({
          momentShareId,
          clinicianId,
        });
        return record;
      },
      addPatient: async (_, args, ctx) => {
        const { clinicianId, patientId } = args;

        const record = await ctx.db.PatientClinician.create({
          patientId,
          clinicianId,
        });
        return record;
      },
      addHCProvider: async (_, args, ctx) => {
        const { clinicianId, hcProviderId } = args;

        const record = await ctx.db.HCProviderClinician.create({
          hcProviderId,
          clinicianId,
        });
        return record;
      },
      updatePassword: async (_, args, ctx) => {
        const { providerId, newPassword } = args;
        const providerKey = await hashPassword(newPassword);
        const updateArgs = {
          providerKey,
        };
        try {
          await ctx.db.Clinician.update(updateArgs, {
            where: {
              providerId,
            },
          });
          return { result: true };
        } catch (e) {
          throw new Error('Failed to Update Password.Please,Try Again');
        }
      },
    },
    Clinician: {
      HCProviders: async (root, args, ctx) => {
        if (ctx.user.clinician && ctx.user.clinician.id === root.id) {
          const clinician = await db.Clinician.findByPk(ctx.user.clinician.id);
          return clinician.getHCProviders();
        }
        return [];
      },
    },
  }
);
