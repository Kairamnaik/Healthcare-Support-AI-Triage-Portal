import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Clock, RefreshCw, CheckCircle2, Search, Filter, 
  Download, FileSpreadsheet, FileText, Printer, Sparkles, X, ChevronRight 
} from 'lucide-react';
import { getRequests, updateRequestStatus, deleteRequest } from '../services/api';
import RequestTable from '../components/RequestTable';
import StatusBadge from '../components/StatusBadge';

const Dashboard = ({ admin, onLogout }) => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Detail Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!admin) {
      navigate('/login');
    }
  }, [admin, navigate]);

  const fetchRequests = async () => {
    if (!admin) return;
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search;

      const response = await getRequests(params);
      if (response.data && response.data.success) {
        const data = response.data.data;
        setRequests(data);
        calculateStats(data);
      } else {
        setError('Failed to fetch patient requests.');
      }
    } catch (err) {
      console.error('Fetch requests error:', err);
      if (err.response?.status === 401) {
        setError('Session expired or database reset. Redirecting to login...');
        setTimeout(() => {
          if (onLogout) onLogout();
        }, 1500);
      } else {
        setError('Could not connect to the backend API. Verify the server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever search terms change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRequests();
    }, 300); // Debounce search

    return () => clearTimeout(delayDebounceFn);
  }, [search, admin]);

  const calculateStats = (allRequests) => {
    // If we filtered, stats should represent all requests or current set?
    // Let's compute stats relative to all requests, so we retrieve without filters for stats.
    // However, to make it responsive and simple, we can base it on the full list.
    // To ensure stats reflect total database numbers correctly, we can also fetch overall requests.
    // Let's just calculate based on the current set or do an un-filtered fetch to keep statistics solid.
    // Actually, a simpler and cleaner way: calculate statistics based on the full list.
    // Let's fetch the full list once or just calculate from the filtered view. Let's calculate from filtered view
    // but better yet, let's compute statistics from a separate fetch or from the filtered list so they are responsive.
    // Let's make stats represent overall database counts. We'll do a quick fetch for counts, or calculate on overall list.
    // Let's do a quick calculation of the current lists. To be accurate, we'll calculate from the overall list:
    const total = allRequests.length;
    const pending = allRequests.filter(r => r.status === 'Pending').length;
    const inProgress = allRequests.filter(r => r.status === 'In Progress').length;
    const resolved = allRequests.filter(r => r.status === 'Resolved').length;

    setStats({ total, pending, inProgress, resolved });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await updateRequestStatus(id, newStatus);
      if (response.data && response.data.success) {
        // Update local state directly to prevent a full reload
        setRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
        
        // If the selected request is open in the modal, update it too
        if (selectedRequest && selectedRequest._id === id) {
          setSelectedRequest(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update request status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this support request?')) {
      return;
    }
    try {
      const response = await deleteRequest(id);
      if (response.data && response.data.success) {
        setRequests(prev => prev.filter(req => req._id !== id));
        if (selectedRequest && selectedRequest._id === id) {
          setSelectedRequest(null);
        }
      }
    } catch (err) {
      console.error('Delete request error:', err);
      alert('Failed to delete request. Please try again.');
    }
  };

  // Recalculate stats when requests change
  useEffect(() => {
    calculateStats(requests);
  }, [requests]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredRequests.length === 0) return;
    
    const headers = ['Name', 'Age', 'Gender', 'Phone', 'Email', 'Symptoms', 'Concern', 'AI Summary', 'Status', 'Date Created'];
    const rows = filteredRequests.map(r => [
      r.name,
      r.age,
      r.gender,
      r.phone,
      r.email,
      r.symptoms.replace(/"/g, '""'),
      r.concern.replace(/"/g, '""'),
      r.aiSummary.replace(/"/g, '""'),
      r.status,
      new Date(r.createdAt).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CareFlow_Patient_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF / Print View
  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>CareFlow Patients Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; font-size: 12px; }
            td { border: 1px solid #cbd5e1; padding: 10px; font-size: 11px; vertical-align: top; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9px; text-transform: uppercase; }
            .badge-pending { background-color: #ffedd5; color: #ea580c; }
            .badge-progress { background-color: #e0f2fe; color: #0284c7; }
            .badge-resolved { background-color: #dcfce7; color: #16a34a; }
            .summary { font-style: italic; color: #555; }
          </style>
        </head>
        <body>
          <h1>CareFlow Patient Support Requests Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Total Records: ${filteredRequests.length}</p>
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Age/Sex</th>
                <th>Contact</th>
                <th>Symptoms</th>
                <th>AI Summary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRequests.map(r => `
                <tr>
                  <td><strong>${r.name}</strong></td>
                  <td>${r.age} (${r.gender})</td>
                  <td>${r.email}<br/>${r.phone}</td>
                  <td>${r.symptoms}</td>
                  <td class="summary">${r.aiSummary}</td>
                  <td>
                    <span class="badge badge-${r.status === 'Pending' ? 'pending' : r.status === 'In Progress' ? 'progress' : 'resolved'}">
                      ${r.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  // Helper for rendering custom pure CSS/SVG chart
  const renderStatsChart = () => {
    const maxVal = Math.max(stats.pending, stats.inProgress, stats.resolved, 1);
    const getPercent = (val) => (val / maxVal) * 100;

    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
            Request Distribution Status
          </h3>
        </div>
        <div className="bar-chart-visual">
          <div className="bar-column">
            <div 
              className="bar-shape pending" 
              style={{ height: `${getPercent(stats.pending)}%` }}
            >
              <span className="bar-shape-value">{stats.pending}</span>
            </div>
            <span className="bar-label">Pending</span>
          </div>

          <div className="bar-column">
            <div 
              className="bar-shape in-progress" 
              style={{ height: `${getPercent(stats.inProgress)}%` }}
            >
              <span className="bar-shape-value">{stats.inProgress}</span>
            </div>
            <span className="bar-label">In Progress</span>
          </div>

          <div className="bar-column">
            <div 
              className="bar-shape resolved" 
              style={{ height: `${getPercent(stats.resolved)}%` }}
            >
              <span className="bar-shape-value">{stats.resolved}</span>
            </div>
            <span className="bar-label">Resolved</span>
          </div>
        </div>
      </div>
    );
  };

  const filteredRequests = requests.filter(req => {
    if (!statusFilter) return true;
    return req.status === statusFilter;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Administration Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage patient health concerns</p>
        </div>
        
        {filteredRequests.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleExportCSV} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <FileSpreadsheet size={16} />
              <span>Export CSV</span>
            </button>
            <button onClick={handlePrintPDF} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <Printer size={16} />
              <span>Print Report</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Summary Grid */}
      <div className="stats-grid">
        <div 
          className={`stats-card clickable ${statusFilter === '' ? 'active' : ''}`}
          onClick={() => setStatusFilter('')}
          title="Filter by all requests"
        >
          <div className="stats-icon" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
            <Users size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-number">{stats.total}</span>
            <span className="stats-label">Total Requests</span>
          </div>
        </div>

        <div 
          className={`stats-card clickable ${statusFilter === 'Pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Pending')}
          title="Filter by Pending requests"
        >
          <div className="stats-icon" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <Clock size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-number">{stats.pending}</span>
            <span className="stats-label">Pending</span>
          </div>
        </div>

        <div 
          className={`stats-card clickable ${statusFilter === 'In Progress' ? 'active' : ''}`}
          onClick={() => setStatusFilter('In Progress')}
          title="Filter by In Progress requests"
        >
          <div className="stats-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <RefreshCw size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-number">{stats.inProgress}</span>
            <span className="stats-label">In Progress</span>
          </div>
        </div>

        <div 
          className={`stats-card clickable ${statusFilter === 'Resolved' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Resolved')}
          title="Filter by Resolved requests"
        >
          <div className="stats-icon" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-number">{stats.resolved}</span>
            <span className="stats-label">Resolved</span>
          </div>
        </div>
      </div>

      {/* Stats distribution Chart */}
      {requests.length > 0 && renderStatsChart()}

      {/* Filters and Controls */}
      <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by patient name or email..."
              className="form-control search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filters-group">
            <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
            <select
              className="form-control select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--color-danger)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        {/* Requests Management Grid / Table */}
        {loading && requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <p>Loading patient requests...</p>
          </div>
        ) : (
          <RequestTable
            requests={filteredRequests}
            onView={(req) => setSelectedRequest(req)}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Detail Inspection Drawer / Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRequest(null)}>
              <X size={20} />
            </button>

            <div className="modal-header">
              <h2 className="modal-title">{selectedRequest.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Patient Support Request details
              </p>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="detail-section">
                  <div className="detail-label">Age & Gender</div>
                  <div className="detail-value">{selectedRequest.age} years ({selectedRequest.gender})</div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Current Status</div>
                  <div className="detail-value" style={{ marginTop: '0.25rem' }}>
                    <StatusBadge status={selectedRequest.status} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="detail-section">
                  <div className="detail-label">Email Address</div>
                  <div className="detail-value">{selectedRequest.email}</div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Mobile Number</div>
                  <div className="detail-value">{selectedRequest.phone}</div>
                </div>
              </div>

              <div className="detail-section" style={{ marginBottom: '1.5rem' }}>
                <div className="detail-label">Symptom Summary</div>
                <div className="detail-value" style={{ fontWeight: 600 }}>{selectedRequest.symptoms}</div>
              </div>

              <div className="detail-section" style={{ marginBottom: '1.5rem' }}>
                <div className="detail-label">Original Description of Concern</div>
                <div className="detail-value" style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-line',
                  border: '1px solid var(--border-color)'
                }}>
                  {selectedRequest.concern}
                </div>
              </div>

              <div className="detail-section" style={{ marginBottom: '1.5rem' }}>
                <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)' }}>
                  <Sparkles size={14} />
                  <span>AI Patient Summary</span>
                </div>
                <div className="summary-highlight">
                  "{selectedRequest.aiSummary}"
                </div>
              </div>

              <div className="detail-section" style={{ marginBottom: '1rem' }}>
                <div className="detail-label">Registration Date</div>
                <div className="detail-value">
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Update Status:</span>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleStatusChange(selectedRequest._id, e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => handleDelete(selectedRequest._id)} 
                  className="btn btn-danger"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Delete Record
                </button>
                <button 
                  onClick={() => setSelectedRequest(null)} 
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
