// // export default async function handler(req, res) {
// //   if (req.method !== 'POST') {
// //     return res.status(405).json({ error: 'Method not allowed' });
// //   }

// //   try 
// //   {
// //     const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
// //     const {
// //       name,
// //       company = '',
// //       email,
// //       phone = '',
// //       product,
// //       message = '',
// //       user_email
// //     } = body;

// //     const rawProduct = body.product;
// //     const productList = Array.isArray(rawProduct)
// //     ? rawProduct
// //     : rawProduct
// //         ? [rawProduct]
// //         : [];

// //     if (!productList.length) {
// //     return res.status(400).json({ error: 'Please select at least one product.' });
// //     }

// //     const productText = productList.join(', ');

// //     if (!name || !product) {
// //       return res.status(400).json({
// //         error: 'Name and product are required.'
// //       });
// //     }

// //     const loggedInUserEmail = typeof user_email === 'string' ? user_email.trim() : '';

// //     if (!loggedInUserEmail) {
// //       return res.status(401).json({
// //         error: 'Please log in before sending an enquiry.'
// //       });
// //     }

// //     const apiKey = process.env.RESEND_API_KEY;
// //     const toEmail = process.env.EMAIL_TO;
// //     const fromEmail = process.env.EMAIL_FROM || 'VanaHerbs <onboarding@resend.dev>';

// //     if (!apiKey || !toEmail) {
// //       return res.status(500).json({
// //         error: 'Email service is not configured.'
// //       });
// //     }

// //     const { Resend } = await import('resend');
// //     const resend = new Resend(apiKey);

// //     const html = `
// //       <h2>New enquiry from VanaHerbs</h2>
// //       <p><strong>Name:</strong> ${name}</p>
// //       <p><strong>Company:</strong> ${company || 'Not provided'}</p>
// //       <p><strong>Logged-in user email:</strong> ${loggedInUserEmail}</p>
// //       <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
// //       <p><strong>Product:</strong> ${productText}</p>
// //       <p><strong>Requirement:</strong></p>
// //       <p>${(message || 'No message provided').replace(/\n/g, '<br>')}</p>
// //     `;

// //     const data = await resend.emails.send({
// //       from: fromEmail,
// //       to: [toEmail],
// //       replyTo: loggedInUserEmail,
// //       subject: `New enquiry: ${product} from ${name}`,
// //       html
// //     });

// //     return res.status(200).json({
// //       success: true,
// //       id: data?.id || null
// //     });

// //   } 
// //   catch (error) 
// //   {
// //     console.error('Enquiry email failed:', error);
// //     return res.status(500).json({
// //       error: 'Failed to send enquiry email.'
// //     });
// //   }
// // }

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try 
//   {
//     const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
//     const {
//       name,
//       company = '',
//       email,
//       phone = '',
//       product,
//       message = '',
//       user_email
//     } = body;

//     const rawProduct = body.product;
//     const productList = Array.isArray(rawProduct)
//     ? rawProduct
//     : rawProduct
//         ? [rawProduct]
//         : [];

//     if (!productList.length) {
//     return res.status(400).json({ error: 'Please select at least one product.' });
//     }

//     const productText = productList.join(', ');

//     if (!name || !product) {
//       return res.status(400).json({
//         error: 'Name and product are required.'
//       });
//     }

//     const loggedInUserEmail = typeof user_email === 'string' ? user_email.trim() : '';

//     if (!loggedInUserEmail) {
//       return res.status(401).json({
//         error: 'Please log in before sending an enquiry.'
//       });
//     }

//     const smtpHost = process.env.SMTP_HOST;
//     const smtpPort = Number(process.env.SMTP_PORT || 587);
//     const smtpUser = process.env.SMTP_USER;
//     const smtpPass = process.env.SMTP_PASS;
//     const toEmail = process.env.EMAIL_TO;
//     const fromEmail = process.env.EMAIL_FROM || smtpUser;

//     if (!smtpHost || !smtpUser || !smtpPass || !toEmail) {
//       return res.status(500).json({
//         error: 'Email service is not configured.'
//       });
//     }

//     const nodemailer = await import('nodemailer');
//     const transporter = nodemailer.createTransport({
//       host: smtpHost,
//       port: smtpPort,
//       secure: smtpPort === 465, // true for port 465, false for 587/25 (STARTTLS)
//       auth: {
//         user: smtpUser,
//         pass: smtpPass
//       }
//     });

//     const html = `
//       <h2>New enquiry from VanaHerbs</h2>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Company:</strong> ${company || 'Not provided'}</p>
//       <p><strong>Logged-in user email:</strong> ${loggedInUserEmail}</p>
//       <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
//       <p><strong>Product:</strong> ${productText}</p>
//       <p><strong>Requirement:</strong></p>
//       <p>${(message || 'No message provided').replace(/\n/g, '<br>')}</p>
//     `;

//     let info;
//     try {
//       info = await transporter.sendMail({
//         from: fromEmail,
//         to: toEmail,
//         replyTo: loggedInUserEmail,
//         subject: `New enquiry: ${product} from ${name}`,
//         html
//       });
//     } catch (smtpError) {
//       console.error('SMTP send failed:', smtpError);
//       return res.status(502).json({
//         error: smtpError.message || 'Email provider rejected the send.'
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       id: info?.messageId || null
//     });

//   } 
//   catch (error) 
//   {
//     console.error('Enquiry email failed:', error);
//     return res.status(500).json({
//       error: 'Failed to send enquiry email.'
//     });
//   }
// }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try 
  {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      name,
      company = '',
      email,
      phone = '',
      product,
      message = '',
      user_email
    } = body;

    const rawProduct = body.product;
    const productList = Array.isArray(rawProduct)
    ? rawProduct
    : rawProduct
        ? [rawProduct]
        : [];

    if (!productList.length) {
    return res.status(400).json({ error: 'Please select at least one product.' });
    }

    const productText = productList.join(', ');

    if (!name || !product) {
      return res.status(400).json({
        error: 'Name and product are required.'
      });
    }

    const loggedInUserEmail = typeof user_email === 'string' ? user_email.trim() : '';

    if (!loggedInUserEmail) {
      return res.status(401).json({
        error: 'Please log in before sending an enquiry.'
      });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const toEmail = process.env.EMAIL_TO;
    const fromEmail = process.env.EMAIL_FROM || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass || !toEmail) {
      return res.status(500).json({
        error: 'Email service is not configured.'
      });
    }

    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for port 465, false for 587/25 (STARTTLS)
      requireTLS: smtpPort !== 465, // SES rejects unencrypted connections on 587
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const html = `
      <h2>New enquiry from VanaHerbs</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <p><strong>Logged-in user email:</strong> ${loggedInUserEmail}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Product:</strong> ${productText}</p>
      <p><strong>Requirement:</strong></p>
      <p>${(message || 'No message provided').replace(/\n/g, '<br>')}</p>
    `;

    let info;
    try {
      info = await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        replyTo: loggedInUserEmail,
        subject: `New enquiry: ${product} from ${name}`,
        html
      });
    } catch (smtpError) {
      console.error('SMTP send failed:', smtpError);
      return res.status(502).json({
        error: smtpError.message || 'Email provider rejected the send.'
      });
    }

    return res.status(200).json({
      success: true,
      id: info?.messageId || null
    });

  } 
  catch (error) 
  {
    console.error('Enquiry email failed:', error);
    return res.status(500).json({
      error: 'Failed to send enquiry email.'
    });
  }
}