
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatentBasicInfo from './patent/PatentBasicInfo';
import PatentDetailedInfo from './patent/PatentDetailedInfo';
import PatentPriorArt from './patent/PatentPriorArt';
import PatentClaims from './patent/PatentClaims';
import TrademarkBasicInfo from './trademark/TrademarkBasicInfo';
import TrademarkGoodsServices from './trademark/TrademarkGoodsServices';
import TrademarkUsage from './trademark/TrademarkUsage';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Wizard: React.FC = () => {
  const { 
    filingType, 
    currentStep, 
    setCurrentStep, 
    formData,
    updateComplianceScore
  } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("step1");

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
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Progress saved",
        description: `Moving to step ${currentStep + 1}`,
      });
    } else {
      navigate('/documents');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateComplianceScore = () => {
    // Simple calculation based on filled form fields
    const totalFields = filingType === 'patent' ? 12 : 8; // Example total required fields
    const filledFields = Object.keys(formData).length;
    const score = Math.min(Math.round((filledFields / totalFields) * 100), 100);
    updateComplianceScore(score);
  };

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {filingType === 'patent' ? 'Patent' : 'Trademark'} Application Wizard
          </CardTitle>
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
          <Button onClick={handleNext}>
            {currentStep === steps.length ? 'Finish' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Wizard;
