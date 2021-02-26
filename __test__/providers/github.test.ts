import { mocks } from '../utils';
import { handler } from '../../authentication/providers/github';

/**
 * Explanation of this test:
 *
 * The provider test is really just testing that
 * the handler calls UserService.upsertUser, and
 * passing the results to done(err, user).
 *
 * The meat of the applciation is found in
 * services/user/index.tsx and associated tests
 */

const mockUpsertUser = jest.fn(() => ({ id: 123 }));
jest.mock('../../services/user', () => {
  return jest.fn().mockImplementation(() => {
    return { upsertUser: mockUpsertUser };
  });
});

describe('Provider - Github', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  
  describe('handler', () => {
    test('should call the user service', async () => {
      let user;
      const fn = (err, u) => (user = u);
      await handler('xxxxxx1', 'xxxxxx2', mocks.profiles.github, fn);

      expect(mockUpsertUser).toHaveBeenCalled();
      expect(user).toEqual({ id: 123 });
    });
  });
});
