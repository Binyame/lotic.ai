import jwt from 'jsonwebtoken';
import { request, factory } from '../../utils';

describe('ROUTE - /auth/token', () => {
    
  test('return a JWT from a code', async () => {
    const patient = await factory.create('Patient');

    const code = await patient.accessCode();

    const res = await request((global as any).listener)
      .post('/auth/token')
      .send({
        code,
      });
    
    expect(res.body.token).toBeDefined();
    const decoded = jwt.decode(res.body.token);
    expect(decoded.patient.providerId).toEqual(patient.providerId);
  });

});