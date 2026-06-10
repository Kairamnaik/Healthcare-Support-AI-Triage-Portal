import React, { useState } from 'react';
import { Send, AlertTriangle, Loader2 } from 'lucide-react';
import { submitRequest } from '../services/api';

const PatientForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    symptoms: '',
    concern: '',
    preferredContact: 'Email'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = Number(formData.age);
      if (isNaN(ageNum) || ageNum <= 0) {
        newErrors.age = 'Age must be a positive number';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else {
      const phoneRegex = /^[+]?[0-9]{8,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s()-]/g, ''))) {
        newErrors.phone = 'Please enter a valid mobile number (8-15 digits)';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.symptoms.trim()) newErrors.symptoms = 'Symptom overview is required';
    if (!formData.concern.trim()) newErrors.concern = 'Health concern description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await submitRequest(formData);
      if (response.data && response.data.success) {
        onSubmitSuccess(response.data.data);
      } else {
        setSubmitError('Failed to submit request. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(
        err.response?.data?.message || 
        'Unable to connect to the server. Please check if the server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-up">
      {submitError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--color-danger-light)',
          color: 'var(--color-danger)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          fontWeight: 500,
          border: '1px solid var(--color-danger)'
        }}>
          <AlertTriangle size={18} />
          <span>{submitError}</span>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="age">Age *</label>
          <input
            id="age"
            name="age"
            type="number"
            className="form-control"
            placeholder="30"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <div className="error-text">{errors.age}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            className="form-control"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">Mobile Number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="form-control"
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <div className="error-text">{errors.phone}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="preferredContact">Preferred Contact Method</label>
          <select
            id="preferredContact"
            name="preferredContact"
            className="form-control"
            value={formData.preferredContact}
            onChange={handleChange}
          >
            <option value="Email">Email</option>
            <option value="Phone">Phone Call</option>
            <option value="SMS">SMS Message</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="symptoms">Symptoms (Short Overview) *</label>
        <input
          id="symptoms"
          name="symptoms"
          type="text"
          className="form-control"
          placeholder="Fever, cough, body pain"
          value={formData.symptoms}
          onChange={handleChange}
        />
        {errors.symptoms && <div className="error-text">{errors.symptoms}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="concern">Health Concern Description (Details) *</label>
        <textarea
          id="concern"
          name="concern"
          rows="4"
          className="form-control"
          placeholder="Please describe your symptoms and how long they have lasted..."
          value={formData.concern}
          onChange={handleChange}
        ></textarea>
        {errors.concern && <div className="error-text">{errors.concern}</div>}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', marginTop: '1rem' }}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Generating AI Summary & Saving Request...</span>
          </>
        ) : (
          <>
            <Send size={18} />
            <span>Submit Support Request</span>
          </>
        )}
      </button>
    </form>
  );
};

export default PatientForm;
