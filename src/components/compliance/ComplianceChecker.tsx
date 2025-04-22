
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Shield, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RequirementItem {
  id: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
}

interface ComplianceReport {
  uspto: RequirementItem[];
  euipo: RequirementItem[];
  india: RequirementItem[];
  overallScore: number;
}

const ComplianceChecker: React.FC = () => {
  const { filingType, formData, complianceScore, updateComplianceScore } = useAppContext();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [activeTab, setActiveTab] = useState('uspto');

  const runComplianceCheck = () => {
    setIsChecking(true);
    toast({
      title: "Running compliance check",
      description: "Analyzing your application against filing requirements...",
    });

    // Simulate API delay
    setTimeout(() => {
      // Generate mock compliance report based on filingType
      const patentReport: ComplianceReport = {
        uspto: [
          {
            id: '1',
            description: 'Inventor information',
            status: formData.inventorNames ? 'pass' : 'fail',
            details: formData.inventorNames 
              ? 'All required inventor details provided' 
              : 'Missing inventor names and details',
          },
          {
            id: '2',
            description: 'Specification completeness',
            status: (formData.detailedDescription && formData.detailedDescription.length > 200) ? 'pass' : 'warning',
            details: (formData.detailedDescription && formData.detailedDescription.length > 200) 
              ? 'Specification meets minimum requirements' 
              : 'Specification may be insufficient - add more details',
          },
          {
            id: '3',
            description: 'Patent claims',
            status: (formData.claims && formData.claims.length > 0) ? 'pass' : 'fail',
            details: (formData.claims && formData.claims.length > 0) 
              ? `${formData.claims.length} claims provided` 
              : 'No patent claims provided',
          },
          {
            id: '4',
            description: 'Drawings',
            status: 'warning',
            details: 'Ensure drawings clearly show all claimed features',
          },
          {
            id: '5',
            description: 'Declaration',
            status: 'pass',
            details: 'Declaration form is complete',
          },
        ],
        euipo: [
          {
            id: '1',
            description: 'Priority claim',
            status: 'warning',
            details: 'Consider adding priority information if applicable',
          },
          {
            id: '2',
            description: 'Technical field description',
            status: formData.technicalField ? 'pass' : 'fail',
            details: formData.technicalField 
              ? 'Technical field identified' 
              : 'Technical field description missing',
          },
          {
            id: '3',
            description: 'European representative',
            status: 'warning',
            details: 'EU representative information required for filing',
          },
        ],
        india: [
          {
            id: '1',
            description: 'Form 1 requirements',
            status: 'pass',
            details: 'All Form 1 fields completed',
          },
          {
            id: '2',
            description: 'Form 2 requirements',
            status: (formData.detailedDescription && formData.claims) ? 'pass' : 'fail',
            details: (formData.detailedDescription && formData.claims) 
              ? 'Specification and claims meet Form 2 requirements' 
              : 'Incomplete specification or claims for Form 2',
          },
          {
            id: '3',
            description: 'Form 3 requirements',
            status: 'warning',
            details: 'Foreign filing information may be needed',
          },
          {
            id: '4',
            description: 'Form 5 requirements',
            status: 'pass',
            details: 'All inventor declarations available',
          },
        ],
        overallScore: 0, // Will be calculated below
      };

      const trademarkReport: ComplianceReport = {
        uspto: [
          {
            id: '1',
            description: 'Mark representation',
            status: formData.markName ? 'pass' : 'fail',
            details: formData.markName 
              ? 'Mark properly identified' 
              : 'Mark name or representation missing',
          },
          {
            id: '2',
            description: 'Goods & services',
            status: (formData.goodsServices && formData.goodsServices.length > 0) ? 'pass' : 'fail',
            details: (formData.goodsServices && formData.goodsServices.length > 0) 
              ? `${formData.goodsServices.length} goods/services listed` 
              : 'No goods or services specified',
          },
          {
            id: '3',
            description: 'Specimen of use',
            status: (formData.specimenWebsite || formData.specimenProduct) ? 'pass' : 'warning',
            details: (formData.specimenWebsite || formData.specimenProduct) 
              ? 'Specimen provided' 
              : 'Specimen may be required for use-based applications',
          },
          {
            id: '4',
            description: 'Declaration',
            status: (formData.declarationTruth && formData.declarationPenalty) ? 'pass' : 'fail',
            details: (formData.declarationTruth && formData.declarationPenalty) 
              ? 'Declaration signed' 
              : 'Declaration not complete',
          },
        ],
        euipo: [
          {
            id: '1',
            description: 'Mark type designation',
            status: formData.markType ? 'pass' : 'fail',
            details: formData.markType 
              ? `${formData.markType} mark type specified` 
              : 'Mark type not specified',
          },
          {
            id: '2',
            description: 'Owner details',
            status: formData.ownerName ? 'pass' : 'fail',
            details: formData.ownerName 
              ? 'Owner information complete' 
              : 'Owner details incomplete',
          },
          {
            id: '3',
            description: 'Nice classifications',
            status: (formData.goodsServices && formData.goodsServices.length > 0) ? 'pass' : 'fail',
            details: (formData.goodsServices && formData.goodsServices.length > 0) 
              ? 'Classes correctly specified' 
              : 'Nice classifications missing',
          },
        ],
        india: [
          {
            id: '1',
            description: 'Form TM-A requirements',
            status: 'pass',
            details: 'Application form complete',
          },
          {
            id: '2',
            description: 'User affidavit',
            status: formData.filingBasis === 'use' ? 'warning' : 'pass',
            details: formData.filingBasis === 'use' 
              ? 'User affidavit may need additional details' 
              : 'Not applicable for proposed use',
          },
          {
            id: '3',
            description: 'POA requirements',
            status: 'warning',
            details: 'Power of Attorney for Indian agent may be required',
          },
        ],
        overallScore: 0, // Will be calculated below
      };

      // Select the appropriate report based on filing type
      const selectedReport = filingType === 'patent' ? patentReport : trademarkReport;

      // Calculate overall score
      let totalChecks = 0;
      let passedChecks = 0;

      ['uspto', 'euipo', 'india'].forEach(office => {
        selectedReport[office as keyof Omit<ComplianceReport, 'overallScore'>].forEach(item => {
          totalChecks++;
          if (item.status === 'pass') passedChecks++;
          if (item.status === 'warning') passedChecks += 0.5;
        });
      });

      const calculatedScore = Math.round((passedChecks / totalChecks) * 100);
      selectedReport.overallScore = calculatedScore;

      // Update the report and global compliance score
      setReport(selectedReport);
      updateComplianceScore(calculatedScore);
      setIsChecking(false);

      toast({
        title: "Compliance check complete",
        description: `Overall compliance score: ${calculatedScore}%`,
      });
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Compliance Checker</h1>
        <p className="text-muted-foreground">
          Verify your {filingType} application against official filing requirements
        </p>
      </div>

      {!report ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Check Filing Compliance</CardTitle>
            <CardDescription>
              Our AI will analyze your application against requirements for USPTO, EUIPO, and Indian IP offices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-6 flex flex-col items-center justify-center">
              <Shield className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground mb-4">
                Ready to check compliance of your {filingType === 'patent' ? 'patent' : 'trademark'} application
              </p>
              <ul className="list-disc pl-8 text-sm text-muted-foreground mb-6 self-start">
                <li>Validates required fields and documents</li>
                <li>Checks against requirements for multiple jurisdictions</li>
                <li>Identifies potential issues before filing</li>
                <li>Provides guidance on missing information</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={runComplianceCheck} 
              disabled={isChecking} 
              className="w-full"
            >
              {isChecking ? (
                "Checking Compliance..."
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Run Compliance Check
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <CardTitle className="text-xl">Compliance Report</CardTitle>
                  <CardDescription>
                    Filing readiness analysis for multiple jurisdictions
                  </CardDescription>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{report.overallScore}%</div>
                  <Progress value={report.overallScore} className="h-2 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="uspto">USPTO</TabsTrigger>
                  <TabsTrigger value="euipo">EUIPO</TabsTrigger>
                  <TabsTrigger value="india">India IPO</TabsTrigger>
                </TabsList>
                
                {(['uspto', 'euipo', 'india'] as const).map(office => (
                  <TabsContent key={office} value={office}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {office === 'uspto' ? 'United States Patent and Trademark Office' :
                           office === 'euipo' ? 'European Union Intellectual Property Office' : 
                           'Indian Intellectual Property Office'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">Status</TableHead>
                              <TableHead>Requirement</TableHead>
                              <TableHead>Details</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {report[office].map(item => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {item.status === 'pass' && (
                                    <Check className="h-5 w-5 text-green-500" />
                                  )}
                                  {item.status === 'fail' && (
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                  )}
                                  {item.status === 'warning' && (
                                    <AlertCircle className="h-5 w-5 text-amber-500" />
                                  )}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {item.description}
                                </TableCell>
                                <TableCell>{item.details}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={runComplianceCheck}>
                <Search className="mr-2 h-4 w-4" /> Recheck Compliance
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Filing Readiness Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              {report.overallScore >= 80 ? (
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-md">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Ready to File</h3>
                    <p className="text-sm text-green-700">
                      Your application meets the core requirements for filing. Consider addressing 
                      any warnings for an even stronger application.
                    </p>
                  </div>
                </div>
              ) : report.overallScore >= 50 ? (
                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-md">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">Almost Ready</h3>
                    <p className="text-sm text-amber-700">
                      Your application needs some improvements before filing. Address the failed 
                      requirements to improve your chances of successful registration.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-md">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-800">Not Ready</h3>
                    <p className="text-sm text-red-700">
                      Your application has significant issues that need to be resolved before filing.
                      Complete the missing requirements highlighted in the report.
                    </p>
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-medium">Recommended Next Steps</h3>
                <ul className="space-y-2">
                  {report.overallScore < 100 && (
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>
                        Address issues marked as "Failed" in the compliance report
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>
                      Generate and review all required filing documents
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>
                      Consider consulting with an IP professional for final review
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>
                      Proceed to filing preparation when all critical issues are resolved
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ComplianceChecker;
