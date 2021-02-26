import { rule, shield, allow, deny, and, or, not } from 'graphql-shield';
import { get, includes, camelCase, merge, without } from 'lodash';
import pluralize from 'pluralize';
import db from '../models';
import config from '../config/config';

const hasPermission = (permission) =>
  rule(`permission.${permission}`, {
    cache: 'contextual',
  })(async (_parent, _args, ctx, _info) => {
    if (!includes(get(ctx, 'user.permissions'), permission)) {
      if (config.environment !== 'production') {
        return `Missing permission for ${permission}`;
      } else {
        return 'Not authorized.';
      }
    }
    return true;
  });

const isPatientSelf = rule({ cache: 'contextual' })(async (_, args, ctx) => {
  if (!ctx?.user?.patient) {
    return 'Invalid Patient Request';
  }

  const patientId = ctx?.user?.id;

  if (args.patientId && args.patientId !== patientId) {
    return 'Invalid Patient Request';
  }

  return true;
});

const isCurrentUser = rule({ cache: 'contextual' })(async (_, args, ctx) => {
  if (!args.patient && !args.clinician) {
    return true;
  }

  const key = args.patient ? 'patient' : 'clinician';

  if (get(ctx, `${key}.id`) !== get(args, `${key}.id`)) {
    return `You are not the current ${key}.`;
  }

  return true;
});

const resolveOnlyPatient = rule({ cache: 'contextual' })(
  async (_, args, ctx) => {
    if (ctx.user.patient) {
      args.where = {
        ...(args.where || {}),
        patientId: ctx.user.patient.id,
      };

      return true;
    }

    return true;
  }
);

const denyPatients = rule({ cache: 'contextual' })(async (_, args, ctx) => {
  if (ctx.user.patient) {
    return 'Denied.';
  }

  return true;
});

const denyClinician = rule({ cache: 'contextual' })(async (_, args, ctx) => {
  if (ctx.user.clinician) {
    return 'Denied.';
  }

  return true;
});

const isAuthenticated = rule({ cache: 'contextual' })(
  async (_root, _args, ctx, _info) => {
    if (ctx.user === null || ctx.user === undefined) {
      return 'Not authorized.';
    }

    return true;
  }
);

const notAllowed = rule()(async () => 'Not allowed.');

const modelKeys = [
  'Address',
  'Assessment',
  'Clinician',
  'Content',
  'DataPrint',
  'Email',
  'LoticUser',
  'Moment',
  'MomentPrompt',
  'Patient',
  'PatientAssessment',
  'Permission',
  'Profile',
  'Prompt',
  'Provider',
  'Review',
  'ReviewSubmission',
  'SignalQuestion',
  'Agreement',
  'ClinicianAgreement',
  'PatientAgreement',
  'HCProvider',
  'HCProviderInvite',
  'MomentShare',
  'Like',
  'CareTeamCode',
  'PatientReview',
];

const defaultPermissions = modelKeys.reduce(
  (memo, modelName) => {
    const singular = camelCase(modelName);
    const plural = pluralize(singular);

    memo.Query[plural] = and(
      isAuthenticated,
      hasPermission(`${singular}.list`)
    );
    memo.Query[singular] = and(
      isAuthenticated,
      hasPermission(`${singular}.read`)
    );

    memo.Mutation[`create${modelName}`] = and(
      isAuthenticated,
      hasPermission(`${singular}.create`)
    );
    memo.Mutation[`update${modelName}`] = and(
      isAuthenticated,
      hasPermission(`${singular}.update`)
    );
    memo.Mutation[`destroy${modelName}`] = and(
      isAuthenticated,
      hasPermission(`${singular}.destroy`)
    );

    memo[modelName] = isAuthenticated;

    return memo;
  },
  { Query: {}, Mutation: {}, Subscription: {} }
);

export const permissions = shield(
  merge(defaultPermissions, {
    Query: {
      assessments: and(
        isAuthenticated,
        denyPatients,
        hasPermission('assessment.list')
      ),
      assessment: and(
        isAuthenticated,
        denyPatients,
        hasPermission('assessment.read')
      ),
      // reviews: and(
      //   isAuthenticated,
      //   hasPermission('review.list')
      // ),
      // review: and(
      //   isAuthenticated,
      //   hasPermission('review.read')
      // ),
      careTeamCodes: and(
        isAuthenticated,
        denyPatients,
        hasPermission('careTeamCode.list')
      ),
      careTeamCode: and(
        isAuthenticated,
        denyPatients,
        hasPermission('careTeamCode.read')
      ),
      patient: and(
        isAuthenticated,
        hasPermission('patient.read'),
        denyPatients
      ),
      patients: and(
        isAuthenticated,
        hasPermission('patient.list'),
        denyPatients
      ),
    },
    Mutation: {
      createAddress: and(isAuthenticated, hasPermission('address.create')),
      updateAddress: and(isAuthenticated, hasPermission('address.update')),
      destroyAddress: and(isAuthenticated, hasPermission('address.destroy')),
      createAssessment: and(
        isAuthenticated,
        denyPatients,
        hasPermission('assessment.create')
      ),
      updateAssessment: and(
        isAuthenticated,
        denyPatients,
        hasPermission('assessment.update')
      ),
      destroyAssessment: and(
        isAuthenticated,
        denyPatients,
        hasPermission('assessment.destroy')
      ),
      createMoment: and(
        isAuthenticated,
        isPatientSelf,
        hasPermission('moment.create')
      ),
      updatePermission: notAllowed,
      createPatient: and(
        isAuthenticated,
        hasPermission('patient.create'),
        denyPatients,
        denyClinician
      ),
      updatePatient: and(
        isAuthenticated,
        or(hasPermission('patient.update'), isCurrentUser),
        denyPatients
      ),
      destroyPatient: and(
        isAuthenticated,
        hasPermission('patient.destroy'),
        denyPatients,
        denyClinician
      ),
      createPatientAssessment: and(
        isAuthenticated,
        denyPatients,
        hasPermission('patientAssessment.create')
      ),
      updatePatientAssessment: and(
        isAuthenticated,
        denyPatients,
        hasPermission('patientAssessment.update')
      ),
      destroyPatientAssessment: and(
        isAuthenticated,
        // denyPatients,
        hasPermission('patientAssessment.destroy')
      ),
      createPatientAgreement: and(
        isAuthenticated,
        // denyPatients,
        hasPermission('patientAgreement.create')
      ),
      updatePatientAgreement: and(
        isAuthenticated,
        denyPatients,
        hasPermission('patientAgreement.update')
      ),
      destroyPatientAgreement: and(
        isAuthenticated,
        denyPatients,
        hasPermission('patientAgreement.destroy')
      ),
      createReview: and(
        isAuthenticated,
        denyPatients,
        hasPermission('review.create')
      ),
      updateReview: and(
        isAuthenticated,
        denyPatients,
        hasPermission('review.update')
      ),
      destroyReview: and(
        isAuthenticated,
        denyPatients,
        hasPermission('review.destroy')
      ),
      createLike: and(
        isAuthenticated,
        denyPatients,
        hasPermission('like.create')
      ),
      updateLike: and(
        isAuthenticated,
        denyPatients,
        hasPermission('like.update')
      ),
      destroyLike: and(isAuthenticated, hasPermission('like.destroy')),
      addHCProvider: and(isAuthenticated, denyPatients),
      createHCProvider: and(
        isAuthenticated,
        hasPermission('hcProvider.create'),
        denyClinician
      ),
      updateHCProvider: and(
        isAuthenticated,
        hasPermission('hcProvider.update'),
        denyClinician
      ),
      destroyHCProvider: and(
        isAuthenticated,
        hasPermission('hcProvider.destroy'),
        denyClinician
      ),
      createCareTeamCode: and(
        isAuthenticated,
        hasPermission('careTeamCode.create'),
        denyClinician,
        denyPatients
      ),
      updateCareTeamCode: and(
        isAuthenticated,
        hasPermission('careTeamCode.update'),
        denyPatients
      ),
      destroyCareTeamCode: and(
        isAuthenticated,
        hasPermission('careTeamCode.destroy'),
        denyPatients
      ),
      createPatientReview: and(
        isAuthenticated,
        hasPermission('patientReview.create'),
        denyPatients
      ),
      updatePatientReview: and(
        isAuthenticated,
        hasPermission('patientReview.update'),
        denyPatients
      ),
      destroyPatientReview: and(
        isAuthenticated,
        hasPermission('patientReview.destroy')
      ),
      invitePatient: and(isAuthenticated, denyPatients),
    },
    Patient: {
      providerKey: notAllowed,
    },
  }),
  {
    allowExternalErrors: true,
    fallbackRule: allow,
  }
);
