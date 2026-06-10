import React from 'react';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'In Progress':
        return {
          className: 'in-progress',
          icon: <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />,
          label: 'In Progress'
        };
      case 'Resolved':
        return {
          className: 'resolved',
          icon: <CheckCircle2 size={12} />,
          label: 'Resolved'
        };
      case 'Pending':
      default:
        return {
          className: 'pending',
          icon: <Clock size={12} />,
          label: 'Pending'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={`status-badge ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
