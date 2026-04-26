const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection pool (uncomment to connect to actual MySQL)
/*
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'credit_score_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
*/

// Basic test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Mock Authentication
app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    // In a real app, verify against database
    res.json({ token: 'mock-jwt-token', user: { email, role } });
});

// Mock Applicants Data
app.get('/api/applicants', (req, res) => {
    res.json([
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', score: 750, status: 'Approved' },
        { id: 2, name: 'Bob Johnson', email: 'bob@example.com', score: 620, status: 'Pending' },
    ]);
});

// Mail setup
let transporter;
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }
    console.log('Credentials obtained, listening on the web frontend');
    
    // Create a SMTP transporter object
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
});

app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        let message = {
            from: 'CredScore <no-reply@credscore.ai>',
            to: email,
            subject: 'Password Reset Request',
            text: `Hello,\n\nYou requested a password reset. Click the link below to reset your password:\n\nhttp://localhost:5173/reset-password\n\nIf you did not request this, please ignore this email.`,
            html: `<p>Hello,</p><p>You requested a password reset. Click the link below to reset your password:</p><p><a href="http://localhost:5173/reset-password">Reset Password</a></p><p>If you did not request this, please ignore this email.</p>`
        };

        let info = await transporter.sendMail(message);
        
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('Preview URL: %s', previewUrl);

        res.json({ message: 'Password reset email sent successfully', previewUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
