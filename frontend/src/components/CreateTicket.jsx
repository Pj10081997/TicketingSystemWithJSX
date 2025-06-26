import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTicket() {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({
    title: '',
    description: ''
  });
  const user = JSON.parse(localStorage.getItem('user'));

  const handleChange = (e) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ ...ticket, createdBy: user.username })
    });

    if (response.ok) {
      navigate("/tickets");
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary fw-bold">Create New Ticket</h2>
          <button
            className="btn"
            style={{ backgroundColor: '#D32F2F', color: '#fff' }}
            onClick={() => navigate('/tickets')}
          >
            Back to List
          </button>
        </div>

        <div className="card shadow border-0">
          <div
            className="card-header text-white"
            style={{ backgroundColor: '#0056B3' }}
          >
            <h5 className="mb-0">Ticket Information</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label text-dark fw-semibold">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  className="form-control"
                  value={ticket.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label text-dark fw-semibold">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="4"
                  value={ticket.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: '#18A0FB', color: '#fff' }}
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
