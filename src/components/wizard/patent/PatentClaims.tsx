
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Claim {
  id: string;
  text: string;
  type: 'independent' | 'dependent';
  dependsOn?: string;
}

const PatentClaims: React.FC = () => {
  const { formData, updateFormData } = useAppContext();
  const { toast } = useToast();
  const [newClaim, setNewClaim] = useState('');

  // Initialize claims array if it doesn't exist in formData
  const claims: Claim[] = formData.claims || [];

  const handleAddClaim = () => {
    if (!newClaim.trim()) {
      toast({
        title: "Empty claim",
        description: "Please enter claim text before adding",
        variant: "destructive",
      });
      return;
    }

    // Simple detection of dependent claims (if they start with references like "The method of claim 1...")
    const isDependentClaim = /claim\s+\d+/i.test(newClaim);
    const dependsOnMatch = newClaim.match(/claim\s+(\d+)/i);
    const dependsOn = dependsOnMatch ? dependsOnMatch[1] : undefined;

    const newClaimItem: Claim = {
      id: Date.now().toString(),
      text: newClaim,
      type: isDependentClaim ? 'dependent' : 'independent',
      ...(isDependentClaim && dependsOn && { dependsOn }),
    };

    const updatedClaims = [...claims, newClaimItem];
    updateFormData({ claims: updatedClaims });

    // Reset input field
    setNewClaim('');

    toast({
      title: "Claim added",
      description: `Added a new ${isDependentClaim ? 'dependent' : 'independent'} claim`,
    });
  };

  const handleRemoveClaim = (id: string) => {
    const updatedClaims = claims.filter(claim => claim.id !== id);
    updateFormData({ claims: updatedClaims });

    toast({
      title: "Claim removed",
      description: "The claim has been removed from your list",
    });
  };

  const generateAISuggestions = () => {
    // Simplified placeholder for AI suggestion generation
    const inventionTitle = formData.inventionTitle || '';
    const inventionSummary = formData.briefSummary || '';
    
    if (!inventionTitle || !inventionSummary) {
      toast({
        title: "Missing information",
        description: "Please complete the basic information about your invention first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Generating suggestions",
      description: "Our AI is analyzing your invention details...",
    });

    // Simulate AI processing delay
    setTimeout(() => {
      const mockSuggestions = [
        `1. A method for ${inventionTitle.toLowerCase()}, comprising:\n- capturing data related to intellectual property;\n- analyzing the data using artificial intelligence;\n- generating documentation based on the analysis; and\n- presenting the documentation in a user interface.`,
        `2. The method of claim 1, wherein generating documentation comprises formatting the documentation according to jurisdiction-specific requirements.`,
        `3. The method of claim 1, further comprising validating the documentation against regulatory requirements.`
      ];

      updateFormData({ claimSuggestions: mockSuggestions });

      toast({
        title: "Suggestions ready",
        description: "AI has generated claim suggestions based on your invention",
      });
    }, 2000);
  };

  const useSuggestion = (suggestion: string) => {
    setNewClaim(suggestion);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="newClaim">Patent Claims</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateAISuggestions}
          >
            Generate AI Suggestions
          </Button>
        </div>

        <Alert className="mb-4">
          <AlertTitle>Claim Writing Tips</AlertTitle>
          <AlertDescription className="text-sm">
            <ul className="list-disc ml-5 space-y-1">
              <li>Independent claims should be broad but clear</li>
              <li>Dependent claims should reference parent claims and add specific features</li>
              <li>Each claim should be a single sentence</li>
              <li>Use precise language to describe your invention</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Textarea
          id="newClaim"
          placeholder="Enter a new claim for your patent application"
          rows={4}
          value={newClaim}
          onChange={(e) => setNewClaim(e.target.value)}
        />

        <Button onClick={handleAddClaim} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Claim
        </Button>
      </div>

      {formData.claimSuggestions && formData.claimSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI-Suggested Claims</CardTitle>
            <CardDescription>
              These claims were generated based on your invention details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.claimSuggestions.map((suggestion: string, index: number) => (
                <div key={index} className="p-3 bg-secondary rounded-md relative">
                  <p className="text-sm whitespace-pre-wrap">{suggestion}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => useSuggestion(suggestion)}
                  >
                    Use This Claim
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Claims ({claims.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {claims.length > 0 ? (
            <div className="space-y-4">
              {claims.map((claim, index) => (
                <div key={claim.id} className="p-4 border rounded-md relative">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Claim {index + 1}</span>
                        <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {claim.type === 'independent' ? 'Independent' : `Dependent on Claim ${claim.dependsOn}`}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{claim.text}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveClaim(claim.id)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No claims added yet. Add at least one independent claim to define your invention.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatentClaims;
