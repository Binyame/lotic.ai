import { Strategy as LocalStrategy } from 'passport-local';
import db from '../../models';

export const config = {
  usernameField: 'providerId',
  passwordField: 'providerKey',
  passReqToCallback: true,
  session: false,
};

export const handler = async (req, providerId, providerKey, done) => {
  try {
    const clinician = await db.Clinician.findOne({ where: { providerId } });
    if (!clinician) {
      return done(null, false, { message: 'Clinician not found.' });
    }

    const authenticated = await clinician.authenticate(providerKey);

    if (!authenticated) {
      return done(null, false, { message: 'Authentication failed.' });
    }

    return done(null, clinician);
  } catch (err) {
    return done(err);
  }
};

export const Strategy = new LocalStrategy(config, handler);

export default {
  config,
  Strategy,
  handler,
};
