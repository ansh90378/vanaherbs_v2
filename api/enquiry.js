export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.EMAIL_TO;
    const fromEmail = process.env.EMAIL_FROM || 'VanaHerbs <onboarding@resend.dev>';

    if (!apiKey || !toEmail) {
      return res.status(500).json({
        error: 'Email service is not configured.'
      });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const html = `
      <h2>New enquiry from VanaHerbs</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <p><strong>Logged-in user email:</strong> ${loggedInUserEmail}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Product:</strong> ${product}</p>
      <p><strong>Requirement:</strong></p>
      <p>${(message || 'No message provided').replace(/\n/g, '<br>')}</p>
    `;

    const data = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: loggedInUserEmail,
      subject: `New enquiry: ${product} from ${name}`,
      html
    });

    return res.status(200).json({
      success: true,
      id: data?.id || null
    });

  } catch (error) {
    console.error('Enquiry email failed:', error);
    return res.status(500).json({
      error: 'Failed to send enquiry email.'
    });
  }
}