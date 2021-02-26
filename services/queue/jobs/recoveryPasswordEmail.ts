import db from '../../../models';
import emailService from '../../email';
import type { QueueJobDefinitionType } from '../types';

export const recoveryPasswordEmail: QueueJobDefinitionType = {
  queue: 'recoveryPasswordEmail',
  concurrency: 5,
  job: async ({ data }) => {
    const { email, code } = data;
    if (!email) {
      throw new Error('Missing Email.');
    }

    const clinician = await db.Clinician.findOne({
      where: { providerId: email },
      include: [db.Profile],
    });

    if (!clinician) {
      throw new Error('Clinician not found.');
    }

    const clinicianName = clinician?.Profile?.name || 'Doctor';

    const emailOptions = {
      from: 'dev+lotic@take2.co',
      to: email,
      subject: `Reset password code from Lotic.ai`,
      template: 'forgotPassword.mjml',
      context: {
        clinicianName,
        code,
      },
    };
    try {
      await emailService.sendMJML(emailOptions);
      console.log(`Reset password code sent to ${email} successfully !`);
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
