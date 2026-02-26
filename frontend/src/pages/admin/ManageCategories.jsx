import { useState } from 'react';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';

const initialCategories = [
    { id: 'CAT-001', name: 'Hardware Issue', description: 'Problems with physical devices (PCs, printers, etc.)', count: 45 },
    { id: 'CAT-002', name: 'Software Issue', description: 'Application bugs, licensing, or OS problems', count: 32 },
    { id: 'CAT-003', name: 'Network & Internet', description: 'Wi-Fi connectivity, LAN issues, or slow speeds', count: 58 },
    { id: 'CAT-004', name: 'Dorm Maintenance', description: 'Plumbing, electricity, or structural issues in dorms', count: 21 },
    { id: 'CAT-005', name: 'Academic Services', description: 'Registration, grading, or library services', count: 14 },
];

const ManageCategories = () => {
    const [categories, setCategories] = useState(initialCategories);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure the classification types for system complaints.</p>
                </div>

                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-md active:scale-95">
                    <Plus size={18} />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                            <Tag size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Active Complaint Categories</h2>
                    </div>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                        {categories.length} Total
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-200 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="p-4 pl-6">Category Name</th>
                                <th className="p-4 hidden sm:table-cell">Description</th>
                                <th className="p-4 text-center">Active Issues</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-emerald-50/50 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="font-semibold text-gray-900">{cat.name}</div>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5">{cat.id}</div>
                                    </td>
                                    <td className="p-4 hidden sm:table-cell text-sm text-gray-500 max-w-xs truncate">
                                        {cat.description}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-lg border border-gray-200 min-w-[2.5rem]">
                                            {cat.count}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right space-x-2">
                                        <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100" title="Edit Category">
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete Category">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageCategories;
