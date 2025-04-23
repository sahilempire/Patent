import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileCheck, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PatentBasicInfo from './patent/PatentBasicInfo';
import PatentDetailedInfo from './patent/PatentDetailedInfo';
import PatentPriorArt from './patent/PatentPriorArt';
import PatentClaims from './patent/PatentClaims';
import TrademarkBasicInfo from './trademark/TrademarkBasicInfo';
import TrademarkGoodsServices from './trademark/TrademarkGoodsServices';
import TrademarkUsage from './trademark/TrademarkUsage';
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
  const [activeTab, setActiveTab] = useState("step1");
  const [applicationComplete, setApplicationComplete] = useState(false);

  // Define steps based on filing type
  const patentSteps = [
    { id: "step1", label: "Basic Info", component: PatentBasicInfo },
    { id: "step2", label: "Detailed Description", component: PatentDetailedInfo },
    { id: "step3", label: "Prior Art", component: PatentPriorArt },
    { id: "step4", label: "Claims", component: PatentClaims },
  ];

  const trademarkSteps = [
    { id: "step1", label: "Basic Info", component: TrademarkBasicInfo },
    { id: "step2", label: "Goods & Services", component: TrademarkGoodsServices },
    { id: "step3", label: "Usage Evidence", component: TrademarkUsage },
  ];

  const steps = filingType === 'patent' ? patentSteps : trademarkSteps;

  useEffect(() => {
    setActiveTab(`step${currentStep}`);
    calculateComplianceScore();
    checkApplicationCompletion();
  }, [currentStep, formData]);

  const checkApplicationCompletion = () => {
    // Check if all required steps have necessary data
    if (filingType === 'patent') {
      const hasBasicInfo = formData.title && formData.inventors?.length > 0;
      const hasDescription = formData.description && formData.description.length > 100;
      const hasPriorArt = true; // Optional
      const hasClaims = formData.claims?.length > 0;
      
      setApplicationComplete(hasBasicInfo && hasDescription && hasClaims);
    } else if (filingType === 'trademark') {
      const hasBasicInfo = formData.markName && formData.applicantName;
      const hasGoodsServices = formData.goodsServices?.length > 0;
      const hasUsage = formData.usageEvidence || formData.usageDate;
      
      setApplicationComplete(hasBasicInfo && hasGoodsServices && hasUsage);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      // Validate current step before proceeding
      const currentStepData = formData[`step${currentStep}`];
      const isValid = validateStep(currentStep, currentStepData);
      
      if (isValid) {
        setCurrentStep(currentStep + 1);
        toast({
          title: "Progress saved",
          description: `Moving to step ${currentStep + 1}`,
        });
      } else {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields before proceeding",
          variant: "destructive",
        });
      }
    } else {
      navigate('/documents');
    }
  };

  const validateStep = (step: number, data: any) => {
    switch (step) {
      case 1: // Basic Info
        return data?.applicantName && data?.trademark && data?.filingBasis;
      case 2: // Goods & Services
        return data?.description && data?.class;
      case 3: // Usage Evidence
        return data?.firstUseDate && data?.specimenDescription;
      default:
        return true;
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
  };

  const calculateComplianceScore = () => {
    // Simple calculation based on filled form fields
    const totalFields = filingType === 'patent' ? 12 : 8; // Example total required fields
    const filledFields = Object.keys(formData).length;
    const score = Math.min(Math.round((filledFields / totalFields) * 100), 100);
    updateComplianceScore(score);
  };

  const handleDownload = () => {
    const fileName = `${filingType}-application-${Date.now()}.json`;
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

  const CurrentStepComponent = steps[currentStep - 1]?.component;

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
              <CardTitle className="text-2xl">
                {filingType === 'patent' ? 'Patent' : 'Trademark'} Application Wizard
              </CardTitle>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={handleDownload}
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Download Application
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
              <span>Completion Progress</span>
              <span>{applicationComplete ? '100%' : 'In Progress'}</span>
            </div>
            <Progress value={applicationComplete ? 100 : (currentStep / steps.length) * 100} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
              {steps.map((step, index) => (
                <TabsTrigger 
                  key={step.id} 
                  value={step.id}
                  onClick={() => setCurrentStep(index + 1)}
                >
                  {index + 1}. {step.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {steps.map((step) => (
              <TabsContent key={step.id} value={step.id}>
                {step.id === `step${currentStep}` && <step.component />}
              </TabsContent>
            ))}
          </Tabs>
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
            disabled={!validateStep(currentStep, formData[`step${currentStep}`])}
          >
            {currentStep === steps.length ? 'Finish' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Wizard;
