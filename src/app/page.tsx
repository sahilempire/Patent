'use client';

import { useState } from 'react';
import TrademarkApplications from '@/components/TrademarkApplications';
import PatentApplications from '@/components/PatentApplications';
import TrademarkForm from '@/components/TrademarkForm';
import PatentForm from '@/components/PatentForm';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'trademarks' | 'patents'>('trademarks');
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Intellectual Property Management</h1>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('trademarks')}
          className={`px-4 py-2 rounded ${
            activeTab === 'trademarks'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Trademarks
        </button>
        <button
          onClick={() => setActiveTab('patents')}
          className={`px-4 py-2 rounded ${
            activeTab === 'patents'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Patents
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showForm ? 'View Applications' : `New ${activeTab === 'trademarks' ? 'Trademark' : 'Patent'} Application`}
        </button>
      </div>

      {showForm ? (
        activeTab === 'trademarks' ? (
          <TrademarkForm />
        ) : (
          <PatentForm />
        )
      ) : (
        activeTab === 'trademarks' ? (
          <TrademarkApplications />
        ) : (
          <PatentApplications />
        )
      )}
    </main>
  );
} 