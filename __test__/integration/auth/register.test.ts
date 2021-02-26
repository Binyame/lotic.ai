import { request, factory, db } from '../../utils';
import Hashids from 'hashids/cjs';

const hashLength: number = parseInt(process.env.HASH_ID_LENGTH || '', 10);
const hashids = new Hashids(process.env.HASH_ID_SALT, hashLength);

const mockUpsertUser = jest.fn(() => ({ id: 123, token: () => 'sampletoken' }));
jest.mock('../../../services/user', () => {
  return jest.fn().mockImplementation(() => {
    return {
      upsertUser: mockUpsertUser,
    };
  });
});
describe('Register', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('ROUTE - /auth/patient/register', () => {
    test('should register a user', async () => {
      const { name } = await factory.attrs('Profile');
      const { providerId, providerKey } = await factory.attrs('Patient');
      const { id } = await factory.attrs('Agreement');
      const { id: clinicianId } = await factory.create('Clinician');

      const code = await factory.create('CareTeamCode', { clinicianId });

      const careTeamCode = {
        codeId: code.id,
        clinicianId: clinicianId,
      };

      const res = await request((global as any).listener)
        .post('/auth/patient/register')
        .send({
          name,
          providerId,
          providerKey,
          terms: [{ id, agreedAt: new Date() }],
          careTeamCode,
        });

      expect(res.body.success).toEqual(true);
      expect(res.body.token).toEqual('sampletoken');
      expect(mockUpsertUser).toHaveBeenCalled();
    });

    test('should handle missing name', async () => {
      const { providerId, providerKey } = await factory.attrs('Patient');
      const { id } = await factory.attrs('Agreement');
      const { id: clinicianId } = await factory.create('Clinician');

      const code = await factory.create('CareTeamCode', { clinicianId });

      const careTeamCode = {
        codeId: code.id,
        clinicianId: clinicianId,
      };

      const res = await request((global as any).listener)
        .post('/auth/patient/register')
        .send({
          providerKey,
          terms: [{ id, agreedAt: new Date() }],
          careTeamCode,
        });

      expect(res.body.jwt).toBeUndefined();
      expect(res.body.message).toEqual('Missing parameters');
      const record = await db.Patient.findOne({ where: { providerId } });
      expect(record).toBeNull();
    });

    test('should handle missing providerId', async () => {
      const { name } = await factory.attrs('Profile');
      const { providerId, providerKey } = await factory.attrs('Patient');
      const { id } = await factory.attrs('Agreement');
      const { id: clinicianId } = await factory.create('Clinician');

      const code = await factory.create('CareTeamCode', { clinicianId });

      const careTeamCode = {
        codeId: code.id,
        clinicianId: clinicianId,
      };

      const res = await request((global as any).listener)
        .post('/auth/patient/register')
        .send({
          name,
          providerKey,
          terms: [{ id, agreedAt: new Date() }],
          careTeamCode,
        });

      expect(res.body.jwt).toBeUndefined();
      expect(res.body.message).toEqual('Missing parameters');
      const record = await db.Patient.findOne({ where: { providerId } });
      expect(record).toBeNull();
    });

    test('should handle missing providerKey', async () => {
      const { name } = await factory.attrs('Profile');
      const { providerId } = await factory.attrs('Patient');
      const { id } = await factory.attrs('Agreement');
      const { id: clinicianId } = await factory.create('Clinician');

      const code = await factory.create('CareTeamCode', { clinicianId });

      const careTeamCode = {
        codeId: code.id,
        clinicianId: clinicianId,
      };

      const res = await request((global as any).listener)
        .post('/auth/patient/register')
        .send({
          name,
          providerId,
          terms: [{ id, agreedAt: new Date() }],
          careTeamCode,
        });

      expect(res.body.jwt).toBeUndefined();
      expect(res.body.message).toEqual('Missing parameters');
      const record = await db.Patient.findOne({ where: { providerId } });
      expect(record).toBeNull();
    });

    test('should handle missing terms', async () => {
      const { name } = await factory.attrs('Profile');
      const { providerId, providerKey } = await factory.attrs('Patient');
      const { id: clinicianId } = await factory.create('Clinician');

      const code = await factory.create('CareTeamCode', { clinicianId });

      const careTeamCode = {
        codeId: code.id,
        clinicianId: clinicianId,
      };

      const res = await request((global as any).listener)
        .post('/auth/patient/register')
        .send({
          name,
          providerId,
          providerKey,
          careTeamCode,
        });

      expect(res.body.success).toEqual(true);
      expect(res.body.token).toEqual('sampletoken');
      expect(mockUpsertUser).toHaveBeenCalled();
    });

    test('should handle missing careTeamCode', async () => {
      const { name } = await factory.attrs('Profile');
      const { providerId, providerKey } = await factory.attrs('Patient');
      const { id } = await factory.attrs('Agreement');

      const res = await request((global as any).listener)
        .post('/auth/patient/register')
        .send({
          name,
          providerId,
          providerKey,
          terms: [{ id, agreedAt: new Date() }],
        });

      expect(res.body.jwt).toBeUndefined();
      expect(res.body.message).toEqual('Missing parameters');
      const record = await db.Patient.findOne({ where: { providerId } });
      expect(record).toBeNull();
    });
  });

  describe('ROUTE - /auth/clinician/register', () => {
    test('should register a user', async () => {
      const { providerId, providerKey } = await factory.attrs('Clinician');
      const { id } = await factory.attrs('Agreement');

      const newHCProvider = await factory.create('HCProvider');
      const hashId = hashids.encode(newHCProvider.id);

      const res = await request((global as any).listener)
        .post('/auth/clinician/register')
        .send({
          providerId,
          providerKey,
          terms: [{ id, agreedAt: new Date() }],
          name: 'Dr. Geller',
          hashId,
        });

      expect(res.body.success).toEqual(true);
      expect(res.body.token).toEqual('sampletoken');
      expect(mockUpsertUser).toHaveBeenCalled();
    });

    test('should handle missing providerId', async () => {
      const { providerId, providerKey } = await factory.attrs('Clinician');
      const { id } = await factory.attrs('Agreement');

      const res = await request((global as any).listener)
        .post('/auth/clinician/register')
        .send({
          providerKey,
          terms: [{ id, agreedAt: new Date() }],
        });

      expect(res.body.jwt).toBeUndefined();
      expect(res.body.message).toEqual('Missing parameters');
      const record = await db.Clinician.findOne({ where: { providerId } });
      expect(record).toBeNull();
    });

    test('should handle missing providerKey', async () => {
      const { providerId } = await factory.attrs('Clinician');
      const { id } = await factory.attrs('Agreement');

      const res = await request((global as any).listener)
        .post('/auth/clinician/register')
        .send({
          providerId,
          terms: [{ id, agreedAt: new Date() }],
        });

      expect(res.body.jwt).toBeUndefined();
      expect(res.body.message).toEqual('Missing parameters');
      const record = await db.Clinician.findOne({ where: { providerId } });
      expect(record).toBeNull();
    });

    test('should handle missing terms', async () => {
      const { providerId, providerKey } = await factory.attrs('Clinician');

      const newHCProvider = await factory.create('HCProvider');
      const hashId = hashids.encode(newHCProvider.id);

      const res = await request((global as any).listener)
        .post('/auth/clinician/register')
        .send({
          providerId,
          providerKey,
          hashId,
        });

      expect(res.body.success).toEqual(true);
      expect(res.body.token).toEqual('sampletoken');
      expect(mockUpsertUser).toHaveBeenCalled();
    });

    test('should handle missing hashId', async () => {
      const { providerId, providerKey } = await factory.attrs('Clinician');
      const { id } = await factory.attrs('Agreement');

      const res = await request((global as any).listener)
        .post('/auth/clinician/register')
        .send({
          providerId,
          providerKey,
          name: 'Dr. Geller',
          terms: [{ id, agreedAt: new Date() }],
        });

      expect(res.body.message).toEqual('Missing parameters');
      const record = await db.Clinician.findOne({ where: { providerId } });
      expect(record).toBeNull();
    });
  });

  describe('ROUTE - /auth/lotic/register', () => {
    test('should register a user', async () => {
      const { providerId, providerKey } = await factory.attrs('LoticUser');

      const res = await request((global as any).listener)
        .post('/auth/lotic/register')
        .send({
          providerId,
          providerKey,
        });

      expect(res.body.success).toEqual(true);
      expect(res.body.token).toEqual('sampletoken');
      expect(mockUpsertUser).toHaveBeenCalled();
    });

    test('should handle missing providerId', async () => {
      const { providerId, providerKey } = await factory.attrs('LoticUser');

      const res = await request((global as any).listener)
        .post('/auth/lotic/register')
        .send({
          providerKey,
        });

      expect(res.body.jwt).toBeUndefined();
      expect(res.body.message).toEqual('Missing parameters');
      const record = await db.LoticUser.findOne({ where: { providerId } });
      expect(record).toBeNull();
    });

    test('should handle missing providerKey', async () => {
      const { providerId, providerKey } = await factory.attrs('LoticUser');

      const res = await request((global as any).listener)
        .post('/auth/lotic/register')
        .send({
          providerId,
        });

      expect(res.body.jwt).toBeUndefined();
      expect(res.body.message).toEqual('Missing parameters');
      const record = await db.LoticUser.findOne({ where: { providerId } });
      expect(record).toBeNull();
    });
  });
});
