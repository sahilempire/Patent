
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Plus, Search, X, FileText, InfoIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface GoodsService {
  id: string;
  description: string;
  class: string;
}

// Nice Classification categories
const niceClassifications = [
  { id: "1", name: "Class 1", description: "Chemicals" },
  { id: "9", name: "Class 9", description: "Computer hardware and software" },
  { id: "16", name: "Class 16", description: "Paper goods and printed materials" },
  { id: "25", name: "Class 25", description: "Clothing" },
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
  const [showClassSuggestions, setShowClassSuggestions] = useState(false);
  const [businessDescription, setBusinessDescription] = useState(formData.businessDescription || '');

  // Initialize goods/services array if it doesn't exist in formData
  const goodsServices: GoodsService[] = formData.goodsServices || [];

  // Create form
  const form = useForm({
    defaultValues: {
      description: '',
      class: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!data.description.trim()) {
      toast({
        title: "Missing description",
        description: "Please enter a description of your goods or services",
        variant: "destructive",
      });
      return;
    }

    if (!data.class) {
      toast({
        title: "Missing class",
        description: "Please select an appropriate Nice Classification",
        variant: "destructive",
      });
      return;
    }

    const newItem: GoodsService = {
      id: Date.now().toString(),
      description: data.description,
      class: data.class,
    };

    const updatedItems = [...goodsServices, newItem];
    updateFormData({ goodsServices: updatedItems });

    // Reset form
    form.reset();

    toast({
      title: "Item added",
      description: "The goods/services item has been added",
    });
  });

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
    form.setValue('description', suggestion);
    form.setValue('class', classId);
  };

  return (
    <div className="space-y-8">
      {/* Business Description Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" /> Business Description
          </CardTitle>
          <CardDescription>
            Tell us about your business to help identify the appropriate trademark classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessDescription">
                Describe your business, products, or services
              </Label>
              <Textarea
                id="businessDescription"
                placeholder="e.g., We develop mobile applications for fitness tracking and provide online coaching services"
                rows={4}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Include detailed information about what you sell or provide to customers
              </p>
            </div>
            <Button onClick={handleSaveBusinessDescription} className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" /> Analyze & Get Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions Section */}
      {showClassSuggestions && formData.classSuggestions && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" /> Suggested Classifications
            </CardTitle>
            <CardDescription>
              Based on your business description, we recommend these trademark classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {formData.classSuggestions.map((suggestion: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                      <Badge className="mb-1">Nice Class {suggestion.class}</Badge>
                      <Badge variant={
                        suggestion.confidence === "High" ? "default" : 
                        suggestion.confidence === "Medium" ? "secondary" : 
                        "outline"
                      } className="ml-1">
                        {suggestion.confidence} Match
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
                  <p className="text-sm mt-2">{suggestion.suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Goods & Services Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" /> Add Goods & Services
          </CardTitle>
          <CardDescription>
            Specify the exact goods and services for which you're seeking trademark protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Description
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <p>Be specific about the exact goods or services you offer. For example, "Computer software for project management" is better than just "Software".</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe specific goods or services covered by your trademark"
                            className="resize-none min-h-20"
                          />
                        </FormControl>
                        <FormDescription>
                          Clearly describe what you provide to customers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nice Class
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Select the international classification that best matches your goods or services.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {niceClassifications.map(cls => (
                              <SelectItem key={cls.id} value={cls.id}>
                                Class {cls.id}: {cls.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          International classification category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add to Your Application
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Added Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Goods & Services</CardTitle>
          <CardDescription>
            Items you've added to your trademark application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {goodsServices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24">Class</TableHead>
                  <TableHead className="w-16 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goodsServices.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="align-top">{item.description}</TableCell>
                    <TableCell className="align-top">
                      <Badge>Class {item.class}</Badge>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <Button
                        variant="ghost"
                        size="icon"
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
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center border rounded-lg bg-muted/20">
              <AlertCircle className="h-8 w-8 mb-2 text-muted-foreground/70" />
              <p className="font-medium">No goods or services added yet</p>
              <p className="text-sm mt-1">Add at least one item to continue with your application</p>
            </div>
          )}
        </CardContent>
        {goodsServices.length > 0 && (
          <CardFooter className="border-t px-6 py-4 bg-muted/10">
            <div className="w-full flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{goodsServices.length}</span> item(s) added to your application
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Badge variant="outline" className="mr-2">
                        {new Set(goodsServices.map(item => item.class)).size} Classes
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of different Nice Classification classes in your application.</p>
                    <p className="text-xs mt-1">Note: Additional classes may incur extra filing fees.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default TrademarkGoodsServices;
