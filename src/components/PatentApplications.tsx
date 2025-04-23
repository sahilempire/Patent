'use client';

import { useState, useEffect } from 'react';
import { PatentApplication } from '@/lib/supabase';

export default function PatentApplications() {
  const [applications, setApplications] = useState<PatentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/patents');
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
      <h2 className="text-2xl font-bold">Patent Applications</h2>
      <div className="grid gap-4">
        {applications.map((app) => (
          <div key={app.id} className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold">{app.title}</h3>
            <p className="text-gray-600">Status: {app.status}</p>
            <div className="mt-2">
              <h4 className="font-medium">Inventors:</h4>
              <ul className="list-disc list-inside">
                {app.inventors.map((inventor, index) => (
                  <li key={index}>{inventor}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <h4 className="font-medium">Claims:</h4>
              <ul className="list-disc list-inside">
                {app.claims.map((claim, index) => (
                  <li key={index}>{claim}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 