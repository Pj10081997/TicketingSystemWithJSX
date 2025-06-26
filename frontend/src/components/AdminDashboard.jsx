import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/tickets", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((err) => console.error("Error fetching tickets", err));
  }, []);

  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const closed = tickets.filter((t) => t.status === "CLOSED").length;

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

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
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg px-4 shadow-sm" style={{ backgroundColor: "#0056B3" }}>
        <span className="navbar-brand fw-bold text-white">GSI Admin Dashboard</span>
        <div className="ms-auto">
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Left side card panel */}
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
                    View All Tickets
                  </button>
                  <button
                    className="btn text-dark"
                    style={{ backgroundColor: "#FFC107" }}
                    onClick={() => navigate("/admin/users")}
                  >
                    Manage Users
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right main content */}
          <div className="col-md-9 py-4 px-4">
            <h2 className="mb-4 fw-semibold" style={{ color: "#0056B3" }}>
              Welcome back, {user?.username || "Admin"}!
            </h2>

            {/* Summary Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card text-white shadow" style={{ backgroundColor: "#0056B3" }}>
                  <div className="card-body">
                    <h5>Total Tickets</h5>
                    <p className="fs-4">{total}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-dark shadow" style={{ backgroundColor: "#FFC107" }}>
                  <div className="card-body">
                    <h5>Open</h5>
                    <p className="fs-4">{open}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white shadow" style={{ backgroundColor: "#18A0FB" }}>
                  <div className="card-body">
                    <h5>In Progress</h5>
                    <p className="fs-4">{inProgress}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white shadow" style={{ backgroundColor: "#4CAF50" }}>
                  <div className="card-body">
                    <h5>Closed</h5>
                    <p className="fs-4">{closed}</p>
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
                    <th>Created By</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.length > 0 ? (
                    recentTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.title}</td>
                        <td>{ticket.createdBy}</td>
                        <td>
                          <span className="badge" style={{ backgroundColor: getStatusColor(ticket.status), color: "#333" }}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>{ticket.createdAt?.replace("T", " ").substring(0, 16)}</td>
                        <td>
                          <button
                            className="btn btn-sm"
                            style={{ borderColor: "#0056B3", color: "#0056B3" }}
                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">No recent tickets</td>
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

export default AdminDashboard;
