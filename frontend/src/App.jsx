import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth, { ProtectedRoute } from './utils/useAuth';

// Layouts
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Home from './pages/Home';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import ComplaintHistory from './pages/student/ComplaintHistory';
import ComplaintDetails from './pages/student/ComplaintDetails';
import AIAssistant from './pages/student/AIAssistant';
import Profile from './pages/student/Profile';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import AssignedComplaints from './pages/staff/AssignedComplaints';
import UpdateComplaint from './pages/staff/UpdateComplaint';
import StaffProfile from './pages/staff/StaffProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import RegisterUser from './pages/admin/RegisterUser';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageCategories from './pages/admin/ManageCategories';
import AllComplaints from './pages/admin/AllComplaints';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

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
            {/* Public Routes - Landing & Auth */}
            <Route path="/" element={!user ? <Home /> : <Navigate to="/dashboard" replace />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" replace />} />

            {/* Protected System Routes */}
            <Route element={<ProtectedRoute user={user}><Layout user={user} onLogout={logout} /></ProtectedRoute>}>
                {/* Global Dashboard Redirector */}
                <Route path="/dashboard" element={
                    <Navigate to={
                        user?.role === 'Admin' ? '/admin/dashboard' :
                            user?.role === 'Staff' ? '/staff/dashboard' :
                                '/student/dashboard'
                    } replace />
                } />

                {/* Student Specific Routes */}
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
                <Route path="student/complaint/:id" element={
                    <ProtectedRoute user={user} allowedRoles={['Student']}>
                        <ComplaintDetails />
                    </ProtectedRoute>
                } />
                <Route path="student/ai" element={
                    <ProtectedRoute user={user} allowedRoles={['Student']}>
                        <AIAssistant />
                    </ProtectedRoute>
                } />
                <Route path="student/profile" element={
                    <ProtectedRoute user={user} allowedRoles={['Student']}>
                        <Profile />
                    </ProtectedRoute>
                } />

                {/* Staff Routes */}
                <Route path="staff/dashboard" element={
                    <ProtectedRoute user={user} allowedRoles={['Staff', 'Admin']}>
                        <StaffDashboard />
                    </ProtectedRoute>
                } />
                <Route path="staff/assigned" element={
                    <ProtectedRoute user={user} allowedRoles={['Staff', 'Admin']}>
                        <AssignedComplaints />
                    </ProtectedRoute>
                } />
                <Route path="staff/update" element={
                    <ProtectedRoute user={user} allowedRoles={['Staff', 'Admin']}>
                        <UpdateComplaint />
                    </ProtectedRoute>
                } />
                <Route path="staff/profile" element={
                    <ProtectedRoute user={user} allowedRoles={['Staff', 'Admin']}>
                        <StaffProfile />
                    </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="admin/dashboard" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="admin/users/register" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <RegisterUser />
                    </ProtectedRoute>
                } />

                <Route path="admin/users" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <UserManagement />
                    </ProtectedRoute>
                } />

                <Route path="admin/departments" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <ManageDepartments />
                    </ProtectedRoute>
                } />

                <Route path="admin/categories" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <ManageCategories />
                    </ProtectedRoute>
                } />

                <Route path="admin/complaints" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <AllComplaints />
                    </ProtectedRoute>
                } />

                <Route path="admin/analytics" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <AdminAnalytics />
                    </ProtectedRoute>
                } />

                <Route path="admin/settings" element={
                    <ProtectedRoute user={user} allowedRoles={['Admin']}>
                        <AdminSettings />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Final Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
