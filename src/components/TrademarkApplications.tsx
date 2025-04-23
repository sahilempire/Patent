'use client';

import { useState, useEffect } from 'react';
import { TrademarkApplication } from '@/lib/supabase';

export default function TrademarkApplications() {
  const [applications, setApplications] = useState<TrademarkApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/trademarks');
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Trademark Applications</h2>
      <div className="grid gap-4">
        {applications.map((app) => (
          <div key={app.id} className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold">{app.mark_name}</h3>
            <p className="text-gray-600">Status: {app.status}</p>
            <p className="text-gray-600">Applicant: {app.applicant_name}</p>
            <p className="text-gray-600">Filing Basis: {app.filing_basis}</p>
            <div className="mt-2">
              <h4 className="font-medium">Goods & Services:</h4>
              <ul className="list-disc list-inside">
                {app.goods_services.map((item, index) => (
                  <li key={index}>{item.description}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 