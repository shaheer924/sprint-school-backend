import nodemailer from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'


class Email {
    transporter

    constructor() {

        this.transporter = nodemailer.createTransport(nodemailerSendgrid({
            apiKey: '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'
        }));

    }

    emailSend = async (from, to, subject, text, html) => {
        return this.transporter.sendMail({
            to,
            from: 'developer@retrocube.com',
            subject,
            text,
            html:text
        })
    }

    userVerificationEmail = async (to, otp) => {
        let html = `<h1>Verification Code</h1><h3>${otp}</h3><p>If you didn't request this, you can ignore this email<br/>Thanks,<br/>Insight</p>`
        return this.emailSend("syedshaheer0331@gmail.com", to, `OTP VERIFICATION EMAIL`, html)
    }

    contactAdmin = async (to, from, message, phone, subject) => {
        let html = `<h1>Contact Us</h1><h3>From: ${from}</h3><br/><h3>Subject: ${subject}</h3><br/><h3>Phone: ${phone}</h3><br/><p>${message}<br/>Thanks,<br/>Taimoor</p>`
        return this.emailSend("syedshaheer0331@gmail.com", to, `OTP VERIFICATION EMAIL`, html)
    }

    resetPasswordOtp = async (to, otp) => {
        let html = `<h1>Reset Password Code</h1><h3>${otp}</h3><p>If you didn't request this, you can ignore this email<br/>Thanks,<br/>Taimoor</p>`
        return this.emailSend("syedshaheer0331@gmail.com", to, `RESET PASSWORD CODE`, html)
    }

    sendInvitation = async (to, img_url) => {
        let html = `<h1>You've been invited in a wedding</h1><img src="${img_url}" alt="invitation card image"></p>`
        return this.emailSend("syedshaheer0331@gmail.com", to, `RESET PASSWORD CODE`, html)
    }
}

export default new Email()