import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, RefreshCw, CheckCircle, AlertCircle, ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";
import { patentService } from '@/services/patentService';
import { getCurrentUser } from '@/lib/supabase';

interface Document {
  id: string;
  name: string;
  type: string;
  status: "Generated" | "Pending";
  required: boolean;
}

interface DocumentGeneratorProps {
  formData: any; // Replace with your actual form data type
  onNext: () => void;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ formData, onNext }) => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Provisional Patent Application",
      type: "USPTO Form",
      status: "Generated",
      required: true,
    },
    {
      id: "2",
      name: "Patent Specification",
      type: "Technical Document",
      status: "Generated",
      required: true,
    },
    {
      id: "3",
      name: "Patent Claims",
      type: "Legal Document",
      status: "Generated",
      required: true,
    },
    {
      id: "4",
      name: "Inventor Declaration",
      type: "USPTO Form",
      status: "Generated",
      required: true,
    },
    {
      id: "5",
      name: "Information Disclosure Statement",
      type: "USPTO Form",
      status: "Pending",
      required: false,
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [currentStep, setCurrentStep] = useState<"initial" | "generated" | "review" | "validate" | "submit">("initial");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleGenerateDocuments = () => {
    setIsGenerating(true);
    
    // Simulate document generation process
    setTimeout(() => {
      setDocuments(prevDocs => 
        prevDocs.map(doc => ({
          ...doc,
          status: "Generated"
        }))
      );
      setIsGenerating(false);
      setCurrentStep("generated");
      toast.success("Documents generated successfully!");
    }, 2000);
  };

  const handleAnalyzeApplication = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Application analyzed successfully!");
    }, 1500);
  };

  const handleValidateDocuments = () => {
    setIsValidating(true);
    
    // Simulate validation process
    setTimeout(() => {
      setIsValidating(false);
      setCurrentStep("validate");
      toast.success("Documents validated successfully!");
    }, 1500);
  };

  const handleDownloadDocument = (documentId: string) => {
    // In a real application, this would trigger a download of the actual PDF
    toast.success(`Downloading document ${documentId}...`);
    
    // Simulate download delay
    setTimeout(() => {
      toast.success("Document downloaded successfully!");
    }, 1000);
  };

  const handleRegenerateDocuments = () => {
    setIsGenerating(true);
    
    // Simulate regeneration process
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Documents regenerated successfully!");
    }, 2000);
  };

  const handleNextStep = () => {
    if (currentStep === "generated") {
      setCurrentStep("review");
    } else if (currentStep === "validate") {
      setCurrentStep("submit");
    } else {
      onNext();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        console.error('❌ SUBMISSION FAILED: No authenticated user found');
        toast.error("Authentication Required", {
          description: "Please sign in to submit your patent application."
        });
        return;
      }
      
      console.log('🔄 PREPARING TO SAVE PATENT TO SUPABASE:', formData);
      
      // Validate form data
      if (!formData.inventionTitle || !formData.inventorNames || !formData.inventionType) {
        console.error('❌ SUBMISSION FAILED: Missing required fields');
        toast.error("Missing Required Fields", {
          description: "Please complete all required fields before submitting."
        });
        return;
      }
      
      // Save to Supabase
      const savedPatent = await patentService.savePatent(formData);
      
      console.log('✅ PATENT SAVED SUCCESSFULLY TO SUPABASE:', savedPatent);
      
      toast.success("Application Submitted", {
        description: "Your patent application has been submitted successfully."
      });
      
      // Navigate to dashboard or patent details page
      navigate(`/dashboard/patents/${savedPatent.id}`);
    } catch (error) {
      console.error('❌ ERROR SUBMITTING PATENT:', error);
      toast.error("Submission Failed", {
        description: error instanceof Error ? error.message : "There was an error submitting your patent application. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Generator</h1>
        <p className="text-xl text-gray-600">
          Generate and manage filing-ready documents for your patent application
        </p>
      </div>

      {currentStep === "initial" && (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Generate Your Documents</CardTitle>
            <CardDescription>
              Our AI will analyze your application data and generate all required documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Ready to generate your patent filing documents</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                  <span>Documents will be tailored based on your application details</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                  <span>All required USPTO/IP office forms will be prepared</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                  <span>You can download, review, and modify as needed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                  <span>AI-powered validation ensures compliance with filing requirements</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleGenerateDocuments}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Documents...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Filing Documents
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === "generated" && (
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Generated Documents</CardTitle>
                  <CardDescription>Review and download your filing-ready documents</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  100% Ready
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        {doc.name}
                        {doc.required && (
                          <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
                        )}
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={doc.status === "Generated" ? "default" : "secondary"}
                          className={doc.status === "Generated" ? "bg-green-100 text-green-800" : ""}
                        >
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadDocument(doc.id)}
                          disabled={doc.status !== "Generated"}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleRegenerateDocuments}
                disabled={isGenerating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleAnalyzeApplication}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Analyze Application
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleValidateDocuments}
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Validate Documents
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {currentStep === "review" && (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Complete these steps to finalize your patent application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Review Documents</h3>
                <p className="text-gray-600">Download and carefully review all generated documents for accuracy</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Validate Compliance</h3>
                <p className="text-gray-600">Run our compliance checker to ensure all filing requirements are met</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 p-2 rounded-full">
                <ArrowRight className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Submit Application</h3>
                <p className="text-gray-600">Use the documents to file your application with the appropriate IP office</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleValidateDocuments}
              disabled={isValidating}
            >
              {isValidating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Validate Documents
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === "validate" && (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Validation Complete</CardTitle>
            <CardDescription>Your documents have been validated and are ready for submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                <h3 className="font-medium text-green-800">All documents are compliant with filing requirements</h3>
              </div>
              <p className="text-green-700">Your patent application is ready to be submitted to the USPTO.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === "submit" && (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Ready to Submit</CardTitle>
            <CardDescription>Your patent application is ready to be submitted to the USPTO</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Next steps for submission</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                  <span>Download all required documents</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                  <span>Review the documents for accuracy</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                  <span>Submit through the USPTO Electronic Filing System (EFS-Web)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                  <span>Pay the required filing fees</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep("generated")}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Documents
            </Button>
            <Button 
              size="lg"
              onClick={onNext}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Complete Process
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default DocumentGenerator; 