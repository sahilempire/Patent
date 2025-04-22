
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { FileCheck, Download, ArrowRight, FileText, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'generated' | 'validated';
  required: boolean;
}

const DocumentGenerator: React.FC = () => {
  const { filingType, formData, complianceScore, updateComplianceScore } = useAppContext();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const generateDocuments = () => {
    setIsGenerating(true);
    toast({
      title: "Generating documents",
      description: "Please wait while we prepare your documents...",
    });

    // Simulate document generation delay
    setTimeout(() => {
      const patentDocs: Document[] = [
        {
          id: '1',
          name: 'Provisional Patent Application',
          type: 'USPTO Form',
          status: 'generated',
          required: true,
        },
        {
          id: '2',
          name: 'Patent Specification',
          type: 'Technical Document',
          status: 'generated',
          required: true,
        },
        {
          id: '3',
          name: 'Patent Claims',
          type: 'Legal Document',
          status: 'generated',
          required: true,
        },
        {
          id: '4',
          name: 'Inventor Declaration',
          type: 'USPTO Form',
          status: 'generated',
          required: true,
        },
        {
          id: '5',
          name: 'Information Disclosure Statement',
          type: 'USPTO Form',
          status: 'pending',
          required: false,
        },
      ];

      const trademarkDocs: Document[] = [
        {
          id: '1',
          name: 'Trademark Application',
          type: 'USPTO Form',
          status: 'generated',
          required: true,
        },
        {
          id: '2',
          name: 'Goods and Services Description',
          type: 'Legal Document',
          status: 'generated',
          required: true,
        },
        {
          id: '3',
          name: 'Declaration of Use',
          type: 'USPTO Form',
          status: 'generated',
          required: true,
        },
        {
          id: '4',
          name: 'Specimen of Use',
          type: 'Evidence Document',
          status: 'pending',
          required: true,
        },
      ];

      const generatedDocs = filingType === 'patent' ? patentDocs : trademarkDocs;
      setDocuments(generatedDocs);
      setIsGenerating(false);

      // Update compliance score based on generated documents
      const generatedRequiredDocs = generatedDocs.filter(doc => doc.required && doc.status === 'generated').length;
      const totalRequiredDocs = generatedDocs.filter(doc => doc.required).length;
      const docsScore = Math.round((generatedRequiredDocs / totalRequiredDocs) * 100);
      
      // Combine with existing score
      const newScore = Math.round((complianceScore + docsScore) / 2);
      updateComplianceScore(newScore);

      toast({
        title: "Documents generated",
        description: `Successfully generated ${generatedRequiredDocs} required documents`,
      });
    }, 3000);
  };

  const downloadDocument = (docName: string) => {
    toast({
      title: "Downloading document",
      description: `Preparing ${docName} for download...`,
    });

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${docName} has been downloaded`,
      });
    }, 1500);
  };

  const validateDocuments = () => {
    toast({
      title: "Validating documents",
      description: "Checking for regulatory compliance...",
    });

    // Simulate validation delay
    setTimeout(() => {
      const updatedDocs = documents.map(doc => ({
        ...doc,
        status: doc.status === 'generated' ? 'validated' : doc.status
      }));
      
      setDocuments(updatedDocs);

      // Update compliance score
      const validatedRequiredDocs = updatedDocs.filter(doc => doc.required && doc.status === 'validated').length;
      const totalRequiredDocs = updatedDocs.filter(doc => doc.required).length;
      const validationScore = Math.round((validatedRequiredDocs / totalRequiredDocs) * 100);
      
      updateComplianceScore(validationScore);

      toast({
        title: "Validation complete",
        description: `${validatedRequiredDocs} documents validated successfully`,
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Document Generator</h1>
        <p className="text-muted-foreground">
          Generate and manage filing-ready documents for your {filingType} application
        </p>
      </div>

      {documents.length === 0 ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Generate Your Documents</CardTitle>
            <CardDescription>
              Our AI will analyze your application data and generate all required documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-6 flex flex-col items-center justify-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground mb-4">
                Ready to generate your {filingType === 'patent' ? 'patent' : 'trademark'} filing documents
              </p>
              <ul className="list-disc pl-8 text-sm text-muted-foreground mb-6 self-start">
                <li>Documents will be tailored based on your application details</li>
                <li>All required USPTO/IP office forms will be prepared</li>
                <li>You can download, review, and modify as needed</li>
                <li>AI-powered validation ensures compliance with filing requirements</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateDocuments} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                "Generating Documents..."
              ) : (
                <>
                  <FileCheck className="mr-2 h-4 w-4" /> Generate Filing Documents
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Generated Documents</CardTitle>
                <Badge variant={complianceScore >= 80 ? "default" : "outline"}>
                  {complianceScore}% Ready
                </Badge>
              </div>
              <CardDescription>
                Review and download your filing-ready documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        {doc.name}
                        {doc.required && 
                          <Badge variant="outline" className="ml-2">Required</Badge>
                        }
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        <Badge variant={
                          doc.status === 'validated' ? "default" : 
                          doc.status === 'generated' ? "secondary" : 
                          "outline"
                        }>
                          {doc.status === 'validated' ? 'Validated' : 
                           doc.status === 'generated' ? 'Generated' : 
                           'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {doc.status !== 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadDocument(doc.name)}
                          >
                            <Download className="h-4 w-4 mr-1" /> Download
                          </Button>
                        )}
                        {doc.status === 'pending' && (
                          <Badge variant="outline">Not ready</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={generateDocuments}>
                <FileCheck className="mr-2 h-4 w-4" /> Regenerate
              </Button>
              <Button onClick={validateDocuments}>
                <Shield className="mr-2 h-4 w-4" /> Validate Documents
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Review Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      Download and carefully review all generated documents for accuracy
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Validate Compliance</h3>
                    <p className="text-sm text-muted-foreground">
                      Run our compliance checker to ensure all filing requirements are met
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Submit Application</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the documents to file your application with the appropriate IP office
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DocumentGenerator;
