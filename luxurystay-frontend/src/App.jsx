import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './layouts/AppShell';
import LoginPage from './pages/LoginPage';

// Ops
import DashboardPage    from './pages/DashboardPage';
import ReservationsPage from './pages/ReservationsPage';
import CheckInPage      from './pages/CheckInPage';
import RoomsPage        from './pages/RoomsPage';
import HousekeepingPage from './pages/HousekeepingPage';
import MaintenancePage  from './pages/MaintenancePage';

// Commerce
import BillingPage  from './pages/BillingPage';
import GuestsPage   from './pages/GuestsPage';
import FeedbackPage from './pages/FeedbackPage';

// Admin
import AnalyticsPage from './pages/AnalyticsPage';
import StaffPage     from './pages/StaffPage';
import SettingsPage  from './pages/SettingsPage';

const ADMIN_MGR  = ['admin', 'manager'];
const DESK       = ['admin', 'manager', 'receptionist'];
const ALL_STAFF  = ['admin', 'manager', 'receptionist', 'housekeeping', 'maintenance'];

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected — all authenticated staff get the shell */}
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Operations */}
        <Route path="/dashboard"    element={<ProtectedRoute roles={DESK}><DashboardPage /></ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute roles={DESK}><ReservationsPage /></ProtectedRoute>} />
        <Route path="/checkin"      element={<ProtectedRoute roles={DESK}><CheckInPage /></ProtectedRoute>} />
        <Route path="/rooms"        element={<ProtectedRoute roles={ALL_STAFF}><RoomsPage /></ProtectedRoute>} />
        <Route path="/housekeeping" element={<ProtectedRoute roles={['admin','manager','housekeeping']}><HousekeepingPage /></ProtectedRoute>} />
        <Route path="/maintenance"  element={<ProtectedRoute roles={['admin','manager','housekeeping','maintenance']}><MaintenancePage /></ProtectedRoute>} />

        {/* Commerce */}
        <Route path="/billing"  element={<ProtectedRoute roles={DESK}><BillingPage /></ProtectedRoute>} />
        <Route path="/guests"   element={<ProtectedRoute roles={DESK}><GuestsPage /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute roles={ADMIN_MGR}><FeedbackPage /></ProtectedRoute>} />

        {/* Administration */}
        <Route path="/analytics" element={<ProtectedRoute roles={ADMIN_MGR}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/staff"     element={<ProtectedRoute roles={['admin']}><StaffPage /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute roles={['admin']}><SettingsPage /></ProtectedRoute>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
