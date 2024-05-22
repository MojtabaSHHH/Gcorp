import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: `<p>برای تغییر رمز عبور خود، روی لینک زیر کلیک کنید:</p>
           <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>`,
  };

  await transporter.sendMail(mailOptions);
};
