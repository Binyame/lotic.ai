import { request, factory } from '../../utils';

describe('ROUTE - /auth/terms/:key', () => {
    
  test('returns the latest terms', async () => {
    const key = 'test-terms';
    
    await factory.create('Agreement', { key, active: true, version: '1' });
    await factory.create('Agreement', { key, active: true, version: '2' });

    const latest = await factory.create('Agreement', { key, active: true, version: '3' });

    const res = await request((global as any).listener)
      .get(`/auth/terms/${key}`)
      .send();

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(latest.id);
  });

  test('handles not found keys', async () => {
    const res = await request((global as any).listener)
      .get(`/auth/terms/very-bad-key`)
      .send();

    expect(res.status).toEqual(404)
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual('No agreements found');
  });

});