import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, FileText, Download, CheckCircle2, Loader2, Eye } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { generateDocument } from "@/services/documentService";
import { toast } from "sonner";
import { saveAs } from 'file-saver';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface GeneratedDocument {
  name: string;
  blob: Blob;
}

const DocumentGenerator = () => {
  const navigate = useNavigate();
  const { filingType, formData } = useAppContext();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<GeneratedDocument | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!user?.id) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    setIsGenerating(true);
    try {
      const documents = [
        "Trademark Application Form",
        "Declaration of Use",
        "Specimen of Use",
        "Power of Attorney"
      ];

      const generatedDocs: GeneratedDocument[] = [];
      
      for (const docName of documents) {
        try {
          const blob = await generateDocument(user.id, docName);
          generatedDocs.push({ name: docName, blob });
        } catch (error) {
          console.error(`Error generating ${docName}:`, error);
          toast.error(`Failed to generate ${docName}`);
        }
      }

      setGeneratedDocuments(generatedDocs);
      toast.success("Documents generated successfully!");
    } catch (error) {
      console.error("Error in document generation:", error);
      toast.error("Failed to generate documents");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (document: GeneratedDocument) => {
    try {
      setDownloadingDoc(document.name);
      
      // Use file-saver to download the file
      saveAs(document.blob, `${document.name.replace(/\s+/g, '_')}.pdf`);
      
      toast.success(`${document.name} downloaded successfully`);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    } finally {
      setDownloadingDoc(null);
    }
  };

  const handlePreview = (document: GeneratedDocument) => {
    setPreviewDoc(document);
    const url = URL.createObjectURL(document.blob);
    setPreviewUrl(url);
  };

  const closePreview = () => {
    setPreviewDoc(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Document Generator
            </h1>
            <p className="text-lg text-gray-600">
              Generate and manage filing-ready documents for your application
            </p>
          </div>

          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                Our AI will analyze your application data and generate all required documents
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Generate Your Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ready to generate your {filingType} filing documents</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Documents will be tailored based on your application details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>All required USPTO/IP office forms will be prepared</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>You can download, review, and modify as needed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>AI-powered validation ensures compliance with filing requirements</span>
                      </li>
                    </ul>
                  </div>

                  {generatedDocuments.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Generated Documents</h3>
                      <div className="space-y-2">
                        {generatedDocuments.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{doc.name}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreview(doc)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(doc)}
                                disabled={downloadingDoc === doc.name}
                              >
                                {downloadingDoc === doc.name ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4 mr-2" />
                                )}
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Documents...
                        </>
                      ) : (
                        "Generate Filing Documents"
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isGenerating}
              >
                Back
              </Button>
              {generatedDocuments.length > 0 && (
                <Button
                  onClick={() => navigate("/dashboard")}
                >
                  Return to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!previewDoc} onOpenChange={closePreview}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <FileText className="h-5 w-5 text-blue-500" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {previewDoc?.name}
                </motion.span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {previewUrl && (
                  <motion.div
                    key="preview-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="h-full w-full flex flex-col"
                  >
                    <div className="flex-1 overflow-auto p-6">
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <iframe
                          src={previewUrl}
                          className="w-full h-full min-h-[70vh] border rounded-lg shadow-sm"
                          title={previewDoc?.name}
                        />
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="border-t p-4 flex justify-end gap-3"
                    >
                      <Button
                        variant="outline"
                        onClick={closePreview}
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => previewDoc && handleDownload(previewDoc)}
                        disabled={downloadingDoc === previewDoc?.name}
                      >
                        {downloadingDoc === previewDoc?.name ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Download
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentGenerator; 