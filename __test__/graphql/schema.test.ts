import { printSchema } from 'graphql';
import schema from '../../graphql/schema';

describe('GraphQL - Schema', () => {
  test('should match snapshot', async () => {
    expect(printSchema(schema)).toMatchSnapshot();
  });
});
