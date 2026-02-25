import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth, { ProtectedRoute } from './utils/useAuth';

// Layouts
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Home from './pages/Home';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import ComplaintHistory from './pages/student/ComplaintHistory';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

// Components
import Chatbot from './components/Chatbot';

function App() {
    const { user, loading, logout } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Initializing ASTU Smart System...</p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute user={user}><Layout user={user} onLogout={logout} /></ProtectedRoute>}>
                {/* Default Dashboard Mapping */}
                <Route index element={
                    user ? (
                        <Navigate to={user.role === 'Admin' ? '/admin/dashboard' : user.role === 'Staff' ? '/staff/dashboard' : '/student/dashboard'} replace />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } />

                {/* Student Routes */}
                <Route path="student/dashboard" element={
                    <ProtectedRoute user={user} allowedRoles={['Student']}>
                        <div className="relative h-full">
                            <StudentDashboard />
                            <Chatbot />
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="student/submit" element={
                    <ProtectedRoute user={user} allowedRoles={['Student']}>
                        <SubmitComplaint />
                    </ProtectedRoute>
                } />
                <Route path="student/history" element={
                    <ProtectedRoute user={user} allowedRoles={['Student']}>
                        <ComplaintHistory />
                    </ProtectedRoute>
                } />

                {/* Staff Routes */}
                <Route path="staff/dashboard" element={
                    <ProtectedRoute user={user} allowedRoles={['Staff', 'Admin']}>
                        <StaffDashboard />
                    </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="admin/dashboard" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="admin/users" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <UserManagement />
                    </ProtectedRoute>
                } />

                <Route path="admin/settings" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
                            <h2 className="text-xl font-bold mb-4">System Settings</h2>
                            <p className="text-gray-500">This feature is currently under development.</p>
                        </div>
                    </ProtectedRoute>
                } />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
