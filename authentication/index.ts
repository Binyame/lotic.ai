import { default as passport } from 'passport';
import device from 'device';

import providers from './providers';
import db from '../models';
import config from '../config/config';
import lru from '../services/lru';
import UserService from '../services/user';
import Hashids from 'hashids/cjs';
import { recoveryPasswordEmail } from '../services/queue/jobs/recoveryPasswordEmail';
import queueService from '../services/queue';

const hashLength: number = parseInt(process.env.HASH_ID_LENGTH || '', 10);
const hashids = new Hashids(process.env.HASH_ID_SALT, hashLength);

/**
 * authRedirect
 *
 * Generates an accessCode (LRU Cache)
 * Key is uuid.v4(), Value is a valid JWT
 *
 * Redirects to uri or protocolUri so that
 * client can fetch valid JWT
 */
export async function authRedirect(req, res, err) {
  if (err) {
    return res.json({ err });
  }

  if (!req.user) {
    return res.json({ success: false });
  }

  const code = await req.user.accessCode();
  const userAgent = req.headers['user-agent'];
  const { type } = device(userAgent);
  const isMobile = type === 'phone' || type === 'tablet';

  let redirectUri = isMobile
    ? config.redirects.protocolUri
    : config.redirects.uri;
  redirectUri += `?code=${code}`;

  res.redirect(redirectUri);
}

export function useAuthentication(app: any) {
  Object.keys(providers).forEach((key) => {
    passport.use(key, providers[key].Strategy);
  });

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    db.Patient.findByPK(id, (err, user) => {
      done(err, user);
    });
  });

  app.use(passport.initialize());

  /**
   * /auth/patient/register
   *
   * Simple route for registering a Patient with
   * email & password (LocalStrategy)
   */
  app.post('/auth/patient/register', async (req, res) => {
    const { name, providerId, providerKey, terms, careTeamCode } = req.body;

    if (
      !name ||
      !providerId ||
      !providerKey ||
      !careTeamCode ||
      !careTeamCode.codeId ||
      !careTeamCode.clinicianId
    ) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    try {
      const userService = new UserService({
        name,
        provider: 'patient',
        providerId,
        providerKey,
        emails: [{ email: providerId, primary: true }],
        terms,
        careTeamCode,
      });

      const user = await userService.upsertUser();

      const token = await user.token();

      res.json({ success: true, token });
    } catch (err) {
      console.log(err);
      return res.status(500).send('Internal server error');
    }
  });

  /**
   * /auth/clinician/register
   *
   * Simple route for registering a Clinician with
   * email & password (LocalStrategy)
   */
  app.post('/auth/clinician/register', async (req, res) => {
    const { providerId, providerKey, name, terms, hashId } = req.body;

    if (!providerId || !providerKey || !hashId) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    try {
      const decoded = hashids.decode(hashId)[0];
      const hcProviderId = decoded ? decoded.toString() : undefined;
      if (hcProviderId) {
        await db.HCProvider.findOne({
          where: { id: hcProviderId },
        });
      } else {
        return res.json({
          success: false,
          message: 'HCProvider does not exist',
        });
      }

      const userService = new UserService({
        provider: 'clinician',
        providerId,
        providerKey,
        emails: [{ email: providerId, primary: true }],
        name: name,
        terms,
        hcProviderId,
      });
      const user = await userService.upsertUser();

      const token = await user.token();

      res.json({ success: true, token });
    } catch (err) {
      console.log(err);
      return res.status(500).send('Internal server error');
    }
  });

  /**
   * /auth/lotic/register
   *
   * Simple route for registering a Clinician with
   * email & password (LocalStrategy)
   */
  app.post('/auth/lotic/register', async (req, res) => {
    const { providerId, providerKey } = req.body;

    if (!providerId || !providerKey) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    try {
      const userService = new UserService({
        provider: 'loticUser',
        providerId,
        providerKey,
        emails: [{ email: providerId, primary: true }],
      });

      const user = await userService.upsertUser();

      const token = await user.token();

      res.json({ success: true, token });
    } catch (err) {
      console.log(err);
      return res.status(500).send('Internal server error');
    }
  });

  /**
   * /auth/patient/login
   *
   * Simple route for patient login.  Returns JWT (LocalStrategy)
   */
  app.post('/auth/patient/login', async (req, res) => {
    passport.authenticate('patient', {}, async (err, patient, _info) => {
      if (!patient) {
        return res.json({
          success: false,
        });
      }

      req.user = patient;

      const token = await patient.token();

      res.json({
        success: true,
        token,
      });
    })(req, res);
  });

  /**
   * /auth/clinician/login
   *
   * Simple route for clinician login.  Returns JWT (LocalStrategy)
   */
  app.post('/auth/clinician/login', async (req, res) => {
    passport.authenticate('clinician', {}, async (err, patient, _info) => {
      if (!patient) {
        return res.json({
          success: false,
        });
      }

      req.user = patient;

      const token = await patient.token();

      res.json({
        success: true,
        token,
      });
    })(req, res);
  });

  /**
   * /auth/lotic/login
   *
   * Simple route for lotic login.  Returns JWT (LocalStrategy)
   */
  app.post('/auth/lotic/login', async (req, res) => {
    passport.authenticate('lotic', {}, async (err, loticUser, _info) => {
      if (!loticUser) {
        return res.json({
          success: false,
        });
      }

      req.user = loticUser;

      const token = await loticUser.token();

      res.json({
        success: true,
        token,
      });
    })(req, res);
  });

  /**
   * /auth/token
   *
   * Returns a valid JWT for a code that exists
   */
  app.post('/auth/token', async (req, res) => {
    const { code } = req.body;

    if (!code) {
      return res.status(400).send('Bad request.');
    }

    const token = lru.get(code);

    if (!token) {
      return res.status(404).send('Not found.');
    }

    return res.json({ token });
  });

  /**
   * /auth/providers/:provider
   *
   * Dynamic route for loading provider strategies
   */
  app.get('/auth/providers/:provider', async (req, res) => {
    const { provider } = req.params;

    if (!provider) {
      return { statusCode: 404 };
    }

    passport.authenticate(provider)(req, res, (...args) => {
      console.log('passport authenticated', args);
    });
  });

  /**
   * /auth/providers/:provider/callback
   *
   * Uses provider code to Upsert User (see Strategy) and
   * retrieve profile & accessToken from provider
   *
   * Calls authRedirect to redirect to appropriate url
   */
  app.get('/auth/providers/:provider/callback', async (req, res) => {
    const { provider } = req.params;

    if (!provider) {
      return { statusCode: 404 };
    }

    return passport.authenticate(provider, { session: false })(
      req,
      res,
      (err) => {
        authRedirect(req, res, err);
      }
    );
  });

  /**
   * /auth/terms/:key
   *
   * Get the latest version of agreement by key
   */
  app.get('/auth/terms/:key', async (req, res) => {
    const { key } = req.params;

    if (!key) {
      return { statusCode: 400 };
    }

    try {
      const agreements = await db.Agreement.findAll({
        limit: 1,
        where: { active: true, key },
        order: [['version', 'DESC']],
      });

      if (!agreements.length) {
        return res.status(404).json({ message: 'No agreements found' });
      }

      res.json(agreements[0]);
    } catch (e) {
      console.error(e);
    }
  });

  /**
   * /auth/careTeamCode/:code
   *
   * Get the careTeamCode
   */
  app.get('/auth/careTeamCode/:code', async (req, res) => {
    const { code } = req.params;

    if (!code) {
      return { statusCode: 400 };
    }

    try {
      const careTeamCode = await db.CareTeamCode.findOne({
        where: { code },
      });

      if (!careTeamCode) {
        return res
          .status(404)
          .json({ success: false, message: 'No careTeam code found' });
      }

      const expiry = new Date(careTeamCode.expiry);

      if (expiry < new Date()) {
        return res
          .status(400)
          .json({ success: false, message: 'CareTeam code expired' });
      }

      if (careTeamCode.usedOn) {
        return res.status(400).json({
          success: false,
          message: 'CareTeam code has already been used',
        });
      }

      res.json({ success: true, careTeamCode });
    } catch (e) {
      console.error(e);
    }
  });

  /**
   * /auth/clinician/resetPassword/:email
   *
   * Post the resetPasswordCode
   */
  app.post('/auth/clinician/resetPassword/:email', async (req, res) => {
    const { email } = req.params;

    try {
      const unixDate = new Date().getTime();
      const code = hashids.encode(parseInt(unixDate.toString().slice(-6)));

      await queueService.addJob('recoveryPasswordEmail', { email, code });
      return res.json({ code });
    } catch (e) {
      console.error(e);
      return res.status(400).send(e.message);
    }
  });
}
