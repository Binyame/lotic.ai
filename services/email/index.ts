import fs from 'fs';
import util from 'util';
import { template as Template } from 'lodash';
import { fromString } from 'html-to-text';
import mjml2html from 'mjml';

import SendGridAdapter from './adapters/sendGrid';

const readFile = util.promisify(fs.readFile);

export class EmailService {
  adapter: any;

  constructor(adapter, options) {
    if (!adapter) {
      throw new Error('Cannot construct without adapter.');
    }

    this.adapter = new adapter(options);
  }

  async sendPlainText(options) {
    return this.adapter.sendEmail(options);
  }

  async sendHTML(options) {
    const context = options.context;
    const template = options.template;

    if (!template) {
      throw new Error('Template is required for HTML email.');
    }

    const templateString = (
      await readFile(`services/email/templates/${template}`)
    ).toString();
    const compile = Template(templateString);
    const html = compile(context);
    const text = fromString(html);

    const { from, to, subject } = options;

    return this.adapter.sendEmail({
      from,
      to,
      subject,
      html,
      text,
    });
  }

  async sendMJML(options) {
    const template = options.template;
    const context = options.context;

    if (!template) {
      throw new Error('Template is required for MJML email.');
    }

    const templateString = (
      await readFile(`services/email/templates/${template}`)
    ).toString();
    const { html: baseHtml } = mjml2html(templateString, { minify: true });
    const compile = Template(baseHtml);
    const html = compile(context);
    const text = fromString(html);

    const { from, to, subject } = options;

    return this.adapter.sendEmail({
      from,
      to,
      subject,
      html,
      text,
    });
  }
}

const service = new EmailService(SendGridAdapter, {});

export default service;
