const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecrethealthcarekey123!', {
    expiresIn: '30d',
  });
};

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin user already exists' });
    }

    const admin = await Admin.create({
      email,
      password,
      name: email.split('@')[0], // Set default name from email prefix
    });

    if (admin) {
      res.status(201).json({
        success: true,
        data: {
          _id: admin._id,
          email: admin.email,
          name: admin.name,
          token: generateToken(admin._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error('Register Admin Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for admin email
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      res.json({
        success: true,
        data: {
          _id: admin._id,
          email: admin.email,
          name: admin.name || admin.email.split('@')[0],
          token: generateToken(admin._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Admin Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Optional: Helper to check if admin DB has accounts, and create one
const seedAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = 'admin@healthcare.com';
      const password = 'admin123';
      const name = 'Admin Team';
      await Admin.create({ email, password, name });
      console.log(`[SEED] Admin account created: ${email} with password: ${password} (${name})`);
    }
  } catch (error) {
    console.error('Error seeding admin account:', error.message);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  seedAdmin,
};
