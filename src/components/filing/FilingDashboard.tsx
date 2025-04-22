
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FileCheck, Calendar, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const FilingDashboard: React.FC = () => {
  const { filingType, complianceScore, formData } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('readiness');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const isApplicationComplete = complianceScore >= 80;

  const checklistItems = [
    {
      title: 'Complete Application Form',
      description: 'All required application fields completed',
      status: formData && Object.keys(formData).length > 5 ? 'complete' : 'incomplete',
      path: '/wizard'
    },
    {
      title: 'Generate Official Documents',
      description: 'Create and review all required filing documents',
      status: true ? 'complete' : 'incomplete',
      path: '/documents'
    },
    {
      title: 'Upload Supporting Materials',
      description: 'Attach required drawings or specimens',
      status: true ? 'complete' : 'incomplete',
      path: '/uploads'
    },
    {
      title: 'Complete Compliance Check',
      description: 'Verify application meets filing requirements',
      status: complianceScore > 0 ? 'complete' : 'incomplete',
      path: '/compliance'
    }
  ];

  const runAiAnalysis = () => {
    setIsAnalyzing(true);
    toast({
      title: "AI Analysis in Progress",
      description: "Analyzing your application details..."
    });

    // Simulate AI analysis with timeout
    setTimeout(() => {
      const analysis = generateMockAnalysis();
      setAiAnalysis(analysis);
      setIsAnalyzing(false);
      
      toast({
        title: "AI Analysis Complete",
        description: "Your filing readiness has been evaluated"
      });
    }, 2500);
  };

  const generateMockAnalysis = () => {
    const filingTypeText = filingType === 'patent' ? 
      'patent application' : 'trademark registration';
    
    if (complianceScore >= 80) {
      return `Based on our analysis, your ${filingTypeText} application appears to be in good shape for filing. The application demonstrates a clear description of the ${filingType === 'patent' ? 'invention' : 'mark'} and meets the core requirements for submission. For optimal results, we recommend having an IP attorney review the final documents before filing.`;
    } else if (complianceScore >= 50) {
      return `Your ${filingTypeText} application requires some improvements before filing. Our analysis indicates that you need to provide more details in the ${filingType === 'patent' ? 'claims section' : 'goods and services description'}. Addressing these issues will significantly improve your chances of successful registration.`;
    } else {
      return `Your ${filingTypeText} application is not yet ready for submission. Several critical elements are missing or incomplete, including ${filingType === 'patent' ? 'inventor details and clear claims' : 'precise mark description and specimens'}. We recommend returning to the Document Wizard to complete these sections.`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Filing Preparation</h1>
          <p className="text-muted-foreground">
            Prepare your {filingType} application for final submission
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">{complianceScore}%</div>
          <Progress value={complianceScore} className="h-2 w-24" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="readiness">Filing Readiness</TabsTrigger>
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="readiness">
          <Card>
            <CardHeader>
              <CardTitle>Filing Checklist</CardTitle>
              <CardDescription>
                Complete all required steps before submitting your {filingType} application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {checklistItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      item.status === 'complete' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      {item.status === 'complete' ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.title}</h3>
                        {item.status !== 'complete' && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            onClick={() => navigate(item.path)}
                            className="p-0 h-auto text-primary"
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Separator />
              <div className="w-full flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Overall Filing Readiness</h3>
                  <p className="text-sm text-muted-foreground">
                    {isApplicationComplete 
                      ? 'Your application appears ready for filing' 
                      : 'Complete all checklist items before filing'}
                  </p>
                </div>
                <Button 
                  disabled={!isApplicationComplete} 
                  className="ml-auto"
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  Prepare Filing Package
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Filing Assessment</CardTitle>
              <CardDescription>
                Get an AI-powered analysis of your application's filing readiness
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!aiAnalysis ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileCheck className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground mb-8 max-w-md">
                    Our AI can analyze your complete application and provide insights
                    on its filing readiness and potential areas for improvement.
                  </p>
                  <Button 
                    onClick={runAiAnalysis} 
                    disabled={isAnalyzing || complianceScore === 0}
                  >
                    {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
                  </Button>
                  {complianceScore === 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Please complete a compliance check first
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-4">
                  <div className="px-4 py-3 bg-muted rounded-lg mb-4">
                    <h3 className="font-medium mb-2">AI Assessment Results</h3>
                    <p className="text-sm">{aiAnalysis}</p>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <h3 className="font-medium">Recommended Actions</h3>
                    <ul className="space-y-2">
                      {complianceScore < 100 && (
                        <li className="flex items-start gap-2">
                          <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                            <Check className="h-4 w-4 text-blue-600" />
                          </div>
                          <span>
                            {complianceScore < 80 
                              ? "Address critical issues found in the compliance check" 
                              : "Consider addressing any remaining warnings in the compliance report"}
                          </span>
                        </li>
                      )}
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                          <Check className="h-4 w-4 text-blue-600" />
                        </div>
                        <span>
                          Review all generated documents for accuracy and completeness
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                          <Check className="h-4 w-4 text-blue-600" />
                        </div>
                        <span>
                          Consider consulting with an IP professional before final submission
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {aiAnalysis && (
                <Button 
                  variant="outline" 
                  onClick={runAiAnalysis}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  Rerun Analysis
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Filing Calendar</CardTitle>
          <CardDescription>Important dates for your {filingType} application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Estimated Filing Date</p>
                  <p className="text-sm text-muted-foreground">When your application will be submitted</p>
                </div>
              </div>
              <p className="font-medium">{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Estimated First Office Action</p>
                  <p className="text-sm text-muted-foreground">Initial review by the patent office</p>
                </div>
              </div>
              <p className="font-medium">{filingType === 'patent' ? '12-18 months' : '3-4 months'}</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Estimated Registration Time</p>
                  <p className="text-sm text-muted-foreground">Total time for application approval</p>
                </div>
              </div>
              <p className="font-medium">{filingType === 'patent' ? '2-3 years' : '9-12 months'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilingDashboard;
