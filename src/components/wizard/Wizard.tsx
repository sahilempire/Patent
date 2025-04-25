import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PatentBasicInfo from './patent/PatentBasicInfo';
import PatentDetailedInfo from './patent/PatentDetailedInfo';
import PatentPriorArt from './patent/PatentPriorArt';
import PatentClaims from './patent/PatentClaims';
import { useNavigate } from 'react-router-dom';

const Wizard: React.FC = () => {
  const { 
    filingType, 
    currentStep, 
    setCurrentStep, 
    formData,
    updateComplianceScore,
    setFilingType
  } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applicationComplete, setApplicationComplete] = useState(false);

  // Define steps for patent filing
  const patentSteps = [
    { id: 1, label: "Basic Info", component: PatentBasicInfo },
    { id: 2, label: "Detailed Description", component: PatentDetailedInfo },
    { id: 3, label: "Prior Art", component: PatentPriorArt },
    { id: 4, label: "Claims", component: PatentClaims },
  ];

  useEffect(() => {
    calculateComplianceScore();
    checkApplicationCompletion();
  }, [currentStep, formData]);

  const checkApplicationCompletion = () => {
    const hasBasicInfo = formData.inventionTitle && formData.inventorNames;
    const hasDescription = formData.technicalField && formData.detailedDescription;
    const hasPriorArt = true; // Optional
    const hasClaims = formData.claims?.length > 0;
    
    setApplicationComplete(hasBasicInfo && hasDescription && hasClaims);
  };

  const handleNext = () => {
    if (currentStep < patentSteps.length) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Progress saved",
        description: `Moving to step ${currentStep + 1}`,
      });
    } else {
      navigate('/patent/documents');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToStart = () => {
    setFilingType(null);
    setCurrentStep(0);
    navigate('/dashboard');
  };

  const calculateComplianceScore = () => {
    const totalSteps = patentSteps.length;
    const completedSteps = currentStep - 1;
    const score = Math.round((completedSteps / totalSteps) * 100);
    updateComplianceScore(score);
  };

  const handleDownload = () => {
    const fileName = `patent-application-${Date.now()}.json`;
    const fileContent = JSON.stringify(formData, null, 2);
    const blob = new Blob([fileContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Application Downloaded",
      description: "Your application data has been saved to your device",
    });
  };

  const CurrentStepComponent = patentSteps[currentStep - 1]?.component;

  if (!CurrentStepComponent) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Invalid step. Please return to the dashboard.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBackToStart}>Return to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleBackToStart}
                title="Back to start"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl">Patent Application Wizard</CardTitle>
            </div>
            <Button
              variant="outline"
              onClick={handleDownload}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Download Application
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Completion Progress</h3>
                <span className="text-sm text-muted-foreground">
                  {currentStep} of {patentSteps.length} steps
                </span>
              </div>
              <Progress value={(currentStep / patentSteps.length) * 100} className="h-2" />
            </div>

            {/* Steps List */}
            <div className="space-y-2">
              {patentSteps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 p-2 rounded-md ${
                    currentStep === step.id
                      ? 'bg-primary/10 text-primary'
                      : currentStep > step.id
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      currentStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : currentStep > step.id
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>

            {/* Current Step Content */}
            <div className="pt-6">
              <CurrentStepComponent />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!applicationComplete && currentStep === patentSteps.length}
          >
            {currentStep === patentSteps.length ? 'Finish' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Wizard;
