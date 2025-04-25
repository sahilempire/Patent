import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Download, ArrowRight, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DocumentGenerator from "@/components/wizard/patent/DocumentGenerator";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext';
import { patentService } from '@/services/patentService';
import { getCurrentUser } from '@/lib/supabase';
import Anthropic from '@anthropic-ai/sdk';

interface FormData {
  inventionTitle: string;
  inventorNames: string;
  inventionType: string;
  briefSummary: string;
  aiSuggestions: string[] | null;
  technicalField: string;
  backgroundArt: string;
  detailedDescription: string;
  detailedDescriptionSuggestions: string[] | null;
  advantageousEffects: string;
  drawingReferences: string;
  figure1: string;
  figure2: string;
  claims: Array<{
    id: string;
    text: string;
    type: 'independent' | 'dependent';
    parentId?: string;
  }>;
  newClaim: {
    text: string;
    type: 'independent' | 'dependent';
    parentId?: string;
  };
  claimSuggestions: string[] | null;
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
}

const initialFormData: FormData = {
  inventionTitle: '',
  inventorNames: '',
  inventionType: '',
  briefSummary: '',
  aiSuggestions: null,
  technicalField: '',
  backgroundArt: '',
  detailedDescription: '',
  detailedDescriptionSuggestions: null,
  advantageousEffects: '',
  drawingReferences: '',
  figure1: '',
  figure2: '',
  claims: [],
  newClaim: {
    text: '',
    type: 'independent',
  },
  claimSuggestions: null,
  priorArtReferences: [],
  newReference: '',
  newType: '',
  newRelevance: '',
  searchKeywords: '',
  searchResults: null,
};

// Add the Steps component
const Steps: React.FC<{ currentStep: number; steps: { name: string }[] }> = ({ currentStep, steps }) => {
  return (
    <div className="flex mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div className="flex items-center w-full">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index < currentStep ? 'bg-green-500 text-white' : 
              index === currentStep ? 'bg-blue-500 text-white' : 
              'bg-gray-200 text-gray-500'
            }`}>
              {index < currentStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                index < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            )}
          </div>
          <span className="text-xs mt-2 text-center font-medium">
            {step.name}
          </span>
        </div>
      ))}
    </div>
  );
};

const PatentWizard: React.FC = () => {
  const { formData, updateFormData, currentStep, setCurrentStep } = useAppContext();
  const { toast } = useToast();
  const totalSteps = 4;
  const [showDocumentGenerator, setShowDocumentGenerator] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isGeneratingDetailedSuggestions, setIsGeneratingDetailedSuggestions] = useState(false);

  // Add the patentSteps array
  const patentSteps = [
    { name: "Basic Info" },
    { name: "Detailed Description" },
    { name: "Prior Art" },
    { name: "Claims" }
  ];

  console.log(patentSteps.length);

  // Ensure formData has all required properties with default values
  React.useEffect(() => {
    // Check if formData needs to be initialized with the new structure
    if (!formData.claims || !formData.newClaim) {
      const updatedFormData = {
        ...formData,
        claims: formData.claims || [],
        newClaim: formData.newClaim || {
          text: '',
          type: 'independent',
        },
        claimSuggestions: formData.claimSuggestions || null,
        priorArtReferences: formData.priorArtReferences || [],
        newReference: formData.newReference || '',
        newType: formData.newType || '',
        newRelevance: formData.newRelevance || '',
        searchKeywords: formData.searchKeywords || '',
        searchResults: formData.searchResults || null,
      };
      updateFormData(updatedFormData);
    }
  }, [formData, updateFormData]);

  const validateStep = (step: number): boolean => {
    console.log('Validating step', step, 'Current form data:', formData);
    // Ensure formData has all required properties
    if (!formData) return false;
    
    switch (step) {
      case 1:
        return !!(
          formData.inventionTitle &&
          formData.inventorNames &&
          formData.inventionType &&
          formData.briefSummary
        );
      case 2:
        return !!(
          formData.technicalField &&
          formData.backgroundArt &&
          formData.detailedDescription &&
          formData.advantageousEffects
        );
      case 3:
        // Prior art is optional, so we don't require it
        return true;
      case 4:
        // Require at least one independent claim
        return Array.isArray(formData.claims) && 
               formData.claims.some(claim => claim && claim.type === 'independent');
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      console.log('Moving to next step. Current form data:', formData);
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Step validation failed. Current form data:', formData);
      toast({
        title: "Incomplete Step",
        description: "Please complete all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    console.log('Moving to previous step. Current form data:', formData);
    setCurrentStep(currentStep - 1);
  };

  const handleDownload = () => {
    console.log('Downloading application. Current form data:', formData);
    // Ensure formData exists
    if (!formData) {
      toast({
        title: "Error",
        description: "Application data is not available",
        variant: "destructive"
      });
      return;
    }
    
    // Check if all required steps are completed
    const isComplete = [1, 2, 4].every(step => validateStep(step));
    
    if (!isComplete) {
      toast({
        title: "Incomplete Application",
        description: "Please complete all required steps before downloading",
        variant: "destructive"
      });
      return;
    }

    // Generate the patent application document
    toast({
      title: "Generating Application",
      description: "Your patent application is being prepared for download",
    });

    // Simulate document generation delay
    setTimeout(() => {
      // In a real application, this would generate a PDF or other document format
      // For now, we'll just show a success message
      toast({
        title: "Download Ready",
        description: "Your patent application has been generated successfully",
      });
      
      // In a real application, this would trigger a download
      // For example:
      // const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `patent-application-${formData.inventionTitle.replace(/\s+/g, '-').toLowerCase()}.json`;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // URL.revokeObjectURL(url);
    }, 2000);
  };

  const handleFinish = async () => {
    console.log('🔄 Starting handleFinish function');
    console.log('Current step:', currentStep);
    console.log('Form data:', formData);

    if (!validateStep(currentStep)) {
      console.log('❌ Validation failed for step:', currentStep);
      toast({
        title: "Incomplete Step",
        description: "Please complete all required fields before proceeding.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Ensure user is authenticated
      const user = await getCurrentUser();
      if (!user) {
        console.error('❌ No authenticated user found');
        toast({
          title: "Authentication Error",
          description: "Please sign in to save your patent application.",
          variant: "destructive"
        });
        return;
      }

      console.log('Preparing to save patent data...');
      const patentData = {
        inventionTitle: formData.inventionTitle,
        inventorNames: formData.inventorNames,
        inventionType: formData.inventionType,
        briefSummary: formData.briefSummary,
        technicalField: formData.technicalField,
        backgroundArt: formData.backgroundArt,
        detailedDescription: formData.detailedDescription,
        advantageousEffects: formData.advantageousEffects,
        claims: formData.claims.map(claim => ({
          text: claim.text,
          type: claim.type,
          parentId: claim.parentId
        })),
        priorArtReferences: formData.priorArtReferences.map(ref => ({
          reference: ref.reference,
          type: ref.type,
          relevance: ref.relevance
        }))
      };
      console.log('Patent data prepared:', patentData);

      const savedPatent = await patentService.savePatent(patentData);
      console.log('✅ Patent saved successfully:', savedPatent);
      
      toast({
        title: "Success",
        description: "Patent application saved successfully.",
      });
      
      setShowDocumentGenerator(true);
    } catch (error) {
      console.error('❌ Error saving patent:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save patent application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDocumentGenerationComplete = () => {
    // Navigate to the next page or show a completion message
    toast({
      title: "Application Complete",
      description: "Your patent application has been successfully prepared.",
    });
    // Navigate to the dashboard
    navigate("/dashboard");
  };

  const generateAISuggestions = async () => {
    if (!formData.inventionTitle || !formData.briefSummary) {
      toast({
        title: "Missing Information",
        description: "Please enter both title and summary to generate suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingSuggestions(true);
    try {
      console.log('🔄 Starting AI suggestion generation');
      console.log('📝 Patent data:', {
        title: formData.inventionTitle,
        summary: formData.briefSummary,
        type: formData.inventionType,
        inventors: formData.inventorNames
      });
      
      // Create Anthropic client
      const anthropic = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true
      });

      // Prepare the prompt
      const prompt = `As a patent expert, review the following patent application details and provide specific suggestions for improvement:

Title: ${formData.inventionTitle}
Type: ${formData.inventionType}
Inventors: ${formData.inventorNames}
Summary: ${formData.briefSummary}

Please provide 3-5 specific suggestions for improving the patent application, focusing on:
1. Clarity and precision of the title
2. Completeness of the inventor information
3. Strength and comprehensiveness of the summary
4. Alignment with ${formData.inventionType} patent requirements
5. Potential areas for expansion or clarification

Format each suggestion as a clear, actionable item.`;

      console.log('🤖 Sending prompt to Anthropic API:', prompt);
      console.log('⏳ Waiting for Anthropic API response...');

      // Call Anthropic API
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      console.log('✅ Received response from Anthropic API');
      console.log('📊 Raw API response:', JSON.stringify(message, null, 2));

      // Extract suggestions from the response
      const responseText = message.content[0].type === 'text' 
        ? message.content[0].text 
        : '';
      
      console.log('📄 Extracted text from response:', responseText);
      
      const suggestions = responseText
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim());

      console.log('✨ Processed suggestions:', suggestions);

      // Update form data with suggestions
      updateFormData({
        aiSuggestions: suggestions
      });
      
      toast({
        title: "Suggestions Generated",
        description: "AI has analyzed your patent application and provided suggestions.",
      });
    } catch (error) {
      console.error('❌ Error generating suggestions:', error);
      // Set default suggestions if API fails
      updateFormData({
        aiSuggestions: [
          "Include specific technical field of the invention",
          "Mention key components or steps clearly",
          "Highlight the primary advantage over existing solutions"
        ]
      });
      
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Using default suggestions instead.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const generateDetailedSuggestions = async () => {
    if (!formData.technicalField || !formData.backgroundArt || !formData.detailedDescription) {
      toast({
        title: "Missing Information",
        description: "Please enter technical field, background art, and detailed description to generate suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingDetailedSuggestions(true);
    try {
      console.log('🔄 Starting detailed description AI suggestion generation');
      console.log('📝 Patent data:', {
        technicalField: formData.technicalField,
        backgroundArt: formData.backgroundArt,
        detailedDescription: formData.detailedDescription,
        advantageousEffects: formData.advantageousEffects
      });
      
      // Create Anthropic client
      const anthropic = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true
      });

      // Prepare the prompt
      const prompt = `As a patent expert, review the following patent application details and provide specific suggestions for improving the detailed description:

Technical Field: ${formData.technicalField}
Background Art: ${formData.backgroundArt}
Detailed Description: ${formData.detailedDescription}
Advantageous Effects: ${formData.advantageousEffects}

Please provide 3-5 specific suggestions for improving the detailed description, focusing on:
1. Clarity and completeness of the technical field description
2. Comprehensiveness of the background art and problem statement
3. Detail and precision in describing the invention's components and interactions
4. Strength of the advantageous effects description
5. Potential areas for expansion or clarification

Format each suggestion as a clear, actionable item.`;

      console.log('🤖 Sending prompt to Anthropic API:', prompt);
      console.log('⏳ Waiting for Anthropic API response...');

      // Call Anthropic API
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      console.log('✅ Received response from Anthropic API');
      console.log('📊 Raw API response:', JSON.stringify(message, null, 2));

      // Extract suggestions from the response
      const responseText = message.content[0].type === 'text' 
        ? message.content[0].text 
        : '';
      
      console.log('📄 Extracted text from response:', responseText);
      
      const suggestions = responseText
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim());

      console.log('✨ Processed suggestions:', suggestions);

      // Update form data with suggestions
      updateFormData({
        detailedDescriptionSuggestions: suggestions
      });
      
      toast({
        title: "Suggestions Generated",
        description: "AI has analyzed your detailed description and provided suggestions.",
      });
    } catch (error) {
      console.error('❌ Error generating detailed suggestions:', error);
      // Set default suggestions if API fails
      updateFormData({
        detailedDescriptionSuggestions: [
          "Include more specific technical details about component interactions",
          "Add alternative embodiments to strengthen your patent",
          "Clarify the relationship between components and their functions",
          "Expand on the advantages with quantitative improvements where possible",
          "Consider adding flowcharts or diagrams to illustrate the invention"
        ]
      });
      
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Using default suggestions instead.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingDetailedSuggestions(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="inventionTitle">Invention Title</Label>
              <Input
                id="inventionTitle"
                name="inventionTitle"
                placeholder="Enter a clear, concise title for your invention"
                value={formData.inventionTitle || ''}
                onChange={(e) => updateFormData({ inventionTitle: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="inventorNames">Inventor Name(s)</Label>
              <Input
                id="inventorNames"
                name="inventorNames"
                placeholder="Full names of all inventors, separated by commas"
                value={formData.inventorNames || ''}
                onChange={(e) => updateFormData({ inventorNames: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="inventionType">Type of Patent</Label>
              <Select 
                value={formData.inventionType || ''} 
                onValueChange={(value) => updateFormData({ inventionType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utility">Utility Patent</SelectItem>
                  <SelectItem value="design">Design Patent</SelectItem>
                  <SelectItem value="plant">Plant Patent</SelectItem>
                  <SelectItem value="provisional">Provisional Patent Application</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="briefSummary">Brief Summary</Label>
              <Textarea
                id="briefSummary"
                name="briefSummary"
                placeholder="Provide a brief summary of your invention (1-2 paragraphs)"
                rows={5}
                value={formData.briefSummary || ''}
                onChange={(e) => updateFormData({ briefSummary: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>AI Suggestions</Label>
                <Button
                  variant="outline"
                  onClick={generateAISuggestions}
                  disabled={isGeneratingSuggestions || !formData.inventionTitle || !formData.briefSummary}
                >
                  {isGeneratingSuggestions ? (
                    <>
                      <span className="mr-2">Generating...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </>
                  ) : (
                    'Generate Suggestions'
                  )}
                </Button>
              </div>
              <Card>
                <CardContent className="pt-6">
                  {formData.aiSuggestions ? (
                    <ul className="list-disc pl-4 space-y-2">
                      {formData.aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Enter a title and summary to receive AI suggestions for improving your patent application.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="technicalField">Technical Field</Label>
              <Textarea
                id="technicalField"
                name="technicalField"
                placeholder="Describe the technical field to which the invention relates"
                rows={3}
                value={formData.technicalField || ''}
                onChange={(e) => updateFormData({ technicalField: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="backgroundArt">Background Art</Label>
              <Textarea
                id="backgroundArt"
                name="backgroundArt"
                placeholder="Describe the existing art, problems, and limitations that your invention addresses"
                rows={4}
                value={formData.backgroundArt || ''}
                onChange={(e) => updateFormData({ backgroundArt: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="detailedDescription">Detailed Description</Label>
              <Textarea
                id="detailedDescription"
                name="detailedDescription"
                placeholder="Provide a detailed description of your invention, including all components, how they interact, and alternative embodiments"
                rows={6}
                value={formData.detailedDescription || ''}
                onChange={(e) => updateFormData({ detailedDescription: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="advantageousEffects">Advantageous Effects</Label>
              <Textarea
                id="advantageousEffects"
                name="advantageousEffects"
                placeholder="Describe the advantages and improvements your invention provides over existing solutions"
                rows={4}
                value={formData.advantageousEffects || ''}
                onChange={(e) => updateFormData({ advantageousEffects: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="drawingReferences">Drawing References</Label>
              <Textarea
                id="drawingReferences"
                name="drawingReferences"
                placeholder="List the drawings you plan to include and briefly describe each"
                rows={6}
                value={formData.drawingReferences || ''}
                onChange={(e) => updateFormData({ drawingReferences: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label>Figure Descriptions</Label>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="figure1">Fig. 1</Label>
                    <Input
                      id="figure1"
                      name="figure1"
                      placeholder="Description of Figure 1"
                      value={formData.figure1 || ''}
                      onChange={(e) => updateFormData({ figure1: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="figure2">Fig. 2</Label>
                    <Input
                      id="figure2"
                      name="figure2"
                      placeholder="Description of Figure 2"
                      value={formData.figure2 || ''}
                      onChange={(e) => updateFormData({ figure2: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>AI Suggestions</Label>
                <Button
                  variant="outline"
                  onClick={generateDetailedSuggestions}
                  disabled={isGeneratingDetailedSuggestions || !formData.technicalField || !formData.backgroundArt || !formData.detailedDescription}
                >
                  {isGeneratingDetailedSuggestions ? (
                    <>
                      <span className="mr-2">Generating...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </>
                  ) : (
                    'Generate Suggestions'
                  )}
                </Button>
              </div>
              <Card>
                <CardContent className="pt-6">
                  {formData.detailedDescriptionSuggestions ? (
                    <ul className="list-disc pl-4 space-y-2">
                      {formData.detailedDescriptionSuggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Enter a detailed description to receive AI suggestions for improving your patent application.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Prior Art References</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Relevance</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.priorArtReferences && formData.priorArtReferences.length > 0 ? (
                    formData.priorArtReferences.map((reference, index) => (
                      <TableRow key={index}>
                        <TableCell>{reference.reference}</TableCell>
                        <TableCell>{reference.type}</TableCell>
                        <TableCell>{reference.relevance}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              const updatedReferences = [...formData.priorArtReferences];
                              updatedReferences.splice(index, 1);
                              updateFormData({ priorArtReferences: updatedReferences });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No prior art references added yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    name="reference"
                    placeholder="Patent number or article title"
                    value={formData.newReference || ''}
                    onChange={(e) => updateFormData({ newReference: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={formData.newType || ''} 
                    onValueChange={(value) => updateFormData({ newType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Patent, Article, etc." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patent">Patent</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="relevance">Relevance</Label>
                  <Input
                    id="relevance"
                    name="relevance"
                    placeholder="How it relates to your invention"
                    value={formData.newRelevance || ''}
                    onChange={(e) => updateFormData({ newRelevance: e.target.value })}
                  />
                </div>
              </div>
              <Button 
                onClick={() => {
                  if (formData.newReference && formData.newType && formData.newRelevance) {
                    const newReference = {
                      reference: formData.newReference,
                      type: formData.newType,
                      relevance: formData.newRelevance
                    };
                    updateFormData({
                      priorArtReferences: [...formData.priorArtReferences, newReference],
                      newReference: '',
                      newType: '',
                      newRelevance: ''
                    });
                    toast({
                      title: "Reference Added",
                      description: "Prior art reference has been added successfully",
                    });
                  }
                }}
                disabled={!formData.newReference || !formData.newType || !formData.newRelevance}
              >
                Add Reference
              </Button>
            </div>

            <div className="space-y-4">
              <Label>Search for Prior Art</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keywords related to your invention"
                  value={formData.searchKeywords || ''}
                  onChange={(e) => updateFormData({ searchKeywords: e.target.value })}
                />
                <Button onClick={() => {
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
                    }, 1000);
                  }
                }}>
                  Search
                </Button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Patent Claims</h3>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (formData.claims.length > 0) {
                      // Simulate AI analysis delay
                      setTimeout(() => {
                        const suggestions = [
                          "Consider adding more specific technical details about component interactions",
                          "Include alternative embodiments in dependent claims",
                          "Add claims covering different use cases of your invention",
                          "Consider adding claims for manufacturing methods",
                          "Include claims for system-level implementations"
                        ];
                        updateFormData({ claimSuggestions: suggestions });
                        toast({
                          title: "AI Analysis Complete",
                          description: "We've analyzed your claims and provided suggestions",
                        });
                      }, 1000);
                    }
                  }}
                >
                  Generate AI Suggestions
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Claim Writing Tips</CardTitle>
                  <CardDescription>Best practices for writing patent claims</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                    <li>Independent claims should be broad but clear</li>
                    <li>Dependent claims should reference parent claims and add specific features</li>
                    <li>Each claim should be a single sentence</li>
                    <li>Use precise language to describe your invention</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Label>Enter a new claim for your patent application</Label>
                <Textarea
                  placeholder="Enter your claim text here..."
                  rows={4}
                  value={formData.newClaim.text}
                  onChange={(e) => 
                    updateFormData({ 
                      newClaim: { 
                        ...formData.newClaim, 
                        text: e.target.value 
                      } 
                    })
                  }
                />

                <div className="flex justify-between">
                  <Select 
                    value={formData.newClaim.type} 
                    onValueChange={(value: 'independent' | 'dependent') => 
                      updateFormData({ 
                        newClaim: { 
                          ...formData.newClaim, 
                          type: value,
                          parentId: value === 'independent' ? undefined : formData.newClaim.parentId 
                        } 
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="independent">Independent Claim</SelectItem>
                      <SelectItem value="dependent">Dependent Claim</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    onClick={() => {
                      if (formData.newClaim && formData.newClaim.text && formData.newClaim.text.trim()) {
                        const newClaim = {
                          id: (formData.claims ? formData.claims.length + 1 : 1).toString(),
                          text: formData.newClaim.text,
                          type: formData.newClaim.type || 'independent',
                          parentId: formData.newClaim.type === 'dependent' ? formData.newClaim.parentId : undefined
                        };
                        updateFormData({
                          claims: [...(formData.claims || []), newClaim],
                          newClaim: {
                            text: '',
                            type: 'independent'
                          }
                        });
                        toast({
                          title: "Claim Added",
                          description: "Your claim has been added successfully",
                        });
                      }
                    }}
                    disabled={!formData.newClaim || !formData.newClaim.text || !formData.newClaim.text.trim()}
                  >
                    Add Claim
                  </Button>
                </div>

                {formData.newClaim.type === 'dependent' && (
                  <div className="mt-2">
                    <Select 
                      value={formData.newClaim.parentId} 
                      onValueChange={(value) => 
                        updateFormData({ 
                          newClaim: { 
                            ...formData.newClaim, 
                            parentId: value 
                          } 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent claim" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.claims
                          .filter(claim => claim.type === 'independent')
                          .map(claim => (
                            <SelectItem key={claim.id} value={claim.id}>
                              Claim {claim.id}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Claims ({formData.claims.length})</h3>
                {formData.claims && formData.claims.length > 0 ? (
                  <div className="space-y-4">
                    {formData.claims.map((claim) => (
                      <Card key={claim.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                Claim {claim.id} ({claim.type || 'unknown'})
                                {claim.parentId && ` - Dependent on Claim ${claim.parentId}`}
                              </p>
                              <p className="text-sm text-muted-foreground">{claim.text || ''}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (formData.claims) {
                                  const updatedClaims = formData.claims.filter(c => c.id !== claim.id);
                                  updateFormData({ claims: updatedClaims });
                                  toast({
                                    title: "Claim Removed",
                                    description: "The claim has been removed successfully",
                                  });
                                }
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No claims added yet. Add at least one independent claim to define your invention.
                  </div>
                )}
              </div>

              {formData.claimSuggestions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">AI Suggestions</CardTitle>
                    <CardDescription>Improvement opportunities for your claims:</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                      {formData.claimSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      {!showDocumentGenerator ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patent Application Wizard</h1>
            <p className="text-gray-600">Complete each step to prepare your patent application</p>
          </div>

          <div className="mb-8">
            <Steps currentStep={currentStep} steps={patentSteps} />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            {renderStepContent()}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={currentStep === patentSteps.length  ? handleFinish : handleNext}
            >
              {currentStep === patentSteps.length ? "Finish" : "Next"}
            </Button>
          </div>
        </>
      ) : (
        <DocumentGenerator 
          formData={formData} 
          onNext={handleDocumentGenerationComplete} 
        />
      )}
    </div>
  );
};

export default PatentWizard; 