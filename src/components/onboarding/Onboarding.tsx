
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Onboarding: React.FC = () => {
  const { setFilingType, setCurrentStep } = useAppContext();
  const { toast } = useToast();

  const handleFilingTypeSelection = (type: 'patent' | 'trademark') => {
    setFilingType(type);
    setCurrentStep(1);
    toast({
      title: `Starting ${type === 'patent' ? 'Patent' : 'Trademark'} Filing Process`,
      description: "We'll guide you through all the required steps.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to IntelliFile</h1>
        <p className="text-xl text-muted-foreground">
          Your AI-powered assistant for intellectual property filings
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Patent Filing</CardTitle>
            <CardDescription>
              Protect your inventions, processes, or unique technological solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-blue-50 p-8 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
                <path d="M10 10V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1" />
                <path d="m11 9 5 3-5 3" />
              </svg>
            </div>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li>Utility Patents</li>
              <li>Design Patents</li>
              <li>Provisional Applications</li>
              <li>International PCT Filings</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => handleFilingTypeSelection('patent')}
            >
              Start Patent Process
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Trademark Filing</CardTitle>
            <CardDescription>
              Protect your brand names, logos, slogans, and other business identifiers
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-blue-50 p-8 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                <path d="M9 9h6v6H9z" />
              </svg>
            </div>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li>Word Marks</li>
              <li>Logo Marks</li>
              <li>Service Marks</li>
              <li>International Madrid Protocol</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="secondary"
              onClick={() => handleFilingTypeSelection('trademark')}
            >
              Start Trademark Process
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
