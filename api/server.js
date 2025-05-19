import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, budget, timeframe, description } = req.body;

  const adminMsg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.EMAIL_FROM,
    subject: 'New Booking Request - Revan Labs',
    html: `
      <h1>New Call Booking Request</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Budget Range:</strong> ${budget}</p>
      <p><strong>Project Timeframe:</strong> ${timeframe}</p>
      <p><strong>Project Description:</strong> ${description}</p>
    `,
  };

  const clientMsg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Thank you for booking a call with Revan Labs',
    html: `
      <h1>Thank You for Booking a Call</h1>
      <p>Dear ${name},</p>
      <p>We've received your request and we'll be in touch shortly to schedule a call.</p>
      <p>Here's a summary of your request:</p>
      <ul>
        <li><strong>Budget Range:</strong> ${budget}</li>
        <li><strong>Project Timeframe:</strong> ${timeframe}</li>
      </ul>
      <p>If you have any questions in the meantime, please feel free to reply to this email.</p>
      <p>Best regards,<br />The Revan Labs Team</p>
    `,
  };

  try {
    console.log('Sending emails via SendGrid...');
    await sgMail.send(adminMsg);
    await sgMail.send(clientMsg);
    console.log('Emails sent.');

    return res.status(200).json({ message: 'Booking request submitted successfully' });
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message);
    return res.status(500).json({
      message: 'Error sending booking request',
      error: error.message,
    });
  }
}
