
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Check, Calendar, Plus, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChecklistItem {
  id: string;
  label: string;
  status: 'complete' | 'incomplete';
  routePath?: string;
}

const FilingDashboard: React.FC = () => {
  const { filingType, formData, complianceScore } = useAppContext();
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState('');

  // Define checklist items based on filing type
  const getChecklist = (): ChecklistItem[] => {
    if (filingType === 'patent') {
      return [
        {
          id: '1',
          label: 'Complete application information',
          status: Object.keys(formData).length > 5 ? 'complete' : 'incomplete',
          routePath: '/wizard',
        },
        {
          id: '2',
          label: 'Add technical drawings',
          status: formData.drawingLabel1 ? 'complete' : 'incomplete',
          routePath: '/uploads',
        },
        {
          id: '3',
          label: 'Write patent claims',
          status: (formData.claims && formData.claims.length > 0) ? 'complete' : 'incomplete',
          routePath: '/wizard',
        },
        {
          id: '4',
          label: 'Generate filing documents',
          status: 'incomplete',
          routePath: '/documents',
        },
        {
          id: '5',
          label: 'Verify compliance',
          status: complianceScore >= 80 ? 'complete' : 'incomplete',
          routePath: '/compliance',
        },
      ];
    } else {
      return [
        {
          id: '1',
          label: 'Complete trademark details',
          status: formData.markName ? 'complete' : 'incomplete',
          routePath: '/wizard',
        },
        {
          id: '2',
          label: 'Add goods and services',
          status: (formData.goodsServices && formData.goodsServices.length > 0) ? 'complete' : 'incomplete',
          routePath: '/wizard',
        },
        {
          id: '3',
          label: 'Upload specimens of use',
          status: (formData.specimenWebsite || formData.specimenProduct) ? 'complete' : 'incomplete',
          routePath: '/uploads',
        },
        {
          id: '4',
          label: 'Generate filing documents',
          status: 'incomplete',
          routePath: '/documents',
        },
        {
          id: '5',
          label: 'Verify compliance',
          status: complianceScore >= 80 ? 'complete' : 'incomplete',
          routePath: '/compliance',
        },
      ];
    }
  };

  const checklist = getChecklist();
  const completedItems = checklist.filter(item => item.status === 'complete').length;
  const completionPercentage = Math.round((completedItems / checklist.length) * 100);

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invitation sent",
      description: `Collaboration invitation sent to ${inviteEmail}`,
    });
    
    setInviteEmail('');
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  const determineFilingStatus = () => {
    if (completionPercentage < 40) return 'early';
    if (completionPercentage < 80) return 'in-progress';
    return 'ready';
  };

  const filingStatus = determineFilingStatus();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Filing Dashboard</h1>
        <p className="text-muted-foreground">
          Track progress and prepare your {filingType} application for submission
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <CardTitle className="text-xl">Filing Checklist</CardTitle>
                  <CardDescription>
                    Track your progress through the filing process
                  </CardDescription>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{completionPercentage}%</div>
                  <Progress value={completionPercentage} className="h-2 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.status === 'complete' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {item.status === 'complete' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </div>
                      <span className={item.status === 'complete' ? 'text-muted-foreground' : ''}>
                        {item.label}
                      </span>
                    </div>
                    {item.routePath && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigateTo(item.routePath!)}
                      >
                        {item.status === 'complete' ? 'View' : 'Complete'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Filing Timeline</CardTitle>
              <CardDescription>
                Estimated timeline for your {filingType} application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-gray-200">
                <div className="relative">
                  <div className="absolute -left-8 mt-1.5 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5 text-white" />
                  </div>
                  <Badge variant="secondary" className="mb-2">Current Step</Badge>
                  <h3 className="text-lg font-medium">Application Preparation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Completing required forms and gathering supporting documents
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 mt-1.5 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium">Official Filing</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Submission to {filingType === 'patent' ? 'USPTO' : 'Trademark Office'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated: When preparation is complete
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 mt-1.5 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium">Office Action Response</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Addressing any examination issues
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated: 3-6 months after filing
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 mt-1.5 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium">
                    {filingType === 'patent' ? 'Patent Grant' : 'Trademark Registration'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Official protection granted
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated: {filingType === 'patent' ? '18-24 months' : '9-12 months'} after filing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filing Status</CardTitle>
            </CardHeader>
            <CardContent>
              {filingStatus === 'ready' ? (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Ready to File</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Your application is ready for submission. Review the generated documents before proceeding.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : filingStatus === 'in-progress' ? (
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">In Progress</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Continue working through the checklist to complete your application.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-md bg-amber-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Just Started</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>You've just begun the application process. Complete the initial steps to progress.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Compliance Score</span>
                  <span>{complianceScore}%</span>
                </div>
                <Progress value={complianceScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invite Collaborator</CardTitle>
              <CardDescription>
                Invite a legal expert to review your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleInvite}
                >
                  <Mail className="mr-2 h-4 w-4" /> Send Invitation
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Filing Fees</AlertTitle>
            <AlertDescription className="text-sm">
              {filingType === 'patent' ? (
                <p>USPTO filing fees for a patent application range from $75-$300 depending on entity size.</p>
              ) : (
                <p>USPTO filing fees for a trademark application range from $250-$350 per class.</p>
              )}
            </AlertDescription>
          </Alert>

          {filingStatus === 'ready' && (
            <Button className="w-full">
              Proceed to File <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilingDashboard;
