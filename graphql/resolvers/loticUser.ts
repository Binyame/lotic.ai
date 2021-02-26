import { generateResolvers } from '../resolver';

export default generateResolvers('LoticUser', [
  'addresses',
  'emails',
  'permissions',
  'profile',
  'providers',
]);
