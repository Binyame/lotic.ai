// @ts-ignore
import sgMail from '@sendgrid/mail';
import emailService from '../../services/email';


jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn()
  };
});


describe('Services - Email Service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send a plain text email', async () => {
    const success = 'send success';
    (sgMail.send as jest.Mock).mockResolvedValueOnce(success as any);

    await emailService.sendPlainText({
      to: 'text@example.com',
      from: 'no-reply@example.com',
      subject: 'Plain Text Email',
      text: 'This is a body.'
    });

    expect(sgMail.send).toBeCalledWith({
      to: 'text@example.com',
      from: 'no-reply@example.com',
      subject: 'Plain Text Email',
      text: 'This is a body.',
      mail_settings: {
        sandbox_mode: {
          enable: true,
        }
      }
    });
  });

  it('should send an HTML email', async () => {
    const success = 'send success';
    (sgMail.send as jest.Mock).mockResolvedValueOnce(success);

    await emailService.sendHTML({
      to: 'text@example.com',
      from: 'no-reply@example.com',
      subject: 'HTML Email',
      template: 'template.html',
      context: { name: 'Jeff' },
    });

    expect(sgMail.send).toBeCalledWith({
      to: 'text@example.com',
      from: 'no-reply@example.com',
      subject: 'HTML Email',
      text: 'Hello Jeff.',
      html: `<p>Hello Jeff.</p>
`, // husky adds a new line
      mail_settings: {
        sandbox_mode: {
          enable: true,
        }
      }
    });
  });

  it('should send an MJML email', async () => {
    const success = 'send success';
    (sgMail.send as jest.Mock).mockResolvedValueOnce(success);

    await emailService.sendMJML({
      to: 'text@example.com',
      from: 'no-reply@example.com',
      subject: 'MJML Email',
      template: 'template.mjml',
      context: { name: 'Jeff' },
    });

    expect(sgMail.send).toBeCalledWith({
      to: 'text@example.com',
      from: 'no-reply@example.com',
      subject: 'MJML Email',
      text: 'Hello Jeff.',
      html: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
          body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
          table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
          img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
          p { display:block;margin:13px 0; }</style><!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]--><!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]--><style type="text/css">@media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }</style><style type="text/css"></style></head><body><div><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td style="font-size:0px;padding:10px 25px;word-break:break-word;"><p style="border-top:solid 4px #F45E43;font-size:1px;margin:0px auto;width:100%;"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #F45E43;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]--></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:#F45E43;">Hello Jeff.</div></td></tr></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>`,
      mail_settings: {
        sandbox_mode: {
          enable: true,
        }
      }
    });
  });

  it('should throw if template is not found', async () => {
    const success = 'send success';
    (sgMail.send as jest.Mock).mockResolvedValueOnce(success);

    expect(emailService.sendHTML({
      to: 'text@example.com',
      from: 'no-reply@example.com',
      subject: 'HTML Email',
      template: 'i-am-not-a-template.html',
      context: { name: 'Jeff' },
    })).rejects.toThrow();

  })
});
