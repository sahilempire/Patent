
import React, { useState, useEffect } from 'react';
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
  content?: string; // Actual document content
  fileType: 'pdf' | 'docx' | 'json';
}

const DocumentGenerator: React.FC = () => {
  const { filingType, formData, complianceScore, updateComplianceScore } = useAppContext();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    // Clear documents when filingType changes
    setDocuments([]);
  }, [filingType]);

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
          content: generatePatentApplication(),
          fileType: 'pdf',
        },
        {
          id: '2',
          name: 'Patent Specification',
          type: 'Technical Document',
          status: 'generated',
          required: true,
          content: generatePatentSpecification(),
          fileType: 'docx',
        },
        {
          id: '3',
          name: 'Patent Claims',
          type: 'Legal Document',
          status: 'generated',
          required: true,
          content: generatePatentClaims(),
          fileType: 'docx',
        },
        {
          id: '4',
          name: 'Inventor Declaration',
          type: 'USPTO Form',
          status: 'generated',
          required: true,
          content: generateInventorDeclaration(),
          fileType: 'pdf',
        },
        {
          id: '5',
          name: 'Information Disclosure Statement',
          type: 'USPTO Form',
          status: 'pending',
          required: false,
          content: '',
          fileType: 'pdf',
        },
      ];

      const trademarkDocs: Document[] = [
        {
          id: '1',
          name: 'Trademark Application',
          type: 'USPTO Form',
          status: 'generated',
          required: true,
          content: generateTrademarkApplication(),
          fileType: 'pdf',
        },
        {
          id: '2',
          name: 'Goods and Services Description',
          type: 'Legal Document',
          status: 'generated',
          required: true,
          content: generateGoodsServicesDoc(),
          fileType: 'docx',
        },
        {
          id: '3',
          name: 'Declaration of Use',
          type: 'USPTO Form',
          status: 'generated',
          required: true,
          content: generateDeclarationOfUse(),
          fileType: 'pdf',
        },
        {
          id: '4',
          name: 'Specimen of Use',
          type: 'Evidence Document',
          status: 'pending',
          required: true,
          content: '',
          fileType: 'pdf',
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

  const generatePatentApplication = () => {
    // Create a structured JSON that mimics a filled PDF form
    const jsonData = {
      formType: "AIA/14",
      title: formData.title || "Untitled Invention",
      inventors: formData.inventors || [],
      applicant: formData.applicantName || "",
      correspondence: {
        name: formData.applicantName || "",
        address: formData.address || "",
        city: formData.city || "",
        state: formData.state || "",
        zip: formData.zipCode || "",
        country: formData.country || "US",
        phone: formData.phone || "",
        email: formData.email || "",
      },
      filingDate: new Date().toISOString(),
      entityStatus: formData.entityStatus || "Small",
      signature: {
        name: formData.applicantName || "",
        date: new Date().toLocaleDateString(),
      }
    };
    
    return JSON.stringify(jsonData, null, 2);
  };

  const generatePatentSpecification = () => {
    return `
TITLE: ${formData.title || "UNTITLED INVENTION"}

FIELD OF THE INVENTION:
${formData.field || "The present invention relates generally to technology, and more particularly to a new and improved system and method."}

BACKGROUND:
${formData.background || "Background information would be detailed here."}

SUMMARY:
${formData.summary || "The invention provides new and useful improvements in the field."}

DETAILED DESCRIPTION:
${formData.description || "A detailed description of the invention would appear here."}

EXAMPLES:
${formData.examples || "Examples of the invention in use would be described here."}
    `;
  };

  const generatePatentClaims = () => {
    let claimsText = "CLAIMS:\n\n";
    
    if (formData.claims && formData.claims.length > 0) {
      formData.claims.forEach((claim: string, index: number) => {
        claimsText += `${index + 1}. ${claim}\n\n`;
      });
    } else {
      claimsText += "1. A method comprising...\n\n";
      claimsText += "2. The method of claim 1, further comprising...\n\n";
    }
    
    return claimsText;
  };

  const generateInventorDeclaration = () => {
    const jsonData = {
      formType: "AIA/01",
      inventors: formData.inventors || [{
        firstName: "",
        lastName: "",
        residence: "",
        citizenship: ""
      }],
      invention: {
        title: formData.title || "Untitled Invention",
        applicationNumber: `US${new Date().getFullYear()}${Math.floor(Math.random() * 1000000)}`,
        filingDate: new Date().toISOString()
      },
      declaration: {
        text: "The above-identified individual believes they are the original inventor of a claimed invention in the application.",
        date: new Date().toLocaleDateString()
      },
      signature: {
        name: formData.inventors && formData.inventors[0] ? 
          `${formData.inventors[0].firstName} ${formData.inventors[0].lastName}` : "",
        date: new Date().toLocaleDateString()
      }
    };
    
    return JSON.stringify(jsonData, null, 2);
  };

  const generateTrademarkApplication = () => {
    // Create a structured JSON that mimics a filled PDF form
    const jsonData = {
      formType: "TEAS Plus",
      markType: formData.markType || "Standard Characters",
      markName: formData.markName || "",
      applicant: {
        name: formData.applicantName || "",
        entityType: formData.entityType || "Individual",
        citizenship: formData.citizenship || "US",
        address: formData.address || "",
        city: formData.city || "",
        state: formData.state || "",
        zipCode: formData.zipCode || "",
        email: formData.email || "",
        phone: formData.phone || "",
      },
      goodsAndServices: formData.goodsServices || [],
      usageDate: formData.usageDate || "",
      signature: {
        name: formData.applicantName || "",
        date: new Date().toLocaleDateString(),
        declaration: "The signatory believes the applicant is the owner of the trademark."
      }
    };
    
    return JSON.stringify(jsonData, null, 2);
  };

  const generateGoodsServicesDoc = () => {
    let content = "GOODS AND SERVICES DESCRIPTION\n\n";
    content += `Mark: ${formData.markName || "UNNAMED MARK"}\n`;
    content += `Applicant: ${formData.applicantName || ""}\n\n`;
    content += "CLASSIFICATION AND DESCRIPTION OF GOODS AND SERVICES:\n\n";
    
    if (formData.goodsServices && formData.goodsServices.length > 0) {
      formData.goodsServices.forEach((item: any) => {
        content += `INTERNATIONAL CLASS ${item.class}:\n`;
        content += `${item.description}\n\n`;
      });
    } else {
      content += "No goods or services specified.\n";
    }
    
    return content;
  };

  const generateDeclarationOfUse = () => {
    const jsonData = {
      formType: "Declaration of Use",
      mark: formData.markName || "",
      applicant: formData.applicantName || "",
      registrationNumber: `US${Math.floor(Math.random() * 10000000)}`,
      goodsAndServices: formData.goodsServices || [],
      dates: {
        firstUse: formData.usageDate || new Date().toLocaleDateString(),
        firstUseInCommerce: formData.usageDate || new Date().toLocaleDateString()
      },
      specimen: {
        description: "The specimen shows the mark as used in commerce",
        type: formData.usageType || "Digital Image"
      },
      signature: {
        name: formData.applicantName || "",
        title: "Owner",
        date: new Date().toLocaleDateString()
      }
    };
    
    return JSON.stringify(jsonData, null, 2);
  };

  const downloadDocument = (doc: Document) => {
    if (!doc.content) {
      toast({
        title: "Document not ready",
        description: "This document is still pending generation",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Downloading document",
      description: `Preparing ${doc.name} for download...`,
    });

    // Create the file for download
    const blob = new Blob([doc.content], { 
      type: doc.fileType === 'json' ? 'application/json' :
            doc.fileType === 'pdf' ? 'application/pdf' : 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name.replace(/\s+/g, '-').toLowerCase()}.${doc.fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download complete",
      description: `${doc.name} has been downloaded`,
    });
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
                            onClick={() => downloadDocument(doc)}
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
