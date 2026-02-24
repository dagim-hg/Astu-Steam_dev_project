import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, X, AlertCircle, FileText, Send } from 'lucide-react';
import useAuth from '../../utils/useAuth';

const SubmitComplaint = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
    });
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length + files.length > 3) {
            setError('You can only upload up to 3 attachments.');
            return;
        }

        const validFiles = selectedFiles.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

            if (!isValidType) setError('Invalid file type. Only JPG, PNG, PDF, and DOC are allowed.');
            if (!isValidSize) setError('File size must be less than 5MB.');

            return isValidType && isValidSize;
        });

        setFiles([...files, ...validFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('description', formData.description);

            files.forEach(file => {
                data.append('attachments', file);
            });

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post('/api/complaints', data, config);
            navigate('/student/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in relative z-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Submit a Complaint</h1>
                <p className="text-sm text-gray-500 mt-1">Please provide detailed information to help us resolve your issue quickly.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
                {/* Subtle top border gradient */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                            <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={18} />
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Complaint Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                                placeholder="e.g., Projector not working in Room 302"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white cursor-pointer"
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="Academic">Academic Affairs</option>
                                <option value="Facilities">Facilities & Maintenance</option>
                                <option value="IT">IT Support</option>
                                <option value="Administrative">Administrative/Registrar</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Detailed Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                required
                                rows="5"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white resize-y"
                                placeholder="Please describe the issue in detail. Include times, locations, and any relevant context..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Attachments (Optional - Max 3)
                            </label>

                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50/50 transition-colors overflow-hidden relative group">
                                <div className="space-y-2 text-center relative z-10 w-full">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>Upload files</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, PDF, DOC up to 5MB
                                    </p>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <ul className="mt-4 space-y-2">
                                    {files.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
                                            <div className="flex items-center flex-1 truncate">
                                                <FileText size={18} className="text-blue-500 mr-3 flex-shrink-0" />
                                                <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                                                <span className="ml-2 text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="ml-4 flex-shrink-0 text-gray-400 hover:text-red-500 focus:outline-none transition-colors p-1"
                                            >
                                                <X size={18} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/student/dashboard')}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm shadow-blue-500/30 transition-all`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={16} className="mr-2" />
                                    Submit Complaint
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitComplaint;
