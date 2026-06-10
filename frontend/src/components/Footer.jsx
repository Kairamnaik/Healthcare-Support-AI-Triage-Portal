import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
        Made with <Heart size={14} style={{ color: 'var(--color-danger)' }} /> for patients and healthcare providers.
      </p>
      <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} CareFlow Health Inc. All rights reserved.
      </p>
      <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em' }}>
        DESIGNED BY BHUKYA KAIRAM
      </p>
    </footer>
  );
};

export default Footer;
