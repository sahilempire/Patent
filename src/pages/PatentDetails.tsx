import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { patentService, Patent } from '@/services/patentService';
import { toast } from 'sonner';
import { ArrowLeft, FileText, RefreshCw, Trash2, Edit } from 'lucide-react';
import { getCurrentUser } from '@/lib/supabase';

export default function PatentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patent, setPatent] = useState<Patent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPatent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        console.log(`🔄 FETCHING PATENT DETAILS FROM SUPABASE (ID: ${id})`);
        const patentData = await patentService.getPatentById(id);
        console.log('✅ PATENT DETAILS FETCHED SUCCESSFULLY:', patentData);
        setPatent(patentData);
      } catch (error) {
        console.error('❌ ERROR FETCHING PATENT DETAILS:', error);
        toast.error("Error", {
          description: "Failed to load the patent application."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatent();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !patent) return;
    
    if (!confirm('Are you sure you want to delete this patent application? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      console.log(`🔄 DELETING PATENT FROM SUPABASE (ID: ${id})`);
      await patentService.deletePatent(id);
      console.log(`✅ PATENT DELETED SUCCESSFULLY (ID: ${id})`);
      toast.success("Patent Deleted", {
        description: "The patent application has been deleted successfully."
      });
      navigate('/dashboard/patents');
    } catch (error) {
      console.error('❌ ERROR DELETING PATENT:', error);
      toast.error("Error", {
        description: "Failed to delete the patent application."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading patent details...</span>
      </div>
    );
  }

  if (!patent) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Patent Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The patent application you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate('/dashboard/patents')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/dashboard/patents')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/wizard/patent/edit/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{patent.invention_title}</CardTitle>
          <CardDescription>
            Created on {new Date(patent.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Inventors</h3>
              <p>{patent.inventor_names}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Type</h3>
              <p>{patent.invention_type}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="prior-art">Prior Art</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Brief Summary</h3>
                  <p className="whitespace-pre-line">{patent.brief_summary || 'No summary provided.'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Technical Field</h3>
                  <p className="whitespace-pre-line">{patent.technical_field || 'No technical field specified.'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Background Art</h3>
                  <p className="whitespace-pre-line">{patent.background_art || 'No background art provided.'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Detailed Description</h3>
                  <p className="whitespace-pre-line">{patent.detailed_description || 'No detailed description provided.'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Advantageous Effects</h3>
                  <p className="whitespace-pre-line">{patent.advantageous_effects || 'No advantageous effects specified.'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Claims</CardTitle>
            </CardHeader>
            <CardContent>
              {patent.claims && patent.claims.length > 0 ? (
                <div className="space-y-4">
                  {patent.claims.map((claim) => (
                    <div key={claim.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold">
                            {claim.type === 'independent' ? 'Independent Claim' : 'Dependent Claim'}
                          </span>
                          {claim.parent_id && (
                            <span className="text-sm text-muted-foreground ml-2">
                              (Depends on Claim {patent.claims?.findIndex(c => c.id === claim.parent_id) + 1})
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 whitespace-pre-line">{claim.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No claims have been added to this patent application.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prior-art">
          <Card>
            <CardHeader>
              <CardTitle>Prior Art References</CardTitle>
            </CardHeader>
            <CardContent>
              {patent.prior_art_references && patent.prior_art_references.length > 0 ? (
                <div className="space-y-4">
                  {patent.prior_art_references.map((reference) => (
                    <div key={reference.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold">{reference.reference}</span>
                          <span className="text-sm text-muted-foreground ml-2">({reference.type})</span>
                        </div>
                      </div>
                      <p className="mt-2 whitespace-pre-line">{reference.relevance}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No prior art references have been added to this patent application.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 