const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);
const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/newzify';
const MONGO_URI = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_only_change_me';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const ALLOW_START_WITHOUT_DB = process.env.ALLOW_START_WITHOUT_DB === 'true';

// Middleware
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) {
//       return callback(null, true);
//     }
//     const allowedOrigins = CLIENT_ORIGIN.split(',').map(o => o.trim()).filter(Boolean);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     return callback(new Error(`CORS blocked for origin: ${origin}`));
//   },
//   credentials: true
// }));
// app.use(bodyParser.json());
app.use(cors({
  origin: CLIENT_ORIGIN.split(',').map(o => o.trim()),
  credentials: true
}));


// User Schema and Model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

const User = mongoose.model('newzify', userSchema);

// Register new user
app.post('/api/register', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database unavailable. Please try again shortly.'
      });
    }

    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newUser.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database unavailable. Please try again shortly.'
      });
    }

    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email); // Log attempt

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create user object without sensitive data
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful for user:', email);
    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'up' });
});

// Centralized error handler (covers CORS rejections and unexpected errors)
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});
app.post('/subscribe', async (req, res) => {
    const { name, email } = req.body;
    try {
      await sendSubscriptionEmail(name, email);
      res.status(200).send('Subscription success!');
    } catch (error) {
      console.error('Error sending subscription email:', error);
      res.status(500).send('Subscription failed.');
    }
  });
const sendSubscriptionEmail = async (name, email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'mangesh.07gsb@gmail.com',
    to: email,
    subject: 'Welcome To InsightNow!',
    html: `<p>Hi ${name},</p>
    
    <p><span style="font-weight: bold;">🎉 Welcome to InsightNow! 🎉</span></p>
    
    <p>Prepare to embark on an exciting journey with us, where staying informed is not just a habit, it's a delightful experience!</p>
    
    <p>As a member of our vibrant community, you're in for a treat:</p>
    
    <ul>
      <li><strong>Daily News Delight:</strong> Wake up to a curated selection of top news stories, handpicked just for you. Stay ahead of the curve with the latest updates delivered straight to your inbox every morning.</li>
      <li><strong>Tailored for You:</strong> Customize your news preferences and receive alerts on the topics that ignite your curiosity. Whether it's politics, tech trends, sports highlights, or entertainment buzz, we've got you covered!</li>
      <li><strong>Exclusive Access:</strong> Dive deep into exclusive articles, captivating interviews, and thought-provoking analysis from our seasoned journalists and contributors. Get the inside scoop before anyone else!</li>
      <li><strong>Join the Conversation:</strong> Engage with like-minded individuals by participating in lively discussions, polls, and surveys on our interactive platform. Your voice matters, and we're here to amplify it!</li>
      <li><strong>Seamless Experience:</strong> Enjoy a smooth and hassle-free browsing experience across all your devices. Whether you're on your computer, tablet, or smartphone, InsightNow is your ultimate companion for staying informed on the go!</li>
    </ul>
    
    <p>We're more than just a news source; we're your trusted companion in navigating the ever-evolving world around us.</p>
    
    <p>Thank you for choosing InsightNow as your partner in staying informed, entertained, and empowered. Together, let's explore the world of news like never before!</p>
    
    <p>Welcome to the InsightNow family!</p>
    
    <p>Best regards,<br>The InsightNow Team</p>`
};

  await transporter.sendMail(mailOptions);
};

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      console.error('Missing MONGODB_URI. Set it in .env before starting the server.');
      process.exit(1);
    }
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not set. Using fallback connection string:', MONGO_URI);
    }
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET not set. Using a development-only default.');
    }

    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test the connection by trying to get the list of collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(col => col.name));
    
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Connect to MongoDB before starting the server
connectDB().then((connected) => {
  if (!connected && !ALLOW_START_WITHOUT_DB) {
    console.error('Failed to connect to MongoDB. Set ALLOW_START_WITHOUT_DB=true to start anyway.');
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed CORS origins: ${CLIENT_ORIGIN}`);
    if (!connected) {
      console.warn('Server started without DB connection. Login/register will return 503.');
    }
  });
}).catch(error => {
  console.error('Unexpected startup error:', error);
  process.exit(1);
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
