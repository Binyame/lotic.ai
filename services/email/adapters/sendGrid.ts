import Joi from 'joi';
import sgMail from '@sendgrid/mail';
import config from '../../../config/config';

sgMail.setApiKey(config.email.sendGrid.apiKey as any);

const schema = Joi.object({
  to: Joi.string().email().required(),
  from: Joi.string().email().required(),
  subject: Joi.string().required(),
  text: Joi.string().required(),
  html: Joi.string(),
});

class SendGridAdapter {
  options: any;
  sgMail: any;

  constructor(options) {
    this.options = options;
    this.sgMail = sgMail;
  }

  sendEmail(options) {
    let mailOptions = {
      ...options,
    };

    schema.validate(mailOptions);

    if (config.environment !== 'production') {
      mailOptions.mail_settings = {
        sandbox_mode: {
          enable: true,
        },
      };
    }

    return this.sgMail.send(mailOptions);
  }
}

export default SendGridAdapter;
