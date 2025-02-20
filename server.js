require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail
        pass: process.env.GMAIL_PASS, // Your App Password
    },
});

// ✅ Route to send PIR Motion Detected email
app.get('/send-message', async (req, res) => {
    const { email } = req.query;
    const timestamp = new Date().toLocaleString(); // Get current date & time

    // 🔍 Validate the email parameter
    if (!email) {
        return res.status(400).send('❌ Missing required query parameter: email.');
    }

    // 📌 PIR Sensor Motion Detected Email Template
    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: linear-gradient(135deg, #ffebee, #ffcdd2); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
            <h1 style="color: #d32f2f; margin-bottom: 20px;">🚨 Motion Detected!</h1>
            <p style="font-size: 18px; color: #444; margin-bottom: 10px;">
                The PIR sensor has detected motion in the monitored area.
            </p>
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
                Please check the area immediately for any unusual activity.
            </p>
            <div style="margin: 20px auto; padding: 10px; background: #ff5252; color: white; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                📅 Detected on: ${timestamp}
            </div>
            <p style="font-size: 14px; color: #777; margin-top: 20px;">
                This is an automated alert from your PIR sensor system.
            </p>
        </div>
    `;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email, // Receiver's email from query param
        subject: '🚨 PIR Sensor Motion Detected!',
        html: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Motion alert email sent to ${email} at ${timestamp}`);
        res.send(`✅ Motion alert email sent successfully to ${email}.`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).send('❌ Failed to send motion alert email.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
