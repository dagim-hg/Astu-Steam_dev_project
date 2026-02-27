import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Send, Upload, AlertCircle, CheckCircle, MapPin,
    Tag, Flag, FileText, Info, Camera, X, Loader, Sparkles, Building2
} from 'lucide-react';
import useAuth from '../../utils/useAuth';
import { DEPARTMENTS } from '../../utils/constants';

const SubmitComplaint = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        priority: 'Medium',
        assignedDepartment: ''
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [generatedId, setGeneratedId] = useState('');
    const [error, setError] = useState('');

    const categories = ['Academic', 'Facilities', 'IT', 'Administrative', 'Dormitory', 'Other'];
    const priorities = ['Low', 'Medium', 'High', 'Urgent'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        images.forEach(image => data.append('attachments', image));

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };
            const response = await axios.post('/api/complaints', data, config);
            setGeneratedId(response.data.complaintId);
            setSuccess(true);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit complaint');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-6 animate-fade-in relative z-10 text-center">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-50">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Submission Successful!</h1>
                <p className="text-lg text-gray-500 font-medium mb-12 leading-relaxed">
                    Your complaint has been recorded. Our staff will review it and provide updates soon.
                </p>

                <div className="bg-white border-2 border-dashed border-emerald-200 rounded-[2rem] p-10 mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">Your Tracking ID</p>
                    <p className="text-5xl font-black text-gray-900 font-mono tracking-tighter">{generatedId}</p>
                    <p className="mt-4 text-xs font-bold text-gray-400">Save this ID for manual tracking</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/student/history')}
                        className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30"
                    >
                        View My Complaints
                    </button>
                    <button
                        onClick={() => setSuccess(false)}
                        className="px-10 py-5 bg-white text-gray-700 border border-gray-200 font-black rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Submit Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Submit Complaint</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Describe the issue in detail for faster resolution.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 text-xs font-bold uppercase tracking-widest">
                    <Info size={14} />
                    Auto-ID Generated
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
                        {/* Title Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2 px-1">
                                <FileText size={16} className="text-blue-500" />
                                Complaint Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="E.g. Broken laboratory equipment in Block 3"
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-semibold text-gray-800 placeholder:text-gray-300 shadow-sm"
                            />
                        </div>

                        {/* Target Department Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2 px-1 pt-4 border-t border-gray-50">
                                <Building2 size={16} className="text-blue-500" />
                                Target Department
                            </label>
                            <select
                                name="assignedDepartment"
                                value={formData.assignedDepartment}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-semibold text-gray-800 bg-white appearance-none cursor-pointer shadow-sm hover:border-gray-200"
                            >
                                <option value="" disabled>Select the department responsible</option>
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Info size={16} className="text-blue-500" />
                                Detailed Context
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="6"
                                placeholder="Please provide specific details about the issue..."
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-semibold text-gray-800 placeholder:text-gray-300 shadow-sm resize-none"
                            ></textarea>
                        </div>

                        {/* Location Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2 px-1">
                                <MapPin size={16} className="text-blue-500" />
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="Building No., Room No., or specific area"
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-semibold text-gray-800 placeholder:text-gray-300 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 px-1">
                            <Camera size={20} className="text-blue-500" />
                            Visual Evidence (Optional)
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {previewImages.map((src, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {(previewImages.length < 4) && (
                                <label className="aspect-square rounded-2xl border-4 border-dashed border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 group">
                                    <Upload size={24} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            )}
                        </div>
                        <p className="mt-4 text-xs font-bold text-gray-400 italic">Accepted formats: JPG, PNG. Max 4 images.</p>
                    </div>
                </div>

                {/* Sidebar Configuration */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
                        {/* Category Select */}
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Tag size={16} className="text-blue-500" />
                                Category
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        className={`px-4 py-3 rounded-xl text-left text-sm font-bold transition-all border-2 ${formData.category === cat
                                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                                            : 'bg-white border-gray-50 text-gray-500 hover:border-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority Select */}
                        <div className="space-y-3 pt-4 border-t border-gray-50">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Flag size={16} className="text-blue-500" />
                                Priority
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {priorities.map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${formData.priority === p
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading || !formData.category || !formData.title || !formData.assignedDepartment}
                                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                {loading ? (
                                    <Loader className="animate-spin" />
                                ) : (
                                    <>
                                        Submit Complaint
                                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            {error && <p className="mt-4 text-xs font-bold text-red-500 text-center animate-shake">{error}</p>}
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-[2rem] p-6 border border-blue-100">
                        <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Sparkles size={14} />
                            Smart Triage
                        </h4>
                        <p className="text-xs text-blue-800 font-medium leading-relaxed italic">
                            Your complaint will be recorded in the system immediately and directly alerted to the target department you specify above.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SubmitComplaint;
