import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const RequestTable = ({ requests, onView, onStatusChange, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!requests || requests.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-secondary)'
      }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No patient requests found.</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          New submissions will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container animate-fade-in">
      <table className="request-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Symptoms</th>
            <th>AI Summary</th>
            <th>Status</th>
            <th>Date Created</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td style={{ fontWeight: 600 }}>{request.name}</td>
              <td>{request.age} ({request.gender[0]})</td>
              <td>{request.email}</td>
              <td>
                <div className="table-symptoms" title={request.symptoms}>
                  {request.symptoms}
                </div>
              </td>
              <td>
                <div className="table-summary" title={request.aiSummary}>
                  {request.aiSummary}
                </div>
              </td>
              <td>
                <StatusBadge status={request.status} />
              </td>
              <td>{formatDate(request.createdAt)}</td>
              <td>
                <div className="actions-group" style={{ justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onView(request)}
                    className="btn-icon-only"
                    title="View Request Details"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <Eye size={16} />
                  </button>
                  
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <select
                      value={request.status}
                      onChange={(e) => onStatusChange(request._id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-color)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                      title="Update Status"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <button
                    onClick={() => onDelete(request._id)}
                    className="btn-icon-only"
                    title="Delete Request"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
