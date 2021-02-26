
import { request } from '../../utils';

describe('ROUTE - /auth/providers/:provider', () => {
    
  test('should support github redirect', async () => {
    const res = await request((global as any).listener)
      .get('/auth/providers/github');
    
    expect(res.status).toEqual(302);
    expect(res.header.location).toMatch('https://github.com/login/oauth/authorize');
  });

});