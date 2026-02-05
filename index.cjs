const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

/* ---------------- Middleware ---------------- */

app.use(bodyParser.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL   // Vercel URL from env
  ]
}));

/* ---------------- MongoDB Connection ---------------- */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("MongoDB Connection Error:", err));

/* ---------------- Schema ---------------- */

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

/* ---------------- Routes ---------------- */

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (user) {
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.post('/subscribe', async (req, res) => {
  const { name, email } = req.body;

  try {
    await sendSubscriptionEmail(name, email);
    res.status(200).send("Subscription success!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Subscription failed");
  }
});

/* ---------------- Nodemailer ---------------- */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendSubscriptionEmail(name, email) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to InsightNow",
    text: `Hi ${name}, Welcome to InsightNow!`
  });
}

/* ---------------- Start Server ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
