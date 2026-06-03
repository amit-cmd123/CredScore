const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Models
const User = require('./models/User');
const Application = require('./models/Application');
const Notification = require('./models/Notification');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ====================================================
// MongoDB Connection
// ====================================================
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/credscore';
    await mongoose.connect(mongoURI);
    console.log(`Successfully connected to MongoDB at ${mongoURI}`);
    
    // Create default admin if not exists
    const adminExists = await User.findOne({ email: 'admin@credscore.com' });
    if (!adminExists) {
      await User.create({
        id: 'USR-ADMIN',
        name: 'Super Admin',
        email: 'admin@credscore.com',
        password: 'password123', // In a real app, hash this!
        role: 'Admin',
        phone: '+1 (555) 999-9999',
        location: 'Headquarters',
        income: '$150,000',
        employer: 'CredScore Inc.',
        activeLoans: 0
      });
      console.log('Default Super Admin created.');
    }
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    // Don't exit process if local mongo isn't running yet, let it retry or stay up
    console.warn('Is MongoDB running locally on port 27017?');
  }
};

// ====================================================
// Nodemailer SMTP Setup
// ====================================================
let transporter;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  console.log('Using SMTP credentials from environment variables for email sending.');
  
  const transportConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };

  if (process.env.SMTP_SERVICE) {
    transportConfig.service = process.env.SMTP_SERVICE;
    delete transportConfig.host;
    delete transportConfig.port;
  }

  transporter = nodemailer.createTransport(transportConfig);
  
  transporter.verify((error, success) => {
    if (error) console.error('SMTP Connection Failed:', error.message);
    else console.log('SMTP Transporter is ready.');
  });
} else {
  console.log('No SMTP credentials found. Ethereal fallback disabled for this demo.');
}

// ====================================================
// Express Routes - Auth & Users
// ====================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { id, name, email, password, role, phone, location, income, employer, activeLoans } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });
    
    const newUser = new User({
      id, name, email, password, role, phone, location, income, employer, activeLoans
    });
    
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ====================================================
// Express Routes - Applications
// ====================================================
app.get('/api/applications', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) query.userId = userId;
    
    const applications = await Application.find(query).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();
    
    // Update active loans if approved (simplified logic)
    if (req.body.status === 'Approved') {
      await User.findOneAndUpdate({ id: req.body.userId }, { $inc: { activeLoans: 1 } });
    }
    
    res.status(201).json(newApp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const app = await Application.findOneAndUpdate({ id }, req.body, { new: true });
    
    if (req.body.status === 'Approved') {
      await User.findOneAndUpdate({ id: app.userId }, { $inc: { activeLoans: 1 } });
    }
    
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ====================================================
// Express Routes - Notifications
// ====================================================
app.get('/api/notifications', async (req, res) => {
  try {
    const { role, userId } = req.query;
    
    // Complex query: get notifications for ALL users of that role OR specific userId
    const query = {
      $or: [
        { targetRole: role, targetUserId: 'ALL' },
        { targetRole: role, targetUserId: userId }
      ]
    };
    
    const notifs = await Notification.find(query).sort({ time: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const newNotif = new Notification(req.body);
    await newNotif.save();
    res.status(201).json(newNotif);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { id: req.params.id }, 
      { read: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ====================================================
// Express Routes - Emails
// ====================================================
app.post('/api/auth/login-alert', async (req, res) => {
  const { email, name } = req.body;
  if (!email || !transporter) return res.json({ message: 'Skipped' });

  const loginTime = new Date().toLocaleString();
  const userName = name || email.split('@')[0];

  let message = {
    from: process.env.SMTP_FROM || 'CredScore',
    to: email,
    subject: 'Security Alert: New Login to CredScore',
    html: `<p>Hello ${userName}, new login detected at ${loginTime}.</p>`
  };

  try {
    await transporter.sendMail(message);
    res.json({ message: 'Sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send' });
  }
});

// Start Server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});

// MongoDB touch
