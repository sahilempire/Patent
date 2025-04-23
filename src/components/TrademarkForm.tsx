'use client';

import { useState } from 'react';
import { TrademarkApplication } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

export default function TrademarkForm() {
  const [formData, setFormData] = useState<Partial<TrademarkApplication>>({
    status: 'draft',
    goods_services: [],
    usage_evidence: {
      first_use_date: '',
      first_use_commerce: '',
      commerce_type: '',
      usage_description: '',
      specimen_url: ''
    }
  });

  const [currentGoodsService, setCurrentGoodsService] = useState({
    description: '',
    class: '',
    industry: '',
    target_market: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.applicant_name) errors.applicant_name = 'Applicant name is required';
    if (!formData.trademark) errors.trademark = 'Trademark is required';
    if (!formData.mark_name) errors.mark_name = 'Mark name is required';
    if (!formData.mark_type) errors.mark_type = 'Mark type is required';
    if (!formData.owner_name) errors.owner_name = 'Owner name is required';
    if (!formData.owner_type) errors.owner_type = 'Owner type is required';
    if (!formData.owner_address) errors.owner_address = 'Owner address is required';
    if (!formData.filing_basis) errors.filing_basis = 'Filing basis is required';
    if (!formData.goods_services?.length) errors.goods_services = 'At least one goods/service is required';
    if (!file && formData.filing_basis === 'use_in_commerce') errors.file = 'Specimen file is required for use in commerce';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `specimens/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('trademark-specimens')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('trademark-specimens')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        usage_evidence: {
          ...prev.usage_evidence,
          specimen_url: publicUrl
        }
      }));
      setFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const addGoodsService = () => {
    if (!currentGoodsService.description || !currentGoodsService.class) {
      setValidationErrors(prev => ({
        ...prev,
        goods_services: 'Description and class are required'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      goods_services: [...(prev.goods_services || []), currentGoodsService]
    }));

    setCurrentGoodsService({
      description: '',
      class: '',
      industry: '',
      target_market: ''
    });
  };

  const removeGoodsService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goods_services: prev.goods_services?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // First, save the application to Supabase
      const { data: application, error: dbError } = await supabase
        .from('trademark_applications')
        .insert([formData])
        .select()
        .single();

      if (dbError) throw dbError;

      // Generate document using Gemini
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application,
          type: 'trademark'
        }),
      });

      if (!response.ok) throw new Error('Failed to generate document');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trademark-application-${application.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Reset form
      setFormData({
        status: 'draft',
        goods_services: [],
        usage_evidence: {
          first_use_date: '',
          first_use_commerce: '',
          commerce_type: '',
          usage_description: '',
          specimen_url: ''
        }
      });
      setFile(null);
      setCurrentGoodsService({
        description: '',
        class: '',
        industry: '',
        target_market: ''
      });
      
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleGoodsServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentGoodsService(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">New Trademark Application</h2>
      
      <div className="space-y-2">
        <label className="block font-medium">Applicant Name</label>
        <input
          type="text"
          name="applicant_name"
          value={formData.applicant_name || ''}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${validationErrors.applicant_name ? 'border-red-500' : ''}`}
        />
        {validationErrors.applicant_name && (
          <p className="text-red-500 text-sm">{validationErrors.applicant_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Trademark</label>
        <input
          type="text"
          name="trademark"
          value={formData.trademark || ''}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${validationErrors.trademark ? 'border-red-500' : ''}`}
        />
        {validationErrors.trademark && (
          <p className="text-red-500 text-sm">{validationErrors.trademark}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Mark Name</label>
        <input
          type="text"
          name="mark_name"
          value={formData.mark_name || ''}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${validationErrors.mark_name ? 'border-red-500' : ''}`}
        />
        {validationErrors.mark_name && (
          <p className="text-red-500 text-sm">{validationErrors.mark_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Mark Type</label>
        <select
          name="mark_type"
          value={formData.mark_type || ''}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${validationErrors.mark_type ? 'border-red-500' : ''}`}
        >
          <option value="">Select a type</option>
          <option value="word">Word Mark</option>
          <option value="design">Design Mark</option>
          <option value="composite">Composite Mark</option>
        </select>
        {validationErrors.mark_type && (
          <p className="text-red-500 text-sm">{validationErrors.mark_type}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Filing Basis</label>
        <select
          name="filing_basis"
          value={formData.filing_basis || ''}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${validationErrors.filing_basis ? 'border-red-500' : ''}`}
        >
          <option value="">Select a basis</option>
          <option value="use_in_commerce">Use in Commerce</option>
          <option value="intent_to_use">Intent to Use</option>
        </select>
        {validationErrors.filing_basis && (
          <p className="text-red-500 text-sm">{validationErrors.filing_basis}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Owner Name</label>
        <input
          type="text"
          name="owner_name"
          value={formData.owner_name || ''}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${validationErrors.owner_name ? 'border-red-500' : ''}`}
        />
        {validationErrors.owner_name && (
          <p className="text-red-500 text-sm">{validationErrors.owner_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Owner Type</label>
        <select
          name="owner_type"
          value={formData.owner_type || ''}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${validationErrors.owner_type ? 'border-red-500' : ''}`}
        >
          <option value="">Select a type</option>
          <option value="individual">Individual</option>
          <option value="corporation">Corporation</option>
          <option value="partnership">Partnership</option>
        </select>
        {validationErrors.owner_type && (
          <p className="text-red-500 text-sm">{validationErrors.owner_type}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Owner Address</label>
        <textarea
          name="owner_address"
          value={formData.owner_address || ''}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${validationErrors.owner_address ? 'border-red-500' : ''}`}
        />
        {validationErrors.owner_address && (
          <p className="text-red-500 text-sm">{validationErrors.owner_address}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Goods & Services</label>
        <div className="space-y-2">
          <input
            type="text"
            name="description"
            value={currentGoodsService.description}
            onChange={handleGoodsServiceChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="class"
            value={currentGoodsService.class}
            onChange={handleGoodsServiceChange}
            placeholder="Class"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="industry"
            value={currentGoodsService.industry}
            onChange={handleGoodsServiceChange}
            placeholder="Industry"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="target_market"
            value={currentGoodsService.target_market}
            onChange={handleGoodsServiceChange}
            placeholder="Target Market"
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={addGoodsService}
            className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Add Goods/Service
          </button>
        </div>
        {validationErrors.goods_services && (
          <p className="text-red-500 text-sm">{validationErrors.goods_services}</p>
        )}
        <div className="mt-2">
          {formData.goods_services?.map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <p className="font-medium">{item.description}</p>
                <p className="text-sm text-gray-600">Class: {item.class}</p>
              </div>
              <button
                type="button"
                onClick={() => removeGoodsService(index)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {formData.filing_basis === 'use_in_commerce' && (
        <div className="space-y-2">
          <label className="block font-medium">Specimen File</label>
          <input
            type="file"
            onChange={handleFileUpload}
            accept="image/*,.pdf"
            className="w-full p-2 border rounded"
          />
          {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
          {file && (
            <p className="text-sm text-green-600">
              File uploaded: {file.name}
            </p>
          )}
          {validationErrors.file && (
            <p className="text-red-500 text-sm">{validationErrors.file}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
} 