import { Strategy as GithubStrategy } from 'passport-github2';
import { get } from 'lodash';

import configs from '../../config/config';
import { getCallBackUrl } from '../utils';
import UserService from '../../services/user';

export const config = {
  passReqToCallback: false,
  clientID: configs.github.clientId,
  clientSecret: configs.github.clientSecret,
  callbackURL: getCallBackUrl('github'),
  scope: [
    'repo',
    'repo:status',
    'repo_deployment',
    'public_repo',
    'repo:invite',
    'security_events',
    'admin:repo_hook',
    'write:repo_hook',
    'read:repo_hook',
    'admin:org',
    'write:org',
    'read:org',
    'admin:public_key',
    'write:public_key',
    'read:public_key',
    'admin:org_hook',
    'gist',
    'notifications',
    'user',
    'read:user',
    'user:email',
    'user:follow',
    'delete_repo',
    'write:discussion',
    'read:discussion',
    'write:packages',
    'read:packages',
    'delete:packages',
    'admin:gpg_key',
    'write:gpg_key',
    'read:gpg_key',
    'workflow',
  ],
};

export const handler = async (accessToken, refreshToken, profile, done) => {
  const userService = new UserService({
    provider: 'github',
    providerId: profile.id,
    accessToken,
    refreshToken,
    // permissions: [''],
    name: profile.displayName,
    emails: (profile.emails || []).map(({ value, primary }) => ({
      email: value,
      primary,
    })),
    avatarUri: get(profile, 'photos.0.value'),
    githubUser: profile.username,
  });

  const user = await userService.upsertUser();

  // see https://github.com/jaredhanson/passport-github/blob/master/lib/strategy.js#L40
  // see https://gitlab.com/andycunn/canvass/blob/f3f03859b3de66f30d7703a4c5d2f44f7c724f67/api/app.js#L118
  // for an example
  done(null, user);
};

export const Strategy = new GithubStrategy(config, handler);

export default {
  config,
  Strategy,
  handler,
};
