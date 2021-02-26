import { factory, mocks } from '../utils';
import { handler } from '../../authentication/providers/patient';

/**
 * Explanation of this test:
 * 
 * This is the only provider test that
 * does not call the UserService for upSert.
 * 
 * For local strategy, the register route is invoked.
 */


describe('Provider - Patient', () => {
  describe('handler', () => {
    test('work', async () => {
      const record = await factory.create('Patient', {
        providerId: 'local-provider@example.com',
        providerKey: 'password1234',
      });

      let user;
      const fn = (err, u) => user = u;
      await handler({}, 'local-provider@example.com', 'password1234', fn);
      expect(user.id).toEqual(record.id);
    });
  });
});