import { useState } from 'react';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';

const initialDepartments = [
    { id: 'DEP-001', name: 'Computer Science & Engineering', type: 'Academic', head: 'Dr. Abebe' },
    { id: 'DEP-002', name: 'Software Engineering', type: 'Academic', head: 'Dr. Chala' },
    { id: 'DEP-003', name: 'ICT Support', type: 'Administrative', head: 'Mr. Dawit' },
    { id: 'DEP-004', name: 'Dormitory Management', type: 'Administrative', head: 'Mrs. Sara' },
    { id: 'DEP-005', name: 'Facilities Management', type: 'Administrative', head: 'Mr. Tolosa' },
];

const ManageDepartments = () => {
    // Note: In a full production app, this would be fetched from the backend. 
    // Using simple state here per typical frontend-only scaffolding.
    const [departments, setDepartments] = useState(initialDepartments);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Departments</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure academic and administrative branches for complaint routing.</p>
                </div>

                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-md active:scale-95">
                    <Plus size={18} />
                    <span>Add Department</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                            <Building2 size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Active Departments</h2>
                    </div>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                        {departments.length} Total
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-200 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="p-4 pl-6">Department Name</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Dept. Head</th>
                                <th className="p-4">System ID</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {departments.map((dept) => (
                                <tr key={dept.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="p-4 pl-6 font-medium text-gray-900">
                                        {dept.name}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                                            dept.type === 'Academic' 
                                                ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                                        }`}>
                                            {dept.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm">
                                        {dept.head}
                                    </td>
                                    <td className="p-4">
                                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                                            {dept.id}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right space-x-2">
                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit Department">
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete Department">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 text-center">
                    Departments added here will appear in the routing options for students submitting new complaints.
                </div>
            </div>
        </div>
    );
};

export default ManageDepartments;
