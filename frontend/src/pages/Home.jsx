import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, HeartPulse, ShieldAlert, FileHeart, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Your Health, Summarized & Managed Instantly</h1>
        <p className="hero-subtitle">
          Submit your health concerns online. Our platform uses advanced AI to synthesize symptoms for physicians, ensuring quicker support and better clinical follow-ups.
        </p>
        <div className="hero-cta">
          <Link to="/submit" className="btn btn-primary">
            <HeartPulse size={18} />
            <span>Submit Support Request</span>
          </Link>
          <Link to="/login" className="btn btn-outline">
            <span>Access Admin Panel</span>
          </Link>
        </div>
      </section>

      {/* Main Pillars */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          Why Use CareFlow?
        </h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Clock size={24} />
            </div>
            <h3 className="feature-title">24/7 Digital Intake</h3>
            <p className="feature-desc">
              Submit your symptoms and concerns securely from home at any time. No queues, no waiting.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
              <Sparkles size={24} />
            </div>
            <h3 className="feature-title">AI Patient Summarization</h3>
            <p className="feature-desc">
              Our integrated Gemini AI extracts relevant medical details from your concern, formatting it into structured medical notes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              <Shield size={24} />
            </div>
            <h3 className="feature-title">HIPAA & Privacy Focused</h3>
            <p className="feature-desc">
              Your patient concerns are kept completely confidential. Data is shared only with authorized clinical administrators.
            </p>
          </div>
        </div>
      </section>

      {/* Info Panel / Callout */}
      <section className="card-glass" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FileHeart size={100} style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Get Quality Triage and Prompt Admin Responses</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            When you file a request, CareFlow generates an clinical summary automatically. This summary is instantly sent to the Admin Dashboard, where staff can review, classify, and address your inquiry promptly.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <ShieldAlert size={16} style={{ color: 'var(--color-primary)' }} /> Secure SSL Encryption
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <Clock size={16} style={{ color: 'var(--color-secondary)' }} /> Under 4-hour Response Time
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
