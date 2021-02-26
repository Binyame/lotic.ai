import { generateResolvers } from '../resolver';

export default generateResolvers('Agreement', [
  'clinicianAgreements',
  'patientAgreements',
]);
