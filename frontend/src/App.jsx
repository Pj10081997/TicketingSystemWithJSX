import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./components/Register"; // ✅ Import Register
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import TicketList from "./components/TicketList";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateTicket from "./components/CreateTicket";
import TicketDetail from "./components/TicketDetail";
import UserManagement from "./components/UserManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} /> {/* ✅ Public route */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRole="USER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets"
        element={
          <ProtectedRoute allowedRole={["ADMIN", "USER"]}>
            <TicketList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute allowedRole={["ADMIN", "USER"]}>
            <CreateTicket />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <TicketDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <UserManagement />
          </ProtectedRoute>
        }
      />

    </Routes>
    
  );
}

export default App;
