import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle2, FileText, ArrowLeft } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const Review = () => {
  const navigate = useNavigate();
  const { filingType } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically save the application data to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate("/filing/generate");
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Review Your Application
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Step 3 of 3</span>
                <Progress value={100} className="w-24 h-2" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                Please review your {filingType} application details before submitting.
                Make sure all information is accurate and complete.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Application Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Application Type</h3>
                      <p className="text-lg font-medium">{filingType === 'trademark' ? 'Trademark Registration' : 'Patent Application'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                      <p className="text-lg font-medium text-green-600">Ready to Submit</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Required Documents</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Application Form</p>
                          <p className="text-sm text-gray-500">Completed and verified</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Supporting Documents</p>
                          <p className="text-sm text-gray-500">All required files uploaded</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Next Steps</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>1. Review all information for accuracy</p>
                      <p>2. Submit your application</p>
                      <p>3. Receive confirmation and tracking number</p>
                      <p>4. Monitor application status in your dashboard</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review; 