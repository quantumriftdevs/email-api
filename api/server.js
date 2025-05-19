import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // ✅ Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, budget, timeframe, description } = req.body;

  const adminMsg = {
  to: process.env.ADMIN_EMAIL,
  from: process.env.EMAIL_FROM,
  subject: 'New Booking Request - Revan Labs',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #121212; color: #eee;">
      <div style="max-width: 600px; margin: auto; background: #1e1e1e; padding: 24px; border-radius: 10px; border: 1px solid #333;">
        <h2 style="color: #b36bff; border-bottom: 1px solid #333; padding-bottom: 10px;">📞 New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Timeframe:</strong> ${timeframe}</p>
        <p><strong>Description:</strong><br>${description}</p>
        <p style="margin-top: 30px; font-size: 12px; color: #aaa;">This message was sent automatically by Revan Labs</p>
      </div>
    </div>
  `,
};


  const clientMsg = {
  to: email,
  from: process.env.EMAIL_FROM,
  subject: 'Thanks for Booking a Call with Revan Labs',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #121212; color: #f0f0f0;">
      <div style="max-width: 600px; margin: auto; background: #1e1e1e; padding: 30px; border-radius: 12px; border: 1px solid #2b2b2b;">
        <h1 style="color: #b36bff;">🎉 Thank You, ${name}!</h1>
        <p style="font-size: 15px;">We've received your booking request and will contact you soon to schedule your call with Revan Labs.</p>

        <h3 style="margin-top: 25px; color: #b36bff;">📋 Your Submission:</h3>
        <ul style="list-style: none; padding-left: 0; color: #ddd;">
          <li><strong>Budget:</strong> ${budget}</li>
          <li><strong>Timeframe:</strong> ${timeframe}</li>
        </ul>

        <p style="margin-top: 20px;">If you have any questions before our call, just reply to this email.</p>

        <div style="margin-top: 40px; font-size: 13px; color: #888;">
          — The Revan Labs Team
        </div>
      </div>
    </div>
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
