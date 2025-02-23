require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json()); // Middleware to parse JSON body

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
    const timestamp = new Date().toLocaleString();

    if (!email) {
        return res.status(400).send('❌ Missing required query parameter: email.');
    }

    // 🔔 PIR Sensor Motion Detected Email Template
    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: linear-gradient(135deg, #ffebee, #ffcdd2); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
            <h1 style="color: #d32f2f; margin-bottom: 20px;">🚨 Motion Detected!</h1>
            <p style="font-size: 18px; color: #444;">
                The PIR sensor has detected motion in the monitored area.
            </p>
            <div style="margin: 20px auto; padding: 10px; background: #ff5252; color: white; border-radius: 5px; font-size: 16px; font-weight: bold;">
                📅 Detected on: ${timestamp}
            </div>
            <p style="font-size: 14px; color: #777;">This is an automated alert from your PIR sensor system.</p>
        </div>
    `;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
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

// ✅ New Route: Send ESP32 Local IP Address via Email
app.post('/send-ip', async (req, res) => {
    const { ip_address } = req.body;
    const email = req.query.email; // Get email from query parameters
    const timestamp = new Date().toLocaleString();

    if (!ip_address || !email) {
        return res.status(400).send('❌ Missing required fields: ip_address or email.');
    }

    // 📌 Email Template
    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
            <h1 style="color: #1565c0; margin-bottom: 20px;">📡 ESP32 Connected!</h1>
            <p style="font-size: 18px; color: #444;">
                Your ESP32 has successfully connected to the network.
            </p>
            <p style="font-size: 16px; color: #555;">
                Below is the local IP address assigned to the ESP32:
            </p>
            <div style="margin: 20px auto; padding: 10px; background: #1e88e5; color: white; border-radius: 5px; font-size: 18px; font-weight: bold;">
                🌐 Local IP: ${ip_address}
            </div>
            <div style="margin: 10px auto; padding: 10px; background: #0d47a1; color: white; border-radius: 5px; font-size: 16px;">
                📅 Detected on: ${timestamp}
            </div>
            <p style="font-size: 14px; color: #777;">This is an automated email from your ESP32 system.</p>
        </div>
    `;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email, // Custom email from query parameter
        subject: '📡 ESP32 Local IP Address',
        html: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ ESP32 IP email sent to ${email}: ${ip_address} at ${timestamp}`);
        res.send(`✅ ESP32 IP email sent successfully to ${email}.`);
    } catch (error) {
        console.error('❌ Error sending ESP32 IP email:', error);
        res.status(500).send('❌ Failed to send ESP32 IP email.');
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
