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
    const patient = await db.Patient.findOne({ where: { providerId } });

    if (!patient) {
      return done(null, false, { message: 'Patient not found.' });
    }

    const authenticated = await patient.authenticate(providerKey);

    if (!authenticated) {
      return done(null, false, { message: 'Authentication failed.' });
    }

    return done(null, patient);
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
