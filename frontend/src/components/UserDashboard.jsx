import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await fetch("http://localhost:8080/api/tickets", {
      credentials: "include",
    });
    const data = await res.json();
    const myTickets = data.filter((ticket) => ticket.createdBy === user.username);
    setTickets(myTickets);
  };

  const getStatusCount = (status) => tickets.filter((t) => t.status === status).length;

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

  return (
    <div style={{ backgroundColor: "#F0F4F8", minHeight: "100vh" }}>
      <nav className="navbar navbar-expand-lg px-4 shadow-sm" style={{ backgroundColor: "#0056B3" }}>
        <span className="navbar-brand fw-bold text-white">GSI User Dashboard</span>
        <div className="ms-auto">
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Side card with actions */}
          <div className="col-md-3 d-flex justify-content-center align-items-center py-4">
            <div className="card shadow-sm w-100">
              <div className="card-body text-center">
                <h5 className="mb-4" style={{ color: "#0056B3" }}>Quick Actions</h5>
                <div className="d-grid gap-2">
                  <button
                    className="btn text-white"
                    style={{ backgroundColor: "#4CAF50" }}
                    onClick={() => navigate("/tickets/new")}
                  >
                    + Create Ticket
                  </button>
                  <button
                    className="btn text-white"
                    style={{ backgroundColor: "#0056B3" }}
                    onClick={() => navigate("/tickets")}
                  >
                    My Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-md-9 py-4 px-4">
            <h2 className="mb-4 fw-semibold" style={{ color: "#0056B3" }}>
              Welcome back, {user.username}!
            </h2>

            {/* Status Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card text-white shadow" style={{ backgroundColor: "#0056B3" }}>
                  <div className="card-body">
                    <h5>Total Tickets</h5>
                    <p className="fs-4">{tickets.length}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-dark shadow" style={{ backgroundColor: "#FFC107" }}>
                  <div className="card-body">
                    <h5>Open</h5>
                    <p className="fs-4">{getStatusCount("OPEN")}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white shadow" style={{ backgroundColor: "#18A0FB" }}>
                  <div className="card-body">
                    <h5>In Progress</h5>
                    <p className="fs-4">{getStatusCount("IN_PROGRESS")}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white shadow" style={{ backgroundColor: "#4CAF50" }}>
                  <div className="card-body">
                    <h5>Closed</h5>
                    <p className="fs-4">{getStatusCount("CLOSED")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Tickets Table */}
            <h4 className="mb-3" style={{ color: "#333333" }}>Recent Tickets</h4>
            <div className="table-responsive shadow-sm border rounded overflow-hidden">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="text-center" style={{ backgroundColor: "#0056B3", color: "#fff" }}>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0, 5).map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.title}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: getStatusColor(ticket.status), color: "#333" }}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>{ticket.createdAt?.replace("T", " ").substring(0, 16)}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm"
                          style={{ borderColor: "#0056B3", color: "#0056B3" }}
                          onClick={() => navigate("/tickets")}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        No tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
