import moment from 'moment';
import db from '../../../models';
import emailService from '../../email';
import type { QueueJobDefinitionType } from '../types';

export const patientInviteEmail: QueueJobDefinitionType = {
  queue: 'patientInviteEmail',
  concurrency: 5,
  job: async ({ data }) => {
    const { clinicianId, patientName, deliveryAddress } = data;
    console.log('DATA', data);
    console.log('===========================');
    console.log(clinicianId);
    if (!clinicianId) {
      throw new Error('Missing clinicianId.');
    }

    if (!patientName) {
      throw new Error('Missing patientName.');
    }

    if (!deliveryAddress) {
      throw new Error('Missing deliveryAddress.');
    }

    const clinician = await db.Clinician.findByPk(clinicianId, {
      include: [db.Profile],
    });

    if (!clinician) {
      throw new Error('Clinician not found.');
    }

    const careTeamCode = await db.CareTeamCode.create({
      clinicianId: clinician.id,
      patientName,
      method: 'email',
      deliveryAddress,
      expiry: moment(new Date()).add(1, 'day').toDate(),
    });

    const clinicianName = clinician?.Profile?.name || 'Your doctor';

    const emailOptions = {
      from: 'dev+lotic@take2.co',
      to: deliveryAddress,
      subject: `${patientName}, ${clinicianName} has invited you to Lotic.ai`,
      template: 'patientInvite.mjml',
      context: {
        patientName,
        clinicianName,
        code: careTeamCode.code,
        expiry: moment(careTeamCode.expiry).format(
          'dddd, MMM Do YYYY [at] h:mma'
        ),
      },
    };

    try {
      await emailService.sendMJML(emailOptions);
      console.log('finished');
    } catch (e) {
      console.log('EMAIL ERROR');
      try {
        console.log(JSON.stringify(e));
      } catch (_e) {
        console.log(e);
      }
      throw new Error('Failed to send email');
    }
  },
};
