
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PriorArtItem {
  id: string;
  reference: string;
  type: string;
  relevance: string;
}

const PatentPriorArt: React.FC = () => {
  const { formData, updateFormData } = useAppContext();
  const { toast } = useToast();
  const [newReference, setNewReference] = useState('');
  const [newType, setNewType] = useState('');
  const [newRelevance, setNewRelevance] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize prior art array if it doesn't exist in formData
  const priorArt: PriorArtItem[] = formData.priorArt || [];

  const handleAddPriorArt = () => {
    if (!newReference.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a reference number or description",
        variant: "destructive",
      });
      return;
    }

    const newItem: PriorArtItem = {
      id: Date.now().toString(),
      reference: newReference,
      type: newType,
      relevance: newRelevance,
    };

    const updatedPriorArt = [...priorArt, newItem];
    updateFormData({ priorArt: updatedPriorArt });

    // Reset input fields
    setNewReference('');
    setNewType('');
    setNewRelevance('');

    toast({
      title: "Prior art added",
      description: "The reference has been added to your list",
    });
  };

  const handleRemovePriorArt = (id: string) => {
    const updatedPriorArt = priorArt.filter(item => item.id !== id);
    updateFormData({ priorArt: updatedPriorArt });

    toast({
      title: "Reference removed",
      description: "The prior art reference has been removed",
    });
  };

  const handleSearch = () => {
    // Simulating AI search functionality
    if (!searchTerm.trim()) {
      toast({
        title: "Empty search",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Searching patent databases",
      description: "Looking for related prior art...",
    });

    // Simulate search delay
    setTimeout(() => {
      const mockResults: PriorArtItem[] = [
        {
          id: `mock-${Date.now()}-1`,
          reference: `US10592845B2`,
          type: "Patent",
          relevance: `Related to "${searchTerm}" - Method for automated document processing`,
        },
        {
          id: `mock-${Date.now()}-2`,
          reference: `EP3182304A1`,
          type: "Patent Application",
          relevance: `Mentions "${searchTerm}" - System for document classification`,
        },
      ];

      updateFormData({ 
        searchResults: mockResults,
        lastSearchTerm: searchTerm
      });

      toast({
        title: "Search complete",
        description: `Found ${mockResults.length} potentially relevant documents`,
      });
    }, 1500);
  };

  const addSearchResult = (item: PriorArtItem) => {
    const exists = priorArt.some(art => art.reference === item.reference);
    
    if (exists) {
      toast({
        title: "Already added",
        description: "This reference is already in your list",
        variant: "destructive",
      });
      return;
    }

    const updatedPriorArt = [...priorArt, item];
    updateFormData({ priorArt: updatedPriorArt });

    toast({
      title: "Reference added",
      description: "The selected reference has been added to your list",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="knownPriorArt">Known Prior Art</Label>
        <Textarea
          id="knownPriorArt"
          name="knownPriorArt"
          placeholder="Describe any known existing solutions or technologies related to your invention"
          rows={4}
          value={formData.knownPriorArt || ''}
          onChange={(e) => updateFormData({ knownPriorArt: e.target.value })}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prior Art References</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-5">
                <Label htmlFor="newReference">Reference</Label>
                <Input
                  id="newReference"
                  placeholder="Patent number or article title"
                  value={newReference}
                  onChange={(e) => setNewReference(e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="newType">Type</Label>
                <Input
                  id="newType"
                  placeholder="Patent, Article, etc."
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                />
              </div>
              <div className="col-span-4">
                <Label htmlFor="newRelevance">Relevance</Label>
                <Input
                  id="newRelevance"
                  placeholder="How it relates to your invention"
                  value={newRelevance}
                  onChange={(e) => setNewRelevance(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleAddPriorArt} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Reference
            </Button>
          </div>

          {priorArt.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Relevance</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priorArt.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="text-sm">{item.relevance}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePriorArt(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No prior art references added yet
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search for Prior Art</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter keywords related to your invention"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>

          {formData.searchResults && formData.searchResults.length > 0 && (
            <>
              <Alert className="mb-4">
                <AlertTitle>Search Results for "{formData.lastSearchTerm}"</AlertTitle>
                <AlertDescription>
                  Found {formData.searchResults.length} potentially relevant documents
                </AlertDescription>
              </Alert>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Relevance</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.searchResults.map((item: PriorArtItem) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.reference}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="text-sm">{item.relevance}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addSearchResult(item)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatentPriorArt;
