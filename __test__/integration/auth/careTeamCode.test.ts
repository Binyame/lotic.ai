import { request, factory } from '../../utils';

describe('ROUTE - /auth/careTeamCode/:code', () => {

  test('returns the careTeamCode', async () => {
    const expiry = new Date();
    expiry.setTime(expiry.getTime()+60000);

    const careTeamCode = await factory.create('CareTeamCode', {
      expiry
    });

    const res = await request((global as any).listener)
      .get(`/auth/careTeamCode/${careTeamCode.code}`)
      .send();

    expect(res.body).toBeDefined();
    expect(res.body.careTeamCode.id).toEqual(careTeamCode.id);
  });

  test('handles not found careTeamCode', async () => {
    const res = await request((global as any).listener)
      .get(`/auth/careTeamCode/badCode`)
      .send();

    expect(res.status).toEqual(404)
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual('No careTeam code found');
  });

  test('handles careTeam code expired', async () => {
    const careTeamCode = await factory.create('CareTeamCode');

    const res = await request((global as any).listener)
      .get(`/auth/careTeamCode/${careTeamCode.code}`)
      .send();

    expect(res.status).toEqual(400)
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual('CareTeam code expired');
  });

  test('handles careTeam code has already been used', async () => {
    const expiry = new Date();
    expiry.setTime(expiry.getTime()+60000);

    const careTeamCode = await factory.create('CareTeamCode', {
      expiry, usedOn: expiry
    });

    const res = await request((global as any).listener)
      .get(`/auth/careTeamCode/${careTeamCode.code}`)
      .send();

    expect(res.status).toEqual(400)
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual('CareTeam code has already been used');
  });

});