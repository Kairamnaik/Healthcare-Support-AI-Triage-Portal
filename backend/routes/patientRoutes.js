const express = require('express');
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatientStatus,
  deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

// Public route to submit request
router.post('/', createPatient);

// Protected routes for admins
router.get('/', protect, getAllPatients);
router.get('/:id', protect, getPatientById);
router.put('/:id', protect, updatePatientStatus);
router.delete('/:id', protect, deletePatient);

module.exports = router;
