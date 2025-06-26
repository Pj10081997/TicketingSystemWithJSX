import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    resolvedBy: '',
    startDate: '',
    endDate: '',
  });
  const user = JSON.parse(localStorage.getItem('user'));

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`http://localhost:8080/api/tickets?${params}`, {
      credentials: 'include',
    });
    const data = await response.json();
    setTickets(data);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const clearFilters = () => {
    setFilters({ status: '', resolvedBy: '', startDate: '', endDate: '' });
    fetchTickets();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return "#FFC107";
      case "IN_PROGRESS": return "#18A0FB";
      case "CLOSED": return "#4CAF50";
      default: return "#6c757d";
    }
  };

  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedTickets.length / ticketsPerPage);

  return (
    <div style={{ backgroundColor: '#F0F4F8', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg shadow-sm px-4" style={{ backgroundColor: '#0056B3' }}>
        <span className="navbar-brand fw-bold text-white">GSI Ticketing System</span>
        <div className="ms-auto">
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fw-semibold" style={{ color: '#0056B3' }}>All Tickets</h2>
          {['USER', 'ADMIN'].includes(user.role) && (
            <button className="btn" style={{ backgroundColor: '#4CAF50', color: '#fff' }} onClick={() => navigate("/tickets/new")}>
              + Create Ticket
            </button>
          )}
        </div>

        {/* Filters */}
        <form onSubmit={handleFilterSubmit} className="row g-3 align-items-end mb-4 shadow-sm p-3 bg-white rounded border">
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select className="form-select" name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {user.role === 'ADMIN' && (
            <div className="col-md-3">
              <label className="form-label">Resolved By</label>
              <input className="form-control" name="resolvedBy" value={filters.resolvedBy} onChange={handleFilterChange} />
            </div>
          )}

          <div className="col-md-3">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-control" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label">End Date</label>
            <input type="date" className="form-control" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
          </div>

          <div className="col-12 d-flex justify-content-end gap-2">
            <button type="submit" className="btn" style={{ backgroundColor: '#0056B3', color: '#fff' }}>Filter</button>
            <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>Clear</button>
          </div>
        </form>

        {/* Table */}
        <div className="table-responsive shadow-sm border rounded overflow-hidden">
          <table className="table table-hover table-bordered align-middle mb-0">
            <thead style={{ backgroundColor: '#0056B3', color: 'white' }} className="text-center">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Resolved By</th>
                <th>Created At</th>
                <th>Closed At</th>
                <th>Actions</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.length > 0 ? currentTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td className="text-center">
                    <span className="badge" style={{ backgroundColor: getStatusColor(ticket.status), color: '#333' }}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>{ticket.createdBy}</td>
                  <td>{ticket.resolvedBy || '—'}</td>
                  <td>{ticket.createdAt?.replace('T', ' ').substring(0, 16)}</td>
                  <td>{ticket.closedAt ? ticket.closedAt.replace('T', ' ').substring(0, 16) : '—'}</td>
                  <td className="text-center">
                    {user.role === 'ADMIN' && (
                      <button
                        className="btn btn-sm"
                        style={{ borderColor: '#0056B3', color: '#0056B3' }}
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        View
                      </button>
                    )}
                  </td>
                  <td>{ticket.remarks || '—'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-3">No tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketList;
