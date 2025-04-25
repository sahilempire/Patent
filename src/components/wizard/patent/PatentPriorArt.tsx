import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PatentPriorArtProps {
  formData: {
    priorArtReferences: Array<{
      reference: string;
      type: string;
      relevance: string;
    }>;
    newReference: string;
    newType: string;
    newRelevance: string;
    searchKeywords: string;
    searchResults: Array<{
      reference: string;
      type: string;
      relevance: string;
    }> | null;
  };
  updateFormData: (data: any) => void;
}

const PatentPriorArt: React.FC<PatentPriorArtProps> = ({ formData, updateFormData }) => {
  const { toast } = useToast();

  const handleAddReference = () => {
    if (formData.newReference && formData.newType && formData.newRelevance) {
      const newReference = {
        reference: formData.newReference,
        type: formData.newType,
        relevance: formData.newRelevance,
      };
      updateFormData({
        priorArtReferences: [...(formData.priorArtReferences || []), newReference],
        newReference: '',
        newType: '',
        newRelevance: '',
      });
      toast({
        title: 'Reference Added',
        description: 'Prior art reference has been added successfully.',
      });
    }
  };

  const handleRemoveReference = (index: number) => {
    if (!formData.priorArtReferences) return;
    
    const updatedReferences = [...formData.priorArtReferences];
    updatedReferences.splice(index, 1);
    updateFormData({ priorArtReferences: updatedReferences });
    toast({
      title: 'Reference Removed',
      description: 'Prior art reference has been removed successfully.',
    });
  };

  const handleSearch = () => {
    if (formData.searchKeywords) {
      // Simulate search delay
      setTimeout(() => {
        const mockResults = [
          {
            reference: 'US Patent No. 1234567',
            type: 'Patent',
            relevance: 'Similar to your invention in terms of...',
          },
          {
            reference: 'Journal Article: "Advanced Technology"',
            type: 'Publication',
            relevance: 'Discusses related concepts...',
          },
        ];
        updateFormData({ searchResults: mockResults });
        toast({
          title: 'Search Complete',
          description: 'Found relevant prior art references.',
        });
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Prior Art References</h2>
        <p className="text-gray-500">
          Add and manage prior art references that are relevant to your invention.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Reference (e.g., Patent number, Publication)"
            value={formData.newReference}
            onChange={(e) => updateFormData({ newReference: e.target.value })}
          />
          <Select
            value={formData.newType}
            onValueChange={(value) => updateFormData({ newType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Patent">Patent</SelectItem>
              <SelectItem value="Publication">Publication</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Relevance"
            value={formData.newRelevance}
            onChange={(e) => updateFormData({ newRelevance: e.target.value })}
          />
        </div>
        <Button onClick={handleAddReference} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Reference
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Current References</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Relevance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(formData.priorArtReferences || []).map((reference, index) => (
              <TableRow key={index}>
                <TableCell>{reference.reference}</TableCell>
                <TableCell>{reference.type}</TableCell>
                <TableCell>{reference.relevance}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveReference(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Search Prior Art</h3>
        <div className="flex gap-4">
          <Input
            placeholder="Enter keywords to search"
            value={formData.searchKeywords}
            onChange={(e) => updateFormData({ searchKeywords: e.target.value })}
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        {formData.searchResults && formData.searchResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Search Results</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Relevance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.searchResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.reference}</TableCell>
                    <TableCell>{result.type}</TableCell>
                    <TableCell>{result.relevance}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateFormData({
                            priorArtReferences: [...(formData.priorArtReferences || []), result],
                          });
                          toast({
                            title: 'Reference Added',
                            description: 'Search result has been added to your references.',
                          });
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatentPriorArt;
