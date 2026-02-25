import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/useAuth';
import { Users, Search, Filter, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filtering states
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // Action states
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

    const { user: currentUser } = useAuth(); // rename to avoid conflict with users array

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            };
            const { data } = await axios.get('/api/admin/users', config);
            setUsers(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentUser]);

    const handleDeleteUser = async (id, email) => {
        if (email === 'admin@astu.edu.et') {
            setActionMessage({ type: 'error', text: 'Cannot delete the master system admin.' });
            return;
        }

        if (id === currentUser._id) {
            setActionMessage({ type: 'error', text: 'You cannot delete your own account.' });
            return;
        }

        if (window.confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
            try {
                setDeleteLoading(id);
                const config = {
                    headers: { Authorization: `Bearer ${currentUser.token}` }
                };
                await axios.delete(`/api/admin/users/${id}`, config);

                // Remove from local state
                setUsers(users.filter(u => u._id !== id));
                setActionMessage({ type: 'success', text: 'User deleted successfully' });

                // Clear message after 3 seconds
                setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
            } catch (err) {
                setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete user' });
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    // Derived filtered users list
    const filteredUsers = users.filter(usr => {
        const matchesSearch =
            usr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (usr.studentIdNum && usr.studentIdNum.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = roleFilter === 'All' || usr.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
                <AlertCircle size={32} className="mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">Error Loading Users</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">View, filter, and manage all accounts in the ASTU System.</p>
                </div>

                <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium">
                    <Users size={18} />
                    <span>{users.length} Total Users</span>
                </div>
            </div>

            {/* Notifications */}
            {actionMessage.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${actionMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                    {actionMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <p className="font-medium">{actionMessage.text}</p>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email, or Student ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <div className="relative w-full md:w-48 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Filter size={18} />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all appearance-none cursor-pointer"
                    >
                        <option value="All">All Roles</option>
                        <option value="Student">Students</option>
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admins</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                                <th className="p-4">Name & Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4 hidden sm:table-cell">Department / Info</th>
                                <th className="p-4 hidden md:table-cell">System ID</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No users match your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((usr) => (
                                    <tr key={usr._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">{usr.name}</div>
                                            <div className="text-sm text-gray-500">{usr.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${usr.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                    usr.role === 'Staff' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-green-50 text-green-700 border-green-200'
                                                }`}>
                                                {usr.role}
                                            </span>
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">
                                            {usr.department ? (
                                                <div className="text-sm text-gray-700">{usr.department}</div>
                                            ) : usr.studentIdNum ? (
                                                <div className="text-sm text-gray-700">Student ID: {usr.studentIdNum}</div>
                                            ) : (
                                                <div className="text-sm text-gray-400 italic">N/A</div>
                                            )}
                                            {usr.dormBlock && <div className="text-xs text-gray-500">Dorm: {usr.dormBlock}</div>}
                                        </td>
                                        <td className="p-4 hidden md:table-cell text-sm text-gray-500 font-mono">
                                            {usr.systemId || 'N/A'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(usr._id, usr.email)}
                                                disabled={deleteLoading === usr._id || usr.email === 'admin@astu.edu.et' || usr._id === currentUser._id}
                                                className={`p-2 rounded-lg transition-colors ${(usr.email === 'admin@astu.edu.et' || usr._id === currentUser._id) ?
                                                        'text-gray-300 cursor-not-allowed hidden' :
                                                        'text-red-500 hover:bg-red-50 hover:text-red-700'
                                                    }`}
                                                title="Delete User"
                                            >
                                                {deleteLoading === usr._id ? (
                                                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Trash2 size={20} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
