import { generateResolvers } from '../resolver';
import { resolver } from 'graphql-sequelize';
import queueService from '../../services/queue';

export default generateResolvers(
  'Patient',
  [
    'addresses',
    'emails',
    'permissions',
    'profile',
    'providers',
    'reviews',
    'reviewSubmissions',
    'clinicians',
    'moments',
    'patientAssessments',
  ],
  {
    Query: {
      patients: async (root, args, ctx, info) => {
        if (ctx.user.clinician) {
          const clinician = await ctx.db.Clinician.findByPk(
            ctx.user.clinician.id
          );
          return clinician.getPatients(args);
        } else {
          return resolver(ctx.db.Patient)(root, args, ctx, info);
        }
      },
      patient: async (root, args, ctx, info) => {
        if (ctx.user.clinician) {
          const clinician = await ctx.db.Clinician.findByPk(
            ctx.user.clinician.id
          );
          const patients = await clinician.getPatients({
            where: { id: args.id },
          });
          return patients[0];
        } else {
          return resolver(ctx.db.Patient)(root, args, ctx, info);
        }
      },
    },
    Mutation: {
      updatePatient: async (_, args, ctx) => {
        let patClin;
        if (ctx.user.clinician) {
          patClin = await ctx.db.PatientClinician.findOne({
            where: {
              patientId: args.patient.id,
              clinicianId: ctx.user.clinician.id,
            },
          });
        }
        if (!ctx.user.clinician || patClin) {
          await ctx.db.Patient.update(args.patient, {
            where: {
              id: args.patient.id,
            },
          });
          return await ctx.db.Patient.findByPk(args.patient.id);
        }
        return new Error('You can not modify this entry.');
      },
      invitePatient: async (_, args, ctx) => {
        console.log(args);
        try {
          const clinicianId = ctx.user.clinician.id;
          await queueService.addJob('patientInviteEmail', {
            clinicianId,
            ...args,
          });
          return 'Patient invited.';
        } catch (e) {
          throw e;
        }
      },
    },
  }
);
