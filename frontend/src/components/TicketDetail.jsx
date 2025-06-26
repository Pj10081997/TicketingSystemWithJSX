import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch(`http://localhost:8080/api/tickets/${id}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setTicket(data);
        setStatus(data.status);
        setRemarks(data.remarks || '');
      });
  }, [id]);

  const handleUpdate = () => {
    fetch(`http://localhost:8080/api/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status, remarks }),
    }).then((res) => res.ok && navigate('/tickets'));
  };

  if (!ticket) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const statusBadgeClass = {
    OPEN: 'warning',
    IN_PROGRESS: 'info',
    CLOSED: 'success',
  }[ticket.status] || 'secondary';

  const statusBadgeColor = {
    OPEN: '#FFC107',
    IN_PROGRESS: '#18A0FB',
    CLOSED: '#4CAF50',
  }[ticket.status] || '#6c757d';

  return (
    <div style={{ backgroundColor: '#F0F4F8', minHeight: '100vh' }}>
      <nav
        className="navbar navbar-expand-lg shadow-sm px-4"
        style={{ backgroundColor: '#0056B3' }}
      >
        <span className="navbar-brand fw-bold text-white">GSI Ticket Detail</span>
        <div className="ms-auto">
          <button
            className="btn btn-light btn-sm"
            onClick={() => navigate('/tickets')}
          >
            Back to List
          </button>
        </div>
      </nav>

      <div className="container py-4">
        <div className="card border-0 shadow-sm">
          <div
            className="card-header text-white"
            style={{ backgroundColor: '#0056B3' }}
          >
            <h4 className="mb-0">{ticket.title}</h4>
          </div>
          <div className="card-body text-dark" style={{ color: '#333333' }}>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Status:</strong>{' '}
                <span
                  className="badge"
                  style={{
                    backgroundColor: statusBadgeColor,
                    color: '#333',
                  }}
                >
                  {ticket.status}
                </span>
              </div>
              <div className="col-md-6">
                <strong>Created By:</strong> {ticket.createdBy}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Resolved By:</strong> {ticket.resolvedBy || '—'}
              </div>
              <div className="col-md-6">
                <strong>Created At:</strong>{' '}
                {ticket.createdAt?.replace('T', ' ').substring(0, 16)}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Closed At:</strong>{' '}
                {ticket.closedAt ? ticket.closedAt.replace('T', ' ').substring(0, 16) : '—'}
              </div>
              <div className="col-md-6">
                <strong>Remarks:</strong> {ticket.remarks || '—'}
              </div>
            </div>

            <div className="mb-3">
              <strong>Description:</strong>
              <p className="mb-0">{ticket.description}</p>
            </div>

            {user?.role === 'ADMIN' && (
              <>
                <hr />
                <h5 className="mb-3 text-primary">Admin Actions</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="status" className="form-label">
                      Update Status
                    </label>
                    <select
                      id="status"
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  <div className="col-md-12 mb-3">
                    <label htmlFor="remarks" className="form-label">
                      Remarks
                    </label>
                    <textarea
                      id="remarks"
                      className="form-control"
                      rows="3"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                </div>
                <div className="text-end">
                  <button
                    className="btn"
                    style={{ backgroundColor: '#4CAF50', color: '#fff' }}
                    onClick={handleUpdate}
                  >
                    Update Ticket
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
