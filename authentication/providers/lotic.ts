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
    const loticUser = await db.LoticUser.findOne({ where: { providerId } });

    if (!loticUser) {
      return done(null, false, { message: 'LoticUser not found.' });
    }

    const authenticated = await loticUser.authenticate(providerKey);

    if (!authenticated) {
      return done(null, false, { message: 'Authentication failed.' });
    }

    return done(null, loticUser);
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
