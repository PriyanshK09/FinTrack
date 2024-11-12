const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Verify environment variables are loaded
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
  console.error('RAZORPAY credentials missing in environment variables');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET missing in environment variables');
  process.exit(1);
}

const authRoutes = require('./routes/authRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalRoutes = require('./routes/goalRoutes');
const educationRoutes = require('./routes/educationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/paymentRoutes'); // Add this line

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/payment', paymentRoutes); // Add this line

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});