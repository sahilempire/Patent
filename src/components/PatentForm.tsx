'use client';

import { useState } from 'react';
import { PatentApplication } from '@/lib/supabase';

export default function PatentForm() {
  const [formData, setFormData] = useState<Partial<PatentApplication>>({
    status: 'draft',
    inventors: [''],
    claims: [''],
    prior_art: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/patents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit application');
      
      // Reset form
      setFormData({
        status: 'draft',
        inventors: [''],
        claims: [''],
        prior_art: ['']
      });
      
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: 'inventors' | 'claims' | 'prior_art', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (field: 'inventors' | 'claims' | 'prior_art') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayItem = (field: 'inventors' | 'claims' | 'prior_art', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">New Patent Application</h2>
      
      <div className="space-y-2">
        <label className="block font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded h-32"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Inventors</label>
        {formData.inventors?.map((inventor, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={inventor}
              onChange={(e) => handleArrayChange('inventors', index, e.target.value)}
              required
              className="flex-1 p-2 border rounded"
              placeholder="Inventor name"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('inventors', index)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('inventors')}
          className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Add Inventor
        </button>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Claims</label>
        {formData.claims?.map((claim, index) => (
          <div key={index} className="flex gap-2">
            <textarea
              value={claim}
              onChange={(e) => handleArrayChange('claims', index, e.target.value)}
              required
              className="flex-1 p-2 border rounded"
              placeholder="Patent claim"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('claims', index)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('claims')}
          className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Add Claim
        </button>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Prior Art</label>
        {formData.prior_art?.map((art, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={art}
              onChange={(e) => handleArrayChange('prior_art', index, e.target.value)}
              required
              className="flex-1 p-2 border rounded"
              placeholder="Prior art reference"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('prior_art', index)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('prior_art')}
          className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Add Prior Art
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Submit Application
      </button>
    </form>
  );
} 