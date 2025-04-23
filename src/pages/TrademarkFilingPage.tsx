import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, AlertCircle, Loader2, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateDocument, downloadDocument } from "@/services/documentGenerator";
import { validateTrademarkData, getTrademarkData } from "@/services/trademarkValidation";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Document {
  name: string;
  type: string;
  status: "Generated" | "Pending";
  isRequired: boolean;
  action: "Download PDF" | "Not ready";
}

interface TrademarkFormData {
  basicInfo: {
    applicantName: string;
    trademark: string;
    filingBasis: string;
  };
  goodsServices: {
    description: string;
    class: string;
    industry: string;
    targetMarket: string;
  };
  usage: {
    firstUseDate: string;
    currentUseStatus: string;
    specimenDescription: string;
    specimenType: string;
  };
}

const TrademarkFilingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [showDocumentGenerator, setShowDocumentGenerator] = useState(false);
  const [formData, setFormData] = useState<TrademarkFormData | null>(null);

  const [documents, setDocuments] = useState<Document[]>([
    {
      name: "Trademark Application",
      type: "USPTO Form",
      status: "Pending",
      isRequired: true,
      action: "Not ready",
    },
    {
      name: "Goods and Services Description",
      type: "Legal Document",
      status: "Pending",
      isRequired: true,
      action: "Not ready",
    },
    {
      name: "Declaration of Use",
      type: "USPTO Form",
      status: "Pending",
      isRequired: true,
      action: "Not ready",
    },
    {
      name: "Specimen of Use",
      type: "Evidence Document",
      status: "Pending",
      isRequired: true,
      action: "Not ready",
    },
  ]);

  useEffect(() => {
    // Get form data from your state management or local storage
    const savedData = localStorage.getItem('trademarkFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      const { isValid, errors } = validateTrademarkData(parsedData);
      setIsValid(isValid);
      setValidationErrors(errors);
      setShowDocumentGenerator(isValid);
      
      if (isValid) {
        // Update document statuses when form is valid
        setDocuments(prev => prev.map(doc => ({
          ...doc,
          status: "Generated",
          action: "Download PDF"
        })));
      }
    }
  }, []);

  const readyDocuments = documents.filter(doc => doc.status === "Generated").length;
  const totalDocuments = documents.length;
  const completionPercentage = (readyDocuments / totalDocuments) * 100;

  const handleDownload = async (documentName: string) => {
    if (!formData) return;

    try {
      setLoading(prev => ({ ...prev, [documentName]: true }));

      const content = await generateDocument({
        documentType: documentName,
        userData: {
          ...formData.basicInfo,
          ...formData.goodsServices,
          ...formData.usage,
        },
      });

      await downloadDocument(content, `${documentName.replace(/\s+/g, "_")}.pdf`);

      toast({
        title: "Success",
        description: `${documentName} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: "Failed to generate or download the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [documentName]: false }));
    }
  };

  const handleFinish = () => {
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please complete all required information before finishing.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to the next step or show success message
    toast({
      title: "Success",
      description: "Trademark filing process completed successfully!",
    });
    navigate("/dashboard");
  };

  if (!showDocumentGenerator) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Trademark Filing Documents</h1>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Missing Information</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Please complete all required information in the wizard before generating documents:</p>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Complete the Wizard First</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              To generate your trademark filing documents, please complete all required information in the wizard:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Basic Information</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Goods and Services</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Usage Information</span>
              </div>
            </div>
            <Button 
              className="mt-4" 
              onClick={() => navigate(-1)}
            >
              Return to Wizard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Trademark Filing Documents</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Document Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Generate and manage filing-ready documents for your trademark application
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Generated Documents</span>
              <span className="text-sm text-muted-foreground">
                {readyDocuments}/{totalDocuments} Ready
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Our AI will analyze your application data and generate all required documents
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Documents will be tailored based on your application details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>All required USPTO/IP office forms will be prepared</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>You can download, review, and modify as needed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>AI-powered validation ensures compliance with filing requirements</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generated Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="h-5 w-5" />
                  <div>
                    <div className="font-medium">
                      {doc.name}
                      {doc.isRequired && (
                        <span className="text-xs text-red-500 ml-2">Required</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{doc.type}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`text-sm ${
                      doc.status === "Generated" ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {doc.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc.name)}
                    disabled={doc.action === "Not ready" || loading[doc.name]}
                  >
                    {loading[doc.name] ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : doc.action === "Download PDF" ? (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </>
                    ) : (
                      "Not ready"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button onClick={handleFinish} disabled={!isValid}>
          Finish
        </Button>
      </div>

      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          Please review all generated documents carefully before submission. 
          Make sure all required fields are filled and documents are properly formatted.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TrademarkFilingPage; 