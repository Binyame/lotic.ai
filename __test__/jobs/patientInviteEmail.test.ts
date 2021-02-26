import moment from 'moment';
import { db, factory } from '../utils';
import { patientInviteEmail } from '../../services/queue/jobs/patientInviteEmail';
const job = patientInviteEmail.job;
import emailService from '../../services/email';

describe('Job - patientInviteEmail', () => {
  let spy;

  afterEach(() => {
    jest.restoreAllMocks();
    spy = null;
  });

  it('should send a patient invite email', async () => {
    const spy = jest
      .spyOn(emailService, 'sendMJML')
      .mockImplementation(() => Promise.resolve('ok'));

    const clinician = await factory.create('Clinician');
    const profile = await factory.create('Profile', {
      targetType: 'clinician',
      targetId: clinician.id,
    });
    const patientName = `Patient for ${clinician.id}`;
    const deliveryAddress = `patient_for_${clinician.id}@example.com`;

    await job({
      data: { clinicianId: clinician.id, patientName, deliveryAddress },
    });

    const codes = await db.CareTeamCode.findAll({ where: { patientName } });
    expect(codes.length).toEqual(1);
    expect(codes[0].patientName).toEqual(patientName);

    expect(emailService.sendMJML).toHaveBeenCalledTimes(1);
    expect(emailService.sendMJML).toHaveBeenCalledWith({
      from: 'dev+lotic@take2.co',
      to: deliveryAddress,
      subject: `${patientName}, ${profile.name} has invited you to Lotic.ai`,
      template: 'patientInvite.mjml',
      context: {
        patientName,
        clinicianName: profile.name,
        code: codes[0].code,
        expiry: moment(codes[0].expiry).format('dddd, MMM Do YYYY [at] h:mma'),
      },
    });
  });
});
