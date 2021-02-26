import { factory, db, query, mutate, formMutate, request } from '../utils';

import FileStoreFactory from '../../services/fileStore';
import { AdapterType } from '../../services/fileStore/types';
import { createReadStream } from 'fs';
import { resolve } from 'path';

// TODO: Skipping these tests until correct ACL is in place.
// Patients should only be able to stream their own video
// Clinicians should only be able to stream videos:
// - For patients they are related to through PatientClinician AND ONLY IF
// - The patient has shared the moment with the clinician via MomentShare
describe.skip('Integration - StreamVideo', () => {
  let record;
  let patientId;

  beforeAll(async () => {
    const attrs = await factory.attrs('Moment');
    const fileStore = FileStoreFactory({}, AdapterType.FS);
    const filename = `TEST-${attrs.uuid}.mp4`;
    const fileDescriptor = await fileStore.store(
      createReadStream(resolve(__dirname, '../assets/video_sample.mp4')),
      filename
    );

    record = await factory.create('Moment', {
      uuid: attrs.uuid,
      uri: fileDescriptor.uri,
    });

    patientId = (await record.getPatient()).id;

    const opts = { momentUuid: record.uuid };
    await factory.create('MomentPrompt', opts);
  });

  describe('Anonymous', () => {
    it('should not stream a video', async () => {
      const requestUrl = `/assets/patient/${patientId}/${record.uuid}`;

      const res = await request((global as any).listener)
        .get(requestUrl)
        .expect(403);
    });
  });

  describe('LoticUser: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      token = await usr.token();
    });

    it('should not stream a video', async () => {
      const requestUrl = `/assets/patient/${patientId}/${record.uuid}`;

      const res = await request((global as any).listener)
        .get(requestUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('Clinician: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      token = await usr.token();
    });

    it('should not stream a video', async () => {
      const requestUrl = `/assets/patient/${patientId}/${record.uuid}`;

      const res = await request((global as any).listener)
        .get(requestUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('Patient: without Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Patient');
      token = await usr.token();
    });

    it('should not stream a video', async () => {
      const requestUrl = `/assets/patient/${patientId}/${record.uuid}`;

      const res = await request((global as any).listener)
        .get(requestUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('LoticUser: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('LoticUser');
      await usr.addPermissions([
        'moment.list',
        'moment.read',
        'moment.create',
        'moment.update',
        'moment.destroy',
      ]);
      token = await usr.token();
    });

    it('should NOT stream a video', async () => {
      const requestUrl = `/assets/patient/${patientId}/${record.uuid}`;

      const res = await request((global as any).listener)
        .get(requestUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('Clinician: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await factory.create('Clinician');
      await usr.addPermissions([
        'moment.list',
        'moment.read',
        'moment.create',
        'moment.update',
        'moment.destroy',
      ]);
      token = await usr.token();
    });

    it('should NOT stream a video', async () => {
      const requestUrl = `/assets/patient/${patientId}/${record.uuid}`;

      const res = await request((global as any).listener)
        .get(requestUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('Patient: with Permissions', () => {
    let token;

    beforeAll(async () => {
      const usr = await record.getPatient();
      await usr.addPermissions([
        'moment.list',
        'moment.read',
        'moment.create',
        'moment.update',
        'moment.destroy',
      ]);
      token = await usr.token();
    });

    it('should stream a video', async () => {
      const requestUrl = `/assets/patient/${patientId}/${record.uuid}`;

      const res = await request((global as any).listener)
        .get(requestUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Buffer);
    });
  });
});
