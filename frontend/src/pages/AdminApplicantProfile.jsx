import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getUsers, saveUsers } from '../utils/dataStore';

const AdminApplicantProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Default fallback if not found
  const defaultApplicant = {
    id: id || 'USR-890',
    name: 'Unknown User',
    email: '',
    phone: '',
    location: '',
    income: '',
    employer: '',
    activeLoans: 0
  };

  // Try to find the applicant in dataStore
  const getApplicantData = () => {
    const applicants = getUsers();
    if (applicants) {
      const found = applicants.find(app => app.id === id);
      if (found) return found;
    }
    return location.state?.applicant || defaultApplicant;
  };

  const [formData, setFormData] = useState(getApplicantData());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Save to dataStore
    let applicants = getUsers() || [];
    const index = applicants.findIndex(app => app.id === formData.id);
    if (index !== -1) {
      applicants[index] = formData;
    } else {
      applicants.push(formData);
    }
    saveUsers(applicants);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/applicants')}
          className="p-2 bg-[#101B57] text-[#94A3B8] border border-[#1E2A68] rounded-lg hover:bg-[#1E2A68] hover:text-[#FFFFFF] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-1 tracking-tight">Applicant Profile</h1>
          <p className="text-[#94A3B8]">View and edit complete applicant details for {formData.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Summary */}
        <div className="space-y-6">
          <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/5 rounded-bl-full"></div>
            <div className="w-24 h-24 bg-[#09133E] rounded-full flex items-center justify-center text-4xl font-bold text-[#3B82F6] border-4 border-[#1E2A68] mx-auto mb-4 relative z-10">
              {formData.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-[#FFFFFF] mb-1 relative z-10">{formData.name}</h2>
            <p className="text-[#3B82F6] font-medium mb-4 relative z-10">{formData.id}</p>
            <div className="flex justify-center gap-2 mb-6 relative z-10">
              <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-full text-xs font-bold">
                Active
              </span>
              <span className="px-3 py-1 bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 rounded-full text-xs font-bold">
                {formData.activeLoans} Active Loans
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-[#101B57] rounded-2xl border border-[#1E2A68] p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#FFFFFF]">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2 flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#09133E] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2 flex items-center gap-2">
                  <Mail size={16} /> Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#09133E] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2 flex items-center gap-2">
                  <Phone size={16} /> Phone Number
                </label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#09133E] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Location
                </label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-[#09133E] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors" 
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#FFFFFF] mb-6 border-t border-[#1E2A68] pt-8">Financial Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2 flex items-center gap-2">
                  <DollarSign size={16} /> Annual Income
                </label>
                <input 
                  type="text" 
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  className="w-full bg-[#09133E] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2 flex items-center gap-2">
                  <Briefcase size={16} /> Employer
                </label>
                <input 
                  type="text" 
                  name="employer"
                  value={formData.employer}
                  onChange={handleChange}
                  className="w-full bg-[#09133E] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors" 
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#1E2A68] flex justify-end items-center gap-4">
              {saveSuccess && (
                <span className="text-[#10B981] font-medium flex items-center gap-2 animate-fade-in-up">
                  <CheckCircle2 size={18} /> Profile Saved Successfully
                </span>
              )}
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-[#FFFFFF] rounded-xl font-bold hover:bg-[#2563EB] transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicantProfile;
