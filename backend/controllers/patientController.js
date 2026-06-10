const Patient = require('../models/Patient');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');

// Helper to generate AI summary
const generateAISummary = async (symptoms, concern) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[AI SUMMARY] No GEMINI_API_KEY found in environment. Using local heuristic fallback.');
    return generateFallbackSummary(symptoms, concern);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a healthcare support assistant.

Analyze the patient's message and generate a concise professional summary.

Rules:
* Maximum 2 sentences.
* Do not provide medical diagnosis.
* Do not prescribe medication.
* Only summarize the symptoms and concerns.
* Keep the language professional and clear.

Patient Message:
${concern}

Generate only the summary.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return text || generateFallbackSummary(symptoms, concern);
  } catch (error) {
    console.error('[AI SUMMARY] Gemini API error:', error.message);
    return generateFallbackSummary(symptoms, concern);
  }
};

// Fallback logic
const generateFallbackSummary = (symptoms, concern) => {
  const formattedConcern = concern.length > 80 ? concern.slice(0, 80) + '...' : concern;
  return `Patient reports symptoms of ${symptoms.toLowerCase()}. Concern details: "${formattedConcern}". Follow-up consultation recommended.`;
};

// Helper to send email notification
const sendConfirmationEmail = async (patientEmail, patientName) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  const emailSubject = 'Healthcare Support Request Received';
  const emailBody = `Dear ${patientName},

Thank you for contacting us. Your healthcare support request has been successfully submitted. Our team is currently reviewing your concern.

We will contact you via your preferred method shortly.

Best regards,
Healthcare Support Team`;

  if (!user || !pass) {
    console.log('\n========================================================');
    console.log('[EMAIL SIMULATION] (No credentials provided in .env)');
    console.log(`To: ${patientEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body:\n${emailBody}`);
    console.log('========================================================\n');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Fallback service config
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"Healthcare Support" <${user}>`,
      to: patientEmail,
      subject: emailSubject,
      text: emailBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Confirmation email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`[EMAIL] Error sending confirmation email: ${error.message}`);
  }
};

// @desc    Submit support request
// @route   POST /api/patients
// @access  Public
const createPatient = async (req, res) => {
  const { name, age, gender, phone, email, symptoms, concern } = req.body;

  try {
    if (!name || !age || !gender || !phone || !email || !symptoms || !concern) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (isNaN(Number(age)) || Number(age) <= 0) {
      return res.status(400).json({ success: false, message: 'Age must be a positive number' });
    }

    // Generate summary
    const aiSummary = await generateAISummary(symptoms, concern);

    // Create record
    const patient = await Patient.create({
      name,
      age: Number(age),
      gender,
      phone,
      email,
      symptoms,
      concern,
      aiSummary,
      status: 'Pending',
    });

    // Send async confirmation email
    sendConfirmationEmail(email, name);

    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Create Patient Request Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all requests
// @route   GET /api/patients
// @access  Private (Admin)
const getAllPatients = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    // Search query
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error('Get All Patients Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single request
// @route   GET /api/patients/:id
// @access  Private (Admin)
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Get Patient By ID Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update request status
// @route   PUT /api/patients/:id
// @access  Private (Admin)
const updatePatientStatus = async (req, res) => {
  const { status } = req.body;

  try {
    if (!status || !['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status is required' });
    }

    let patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    patient.status = status;
    await patient.save();

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Update Patient Status Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete request
// @route   DELETE /api/patients/:id
// @access  Private (Admin)
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    console.error('Delete Patient Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatientStatus,
  deletePatient,
};
