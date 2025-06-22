import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Details from '@/pages/employee/Details';
import Account from '@/pages/employee/Account';
import Reference from '@/pages/employee/Reference';
import Offboarding from '@/pages/employee/Offboarding';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Register from '@/pages/Register';
import ProtectedRoute from "@/components/ProtectedRoute";


const ProtectedLayout = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      {/* Protected Routes Grouped */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-details" element={<Details />} />
        <Route path="/account-details" element={<Account />} />
        <Route path="/reference-details" element={<Reference />} />
        <Route path="/offboarding" element={<Offboarding />} />
      </Route>
    </Routes>
  );
};

export default App;
