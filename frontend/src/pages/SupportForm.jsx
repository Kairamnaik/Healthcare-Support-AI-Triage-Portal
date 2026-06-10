import React, { useState } from 'react';
import { ClipboardCheck, ArrowLeft, Heart, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientForm from '../components/PatientForm';

const SupportForm = () => {
  const [submissionData, setSubmissionData] = useState(null);

  const handleFormSubmitSuccess = (data) => {
    setSubmissionData(data);
  };

  const generateHealthTips = (symptoms) => {
    const symList = symptoms.toLowerCase();
    const tips = [];

    if (symList.includes('fever') || symList.includes('temperature') || symList.includes('feverish')) {
      tips.push('Hydrate thoroughly: Drink plenty of water, clear broths, or electrolyte solutions to prevent dehydration.');
      tips.push('Rest extensively: Avoid strenuous activity to allow your body to naturally combat the fever.');
      tips.push('Monitor temperature regularly and note down readings for your physician.');
    }
    if (symList.includes('cough') || symList.includes('throat') || symList.includes('cold') || symList.includes('flu')) {
      tips.push('Warm liquids: Drink herbal tea, warm water with honey, or broth to soothe your throat lining.');
      tips.push('Humidify: Use a cool-mist humidifier or take a steamy shower to help loosen chest congestion.');
      tips.push('Avoid throat irritants like smoke, dust, or extremely cold air.');
    }
    if (symList.includes('pain') || symList.includes('headache') || symList.includes('ache')) {
      tips.push('Apply compress: A cool washcloth on the forehead or neck can help relieve tension headaches.');
      tips.push('Stretching or massage: Gently stretch neck/shoulders if the pain stems from muscular tension.');
      tips.push('Ensure a dark, quiet resting environment if you are suffering from a headache.');
    }
    if (symList.includes('stomach') || symList.includes('nausea') || symList.includes('vomit') || symList.includes('diarrhea')) {
      tips.push('B.R.A.T diet: Stick to bland, binding foods like Bananas, Rice, Applesauce, and Toast if you can tolerate eating.');
      tips.push('Avoid dairy, caffeine, spicy foods, or fatty meals until symptoms subside.');
      tips.push('Drink small, frequent sips of liquids rather than gulping to settle the stomach.');
    }

    // Default general tips if no symptom matched
    if (tips.length === 0) {
      tips.push('Rest and recuperation: Allow your body sufficient sleep to support your immune system.');
      tips.push('Consistent hydration: Consume clean fluids throughout the day.');
      tips.push('Seek clinical guidance: If symptoms worsen, schedule a professional check-up.');
    }

    return tips;
  };

  return (
    <div className="container-narrow animate-fade-in">
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: '1.5rem',
        transition: 'color var(--transition-fast)'
      }} className="hover-link">
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {!submissionData ? (
        <div className="card-glass">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <ClipboardCheck size={40} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }} />
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Submit Health Concern</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Please fill out your personal and health information below. CareFlow AI will summarize your symptoms instantly.
            </p>
          </div>
          
          <PatientForm onSubmitSuccess={handleFormSubmitSuccess} />
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* Submission Success Hero */}
          <div className="card-glass" style={{
            textAlign: 'center',
            border: '2px solid var(--color-success)',
            background: 'linear-gradient(180deg, var(--bg-secondary) 0%, rgba(22, 163, 74, 0.05) 100%)',
            marginBottom: '1.5rem'
          }}>
            <CheckCircle2 size={48} style={{ color: 'var(--color-success)', marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', color: 'var(--color-success)' }}>
              Request Submitted Successfully
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
              Thank you, {submissionData.name}. Your healthcare request has been safely logged in our portal. An administrator will contact you shortly via <strong>{submissionData.email}</strong>.
            </p>
          </div>

          {/* AI Summary Card */}
          <div className="card-glass ai-summary-card" style={{ marginBottom: '1.5rem' }}>
            <div className="ai-summary-header">
              <Sparkles size={18} />
              <span>AI Symptom Summary (Gemini Generated)</span>
            </div>
            <p className="ai-summary-content">"{submissionData.aiSummary}"</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
              fontSize: '0.775rem',
              color: 'var(--text-secondary)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '0.75rem'
            }}>
              <ShieldCheck size={14} style={{ color: 'var(--color-primary)' }} />
              <span>Summary securely saved in patient records for doctor triage.</span>
            </div>
          </div>

          {/* AI Generated Health Tips */}
          <div className="card-glass ai-tips-card" style={{ marginBottom: '1.5rem' }}>
            <div className="ai-tips-header">
              <Heart size={18} />
              <span>Wellness Suggestions for your Symptoms</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Based on the symptoms you entered (<em>{submissionData.symptoms}</em>), here are some non-prescription home suggestions while waiting for a clinician:
            </p>
            <ul style={{
              paddingLeft: '1.25rem',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              {generateHealthTips(submissionData.symptoms).map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--color-warning-light)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.775rem',
              color: 'var(--color-warning)',
              fontWeight: 500
            }}>
              <AlertTriangle size={14} />
              <span>Disclaimer: These suggestions do not substitute for professional medical diagnosis or care.</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <button onClick={() => setSubmissionData(null)} className="btn btn-primary">
              Submit Another Request
            </button>
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportForm;
