import { createMocks } from 'node-mocks-http';
import { authRedirect } from '../../../authentication';
import { factory } from '../../utils';
import config from '../../../config/config';

describe('HANDLER - authRedirect', () => {
  test('should redirect with a code', async () => {
    const user = await factory.create('Patient');

    const { req, res } = createMocks({
      method: 'GET'
    });

    req.user = user;
    
    await authRedirect(req, res, null);

    expect(res._getStatusCode()).toEqual(302);
    expect(res._getRedirectUrl()).toMatch(config.redirects.uri as any);    
  });
});