
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Plus, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GoodsService {
  id: string;
  description: string;
  class: string;
}

// Simplified Nice Classification examples
const niceClassifications = [
  { id: "1", name: "Class 1", description: "Chemicals" },
  { id: "9", name: "Class 9", description: "Computer hardware and software" },
  { id: "35", name: "Class 35", description: "Advertising and business" },
  { id: "36", name: "Class 36", description: "Insurance and financial services" },
  { id: "38", name: "Class 38", description: "Telecommunications" },
  { id: "41", name: "Class 41", description: "Education and entertainment" },
  { id: "42", name: "Class 42", description: "Scientific and technological services" },
  { id: "45", name: "Class 45", description: "Legal services" },
];

const TrademarkGoodsServices: React.FC = () => {
  const { formData, updateFormData } = useAppContext();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [businessDescription, setBusinessDescription] = useState(formData.businessDescription || '');
  const [showClassSuggestions, setShowClassSuggestions] = useState(false);

  // Initialize goods/services array if it doesn't exist in formData
  const goodsServices: GoodsService[] = formData.goodsServices || [];

  const handleAddItem = () => {
    if (!description.trim()) {
      toast({
        title: "Missing description",
        description: "Please enter a description of your goods or services",
        variant: "destructive",
      });
      return;
    }

    if (!selectedClass) {
      toast({
        title: "Missing class",
        description: "Please select an appropriate Nice Classification",
        variant: "destructive",
      });
      return;
    }

    const newItem: GoodsService = {
      id: Date.now().toString(),
      description: description,
      class: selectedClass,
    };

    const updatedItems = [...goodsServices, newItem];
    updateFormData({ goodsServices: updatedItems });

    // Reset input fields
    setDescription('');
    setSelectedClass('');

    toast({
      title: "Item added",
      description: "The goods/services item has been added",
    });
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = goodsServices.filter(item => item.id !== id);
    updateFormData({ goodsServices: updatedItems });

    toast({
      title: "Item removed",
      description: "The goods/services item has been removed",
    });
  };

  const handleSaveBusinessDescription = () => {
    updateFormData({ businessDescription });
    
    toast({
      title: "Description saved",
      description: "Your business description has been saved",
    });
    
    // Show AI classification suggestions based on business description
    if (businessDescription.trim()) {
      setShowClassSuggestions(true);
      generateClassSuggestions();
    }
  };

  const generateClassSuggestions = () => {
    // This is a simplified implementation for UI demonstration
    // In a real application, this would call an AI service
    
    toast({
      title: "Analyzing business description",
      description: "Generating Nice Classification suggestions...",
    });

    // Simulate AI processing delay
    setTimeout(() => {
      // Simple keyword matching for demonstration
      const mockSuggestions = [];
      
      if (businessDescription.toLowerCase().includes("software") || 
          businessDescription.toLowerCase().includes("app") || 
          businessDescription.toLowerCase().includes("technology")) {
        mockSuggestions.push({
          class: "9",
          confidence: "High",
          suggestion: "Computer software for [specific purpose]; mobile applications for [specific purpose]"
        });
        
        mockSuggestions.push({
          class: "42",
          confidence: "High",
          suggestion: "Software as a service (SaaS); design and development of computer software"
        });
      }
      
      if (businessDescription.toLowerCase().includes("consult") || 
          businessDescription.toLowerCase().includes("service") || 
          businessDescription.toLowerCase().includes("business")) {
        mockSuggestions.push({
          class: "35",
          confidence: "Medium",
          suggestion: "Business consultancy; business management assistance"
        });
      }
      
      // Always provide at least one suggestion
      if (mockSuggestions.length === 0) {
        mockSuggestions.push({
          class: "42",
          confidence: "Low",
          suggestion: "Scientific and technological services"
        });
      }

      updateFormData({ 
        classSuggestions: mockSuggestions,
      });

      toast({
        title: "Suggestions ready",
        description: `Found ${mockSuggestions.length} relevant Nice Classifications`,
      });
    }, 1500);
  };

  const useSuggestion = (classId: string, suggestion: string) => {
    setDescription(suggestion);
    setSelectedClass(classId);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="businessDescription">Describe Your Business</Label>
        <Textarea
          id="businessDescription"
          placeholder="Describe the nature of your business, products, or services in detail"
          rows={4}
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
        />
        <Button onClick={handleSaveBusinessDescription}>
          <Search className="h-4 w-4 mr-2" /> Analyze & Get Suggestions
        </Button>
      </div>

      {showClassSuggestions && formData.classSuggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suggested Nice Classifications</CardTitle>
            <CardDescription>
              Based on your business description, here are recommended classifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.classSuggestions.map((suggestion: any, index: number) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge className="mb-2">Class {suggestion.class}</Badge>
                      <Badge variant={
                        suggestion.confidence === "High" ? "default" : 
                        suggestion.confidence === "Medium" ? "secondary" : 
                        "outline"
                      } className="ml-2">
                        {suggestion.confidence} Confidence
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => useSuggestion(suggestion.class, suggestion.suggestion)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Use
                    </Button>
                  </div>
                  <p className="text-sm">{suggestion.suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Goods & Services</CardTitle>
          <CardDescription>
            Specify the exact goods and services for which you're seeking trademark protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4 mb-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div className="md:col-span-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe specific goods or services covered by your trademark"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-20"
                  />
                </div>
                <div>
                  <Label htmlFor="class">Nice Class</Label>
                  <Select 
                    value={selectedClass} 
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="h-20">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {niceClassifications.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}: {cls.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>

            {goodsServices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-24">Class</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goodsServices.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Badge>{item.class}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground flex flex-col items-center">
                <AlertCircle className="h-6 w-6 mb-2" />
                <p>No goods or services added yet</p>
                <p className="text-sm">Add at least one item to continue</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrademarkGoodsServices;
