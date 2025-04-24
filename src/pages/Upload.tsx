import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Upload as UploadIcon, FileText, CheckCircle2 } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const UploadPage = () => {
  const navigate = useNavigate();
  const { filingType } = useAppContext();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFiles(prevFiles => [...prevFiles, ...Array.from(files).map(f => f.name)]);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleSubmit = () => {
    // Here you would typically send the files to your backend
    // For now, we'll just navigate to the next step
    navigate("/filing/review");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Upload Required Documents
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Step 2 of 3</span>
                <Progress value={66} className="w-24 h-2" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                Please upload all required documents for your {filingType} application.
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max size: 10MB per file)
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadIcon className="h-5 w-5 text-blue-500" />
                  Upload Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <UploadIcon className="h-12 w-12 text-gray-400" />
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          Drag and drop files here, or click to select files
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        disabled={isUploading}
                      >
                        Select Files
                      </Button>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Uploaded Files</h3>
                      <div className="space-y-2">
                        {uploadedFiles.map((fileName, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                          >
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{fileName}</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={uploadedFiles.length === 0 || isUploading}
              >
                Continue to Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage; 