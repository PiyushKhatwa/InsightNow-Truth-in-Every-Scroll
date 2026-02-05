const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load env
dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 3001);
const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/newzify';
const MONGO_URI = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_only_change_me';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const ALLOW_START_WITHOUT_DB = process.env.ALLOW_START_WITHOUT_DB === 'true';


// ================= MIDDLEWARE =================

app.use(express.json());

app.use(cors({
  origin: CLIENT_ORIGIN.split(',').map(o => o.trim()),
  credentials: true
}));


// ================= USER MODEL =================

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('newzify', userSchema);


// ================= EMAIL FUNCTION =================

const sendSubscriptionEmail = async (name, email) => {

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email env missing — skipping email send");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome To InsightNow!',
    html: `<p>Hi ${name},</p>

    <p><b>🎉 Welcome to InsightNow! 🎉</b></p>

    <p>Thanks for joining InsightNow. Stay updated with real and concise news.</p>

    <p>Regards,<br>InsightNow Team</p>`
  };

  await transporter.sendMail(mailOptions);
};


// ================= REGISTER =================

app.post('/api/register', async (req, res) => {

  try {

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database unavailable'
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields required'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // email should NOT break registration
    try {
      await sendSubscriptionEmail(name, email);
    } catch (err) {
      console.error("Email failed but user created", err);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });

  } catch (error) {

    console.error('Registration error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });

  }

});


// ================= LOGIN =================

app.post('/api/login', async (req, res) => {

  try {

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database unavailable'
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });

  }

});


// ================= HEALTH =================

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'up' });
});


// ================= DB CONNECT =================

const connectDB = async () => {

  try {

    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("Mongo connected:", conn.connection.host);
    return true;

  } catch (error) {

    console.error("Mongo error:", error);
    return false;

  }

};


// ================= START SERVER =================

connectDB().then((connected) => {

  if (!connected && !ALLOW_START_WITHOUT_DB) {
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });

});
