import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { patentService, Patent } from '@/services/patentService';
import { getCurrentUser } from '@/lib/supabase';
import { toast } from 'sonner';
import { FileText, Plus, RefreshCw } from 'lucide-react';

export default function PatentDashboard() {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        setLoading(true);
        // Get current user
        const user = await getCurrentUser();
        if (!user) {
          toast.error("Authentication Required", {
            description: "Please sign in to view your patent applications."
          });
          navigate('/login');
          return;
        }
        
        // Fetch user's patents
        const userPatents = await patentService.getUserPatents(user.id);
        setPatents(userPatents);
      } catch (error) {
        console.error('Error fetching patents:', error);
        toast.error("Error", {
          description: "Failed to load your patent applications."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatents();
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Patent Applications</h1>
        <Button onClick={() => navigate('/wizard/patent')}>
          <Plus className="mr-2 h-4 w-4" />
          New Patent Application
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading your patents...</span>
        </div>
      ) : patents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Patent Applications Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't created any patent applications yet. Start by creating your first one.
            </p>
            <Button onClick={() => navigate('/wizard/patent')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Patent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patents.map((patent) => (
            <Card key={patent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{patent.invention_title}</CardTitle>
                <CardDescription>
                  Created on {new Date(patent.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Inventors: {patent.inventor_names}
                </p>
                <p className="text-sm text-muted-foreground">
                  Type: {patent.invention_type}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/dashboard/patents/${patent.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 