import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({}); // Store temporary role values

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/users", {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
      const roleMap = {};
      data.forEach((user) => {
        roleMap[user.id] = user.role;
      });
      setRoles(roleMap);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleRoleChange = (id, newRole) => {
    setRoles((prev) => ({ ...prev, [id]: newRole }));
  };

  const updateRole = async (id) => {
    try {
      const role = roles[id];
      const res = await fetch(`http://localhost:8080/api/admin/users/${id}/role?role=${role}`, {
        method: "PUT",
        credentials: "include",
      });
      const text = await res.text();
      alert(text);
      fetchUsers();
    } catch (err) {
      alert("Failed to update role.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const text = await res.text();
      alert(text);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  return (
    <div style={{ backgroundColor: "#F0F4F8", minHeight: "100vh" }}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold" style={{ color: "#0056B3" }}>User Management</h2>
          <button
            className="btn text-white"
            style={{ backgroundColor: "#6c757d" }}
            onClick={() => navigate("/admin")}
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="table-responsive shadow-sm border rounded overflow-hidden bg-white">
          <table className="table table-bordered align-middle mb-0">
            <thead style={{ backgroundColor: "#0056B3", color: "#fff" }} className="text-center">
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>
                    <select
                      className="form-select"
                      value={roles[user.id]}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: "#18A0FB" }}
                        onClick={() => updateRole(user.id)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: "#D32F2F" }}
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-3">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
