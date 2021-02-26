import config from '../config/config';

export function getCallBackUrl(providerName) {
  return `${config.api.host}/auth/providers/${providerName}/callback`;
}
