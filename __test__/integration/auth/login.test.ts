import jwt from 'jsonwebtoken';
import { request, factory } from '../../utils';

describe('Login', () => {
  describe('ROUTE - /auth/patient/login', () => {
    
    test('should log in a patient', async () => {
      const patient = await factory.create('Patient', {
        providerKey: 'password1234',
      });

      const res = await request((global as any).listener)
        .post('/auth/patient/login')
        .send({
          providerId: patient.providerId,
          providerKey: 'password1234'
        });
      
      expect(res.body.success).toEqual(true);
      expect(res.body.token).toBeDefined();
      const decoded = jwt.decode(res.body.token);
      expect(decoded.patient.providerId).toEqual(patient.providerId);
    });

    test('should NOT log in a patient with a bad password', async () => {
      const patient = await factory.create('Patient', {
        providerKey: 'password1234',
      });

      const res = await request((global as any).listener)
        .post('/auth/patient/login')
        .send({
          providerId: patient.providerId,
          providerKey: 'badpassword'
        });
      
      expect(res.body.success).toEqual(false);
    });

    test('should handle patient not found', async () => {
      const res = await request((global as any).listener)
        .post('/auth/patient/login')
        .send({
          providerId: 'iamnotfound@example.com',
          providerKey: 'password1234'
        });
      
      expect(res.body.success).toEqual(false);
    });

  });

  describe('ROUTE - /auth/clinician/login', () => {
      
    test('should log in a clinician', async () => {
      const clinician = await factory.create('Clinician', {
        providerKey: 'password1234',
      });

      const res = await request((global as any).listener)
        .post('/auth/clinician/login')
        .send({
          providerId: clinician.providerId,
          providerKey: 'password1234'
        });
      
      expect(res.body.success).toEqual(true);
      expect(res.body.token).toBeDefined();
      const decoded = jwt.decode(res.body.token);
      expect(decoded.clinician.providerId).toEqual(clinician.providerId);
    });

    test('should NOT log in a clinician with a bad password', async () => {
      const clinician = await factory.create('Clinician', {
        providerKey: 'password1234',
      });

      const res = await request((global as any).listener)
        .post('/auth/clinician/login')
        .send({
          providerId: clinician.providerId,
          providerKey: 'badpassword'
        });
      
      expect(res.body.success).toEqual(false);
    });

    test('should handle clinician not found', async () => {
      const res = await request((global as any).listener)
        .post('/auth/clinician/login')
        .send({
          providerId: 'iamnotfound@example.com',
          providerKey: 'password1234'
        });
      
      expect(res.body.success).toEqual(false);
    });

  });

  describe('ROUTE - /auth/lotic/login', () => {
      
    test('should log in a loticUser', async () => {
      const loticUser = await factory.create('LoticUser', {
        providerKey: 'password1234',
      });

      const res = await request((global as any).listener)
        .post('/auth/lotic/login')
        .send({
          providerId: loticUser.providerId,
          providerKey: 'password1234'
        });
      
      expect(res.body.success).toEqual(true);
      expect(res.body.token).toBeDefined();
      const decoded = jwt.decode(res.body.token);
      expect(decoded.loticUser.providerId).toEqual(loticUser.providerId);
    });

    test('should NOT log in a loticUser with a bad password', async () => {
      const loticUser = await factory.create('LoticUser', {
        providerKey: 'password1234',
      });

      const res = await request((global as any).listener)
        .post('/auth/lotic/login')
        .send({
          providerId: loticUser.providerId,
          providerKey: 'badpassword'
        });
      
      expect(res.body.success).toEqual(false);
    });

    test('should handle loticUser not found', async () => {
      const res = await request((global as any).listener)
        .post('/auth/lotic/login')
        .send({
          providerId: 'iamnotfound@example.com',
          providerKey: 'password1234'
        });
      
      expect(res.body.success).toEqual(false);
    });

  });

})

