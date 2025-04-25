import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, AlertCircle, CheckCircle2 } from "lucide-react";
import ClassSelector from "@/components/ClassSelector";
import { toast } from "sonner";

const Trademark = () => {
  const navigate = useNavigate();
  const { setFilingType, setCurrentStep } = useAppContext();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("applicant");
  const [formProgress, setFormProgress] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Applicant Info
    fullName: "",
    entityType: "",
    nationality: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    email: "",
    phone: "",
    authorizedSignatoryName: "",
    attorneyName: "",
    attorneyContact: "",
    businessRegistrationNumber: "",

    // Trademark Basics
    trademarkType: "word",
    trademarkName: "",
    trademarkDescription: "",
    trademarkImage: null,
    soundFile: null,
    tagline: "",
    translation: "",
    hasColorClaim: false,
    colors: "",
    isStylized: false,
    trademarkLanguage: "English",

    // Classification & Usage
    selectedClasses: [],
    goodsAndServices: "",
    isUsingInCommerce: false,
    firstUseDate: "",
    usageProof: null,
    intentToUse: false,
    priorityClaim: false,
    priorityCountry: "",
    priorityDate: "",
    priorityNumber: "",

    // Legal & Additional Info
    declarationOfOwnership: false,
    confirmationOfAccuracy: false,
    signature: "",
    submissionDate: new Date().toISOString().split('T')[0],
    existingTrademarkNumber: "",
    socialMediaHandles: "",
    website: "",
    additionalDocuments: null,
  });

  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = {
      applicant: {
        fullName: true,
        entityType: true,
        nationality: true,
        address: true,
        email: true,
        phone: true
      },
      classification: {
        selectedClasses: true,
        goodsAndServices: true,
        isUsingInCommerce: true
      },
      legal: {
        declarationOfOwnership: true,
        confirmationOfAccuracy: true,
        signature: true
      }
    };

    // Count completed required fields
    let completedFields = 0;
    let totalRequiredFields = 0;

    // Check applicant section
    Object.entries(requiredFields.applicant).forEach(([field, required]) => {
      if (required) {
        totalRequiredFields++;
        if (formData[field] && formData[field] !== "") {
          completedFields++;
        }
      }
    });

    // Check classification section
    Object.entries(requiredFields.classification).forEach(([field, required]) => {
      if (required) {
        totalRequiredFields++;
        if (field === 'selectedClasses') {
          if (formData[field] && formData[field].length > 0) {
            completedFields++;
          }
        } else if (field === 'isUsingInCommerce') {
          if (formData.isUsingInCommerce || formData.intentToUse) {
            completedFields++;
          }
        } else if (formData[field] && formData[field] !== "") {
          completedFields++;
        }
      }
    });

    // Check legal section
    Object.entries(requiredFields.legal).forEach(([field, required]) => {
      if (required) {
        totalRequiredFields++;
        if (formData[field]) {
          completedFields++;
        }
      }
    });

    // Calculate percentage (ensure it's between 0 and 100)
    const progress = Math.min(Math.round((completedFields / totalRequiredFields) * 100), 100);
    setFormProgress(progress);
  }, [formData]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Applicant Info validation
    if (!formData.fullName) errors.fullName = "Full name is required";
    if (!formData.entityType) errors.entityType = "Entity type is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    
    // Trademark Info validation
    if (!formData.trademarkName) errors.trademarkName = "Trademark name is required";
    if (!formData.trademarkDescription) errors.trademarkDescription = "Trademark description is required";
    
    // Classification validation
    if (formData.selectedClasses.length === 0) errors.selectedClasses = "At least one class must be selected";
    if (!formData.goodsAndServices) errors.goodsAndServices = "Goods and services description is required";
    
    // Usage validation
    if (!formData.isUsingInCommerce && !formData.intentToUse) {
      errors.usageType = "You must specify either 'Using in Commerce' or 'Intent to Use'";
    }
    
    // Legal validation
    if (!formData.declarationOfOwnership) errors.declarationOfOwnership = "Declaration of ownership is required";
    if (!formData.confirmationOfAccuracy) errors.confirmationOfAccuracy = "Confirmation of accuracy is required";
    if (!formData.signature) errors.signature = "Signature is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    if (!user?.id) {
      console.error('No user ID found');
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    // Force validation of all required fields
    const errors: Record<string, string> = {};
    
    // Applicant Info validation
    if (!formData.fullName) errors.fullName = "Full name is required";
    if (!formData.entityType) errors.entityType = "Entity type is required";
    if (!formData.nationality) errors.nationality = "Nationality is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    
    // Classification validation
    if (formData.selectedClasses.length === 0) errors.selectedClasses = "At least one class must be selected";
    if (!formData.goodsAndServices) errors.goodsAndServices = "Goods and services description is required";
    
    // Usage validation
    if (!formData.isUsingInCommerce && !formData.intentToUse) {
      errors.usageType = "You must specify either 'Using in Commerce' or 'Intent to Use'";
    }
    
    // Legal validation
    if (!formData.declarationOfOwnership) errors.declarationOfOwnership = "Declaration of ownership is required";
    if (!formData.confirmationOfAccuracy) errors.confirmationOfAccuracy = "Confirmation of accuracy is required";
    if (!formData.signature) errors.signature = "Signature is required";

    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      console.error('Form validation failed:', errors);
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Preparing data for submission...');
      // Prepare the data for Supabase, matching exact column names
      const supabaseData = {
        user_id: user.id,
        applicant_name: formData.fullName,
        entity_type: formData.entityType,
        nationality: formData.nationality,
        street_address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
        email: formData.email,
        phone: formData.phone,
        authorized_signatory_name: formData.authorizedSignatoryName,
        attorney_name: formData.attorneyName,
        attorney_contact: formData.attorneyContact,
        business_registration_number: formData.businessRegistrationNumber,
        trademark_type: formData.trademarkType,
        trademark_name: formData.trademarkName,
        trademark_description: formData.trademarkDescription,
        tagline: formData.tagline,
        translation: formData.translation,
        has_color_claim: formData.hasColorClaim,
        colors: formData.colors,
        is_stylized: formData.isStylized,
        trademark_language: formData.trademarkLanguage,
        selected_classes: formData.selectedClasses,
        goods_services: formData.goodsAndServices,
        is_using_in_commerce: formData.isUsingInCommerce,
        first_use_date: formData.firstUseDate || null,
        intent_to_use: formData.intentToUse,
        priority_claim: formData.priorityClaim,
        priority_country: formData.priorityCountry,
        priority_date: formData.priorityDate || null,
        priority_number: formData.priorityNumber,
        declaration_of_ownership: formData.declarationOfOwnership,
        confirmation_of_accuracy: formData.confirmationOfAccuracy,
        signature: formData.signature,
        submission_date: new Date().toISOString().split('T')[0],
        existing_trademark_number: formData.existingTrademarkNumber,
        social_media_handles: formData.socialMediaHandles,
        website: formData.website,
        specimen_url: null
      };

      // Remove any empty date fields
      if (!supabaseData.first_use_date) delete supabaseData.first_use_date;
      if (!supabaseData.priority_date) delete supabaseData.priority_date;

      console.log('Saving data to Supabase:', supabaseData);

      // Save to Supabase
      const { data, error } = await supabase
        .from('trademark_applications')
        .upsert(supabaseData)
        .select()
        .single();

      if (error) {
        console.error('Error saving to Supabase:', error);
        throw new Error(`Failed to save application data: ${error.message}`);
      }

      console.log('Successfully saved data:', data);

      // Handle file uploads if needed
      if (formData.usageProof) {
        console.log('Uploading usage proof...');
        const fileExt = formData.usageProof.name.split('.').pop();
        const fileName = `${user.id}-specimen.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('specimens')
          .upload(fileName, formData.usageProof);

        if (uploadError) {
          console.error('Error uploading specimen:', uploadError);
          toast.error("Failed to upload usage proof, but application was saved.");
        }
      }

      toast.success("Application saved successfully!");
      setFilingType("trademark");
      setCurrentStep(1);
      navigate("/filing/upload");
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderApplicantInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Applicant Info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Please fill in your personal and organization details accurately. All fields marked with * are required.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name / Organization Name *
              </label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {formErrors.fullName && (
                <Alert variant="destructive" className="md:col-span-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formErrors.fullName}</AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entity Type *
              </label>
              <select
                name="entityType"
                value={formData.entityType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Entity Type</option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="partnership">Partnership</option>
                <option value="llp">LLP</option>
                <option value="trust">Trust</option>
                <option value="society">Society</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality / Country of Incorporation
              </label>
              <Input
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <Input
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code
              </label>
              <Input
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Authorized Signatory Name
              </label>
              <Input
                name="authorizedSignatoryName"
                value={formData.authorizedSignatoryName}
                onChange={handleChange}
                placeholder="Required if filing on behalf of organization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Registration Number
              </label>
              <Input
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleChange}
                placeholder="Optional - helps with verification"
              />
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Attorney / Agent Information (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="attorneyName"
                  value={formData.attorneyName}
                  onChange={handleChange}
                  placeholder="Attorney/Agent Name"
                />
                <Input
                  name="attorneyContact"
                  value={formData.attorneyContact}
                  onChange={handleChange}
                  placeholder="Contact Information"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTrademarkBasics = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Trademark Basics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Provide detailed information about your trademark. All fields marked with * are required.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trademark Type *
              </label>
              <select
                name="trademarkType"
                value={formData.trademarkType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="word">Word Mark</option>
                <option value="logo">Logo Mark</option>
                <option value="slogan">Slogan</option>
                <option value="sound">Sound</option>
                <option value="color">Color</option>
                <option value="shape">Shape</option>
                <option value="combination">Combination</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline / Slogan
              </label>
              <Input
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Optional - helps clarify brand message"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Translation or Transliteration
              </label>
              <Input
                name="translation"
                value={formData.translation}
                onChange={handleChange}
                placeholder="Required if trademark is in non-English language"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasColorClaim"
                  checked={formData.hasColorClaim}
                  onCheckedChange={(checked) => handleCheckboxChange("hasColorClaim", checked as boolean)}
                />
                <label htmlFor="hasColorClaim" className="text-sm font-medium">
                  Does your trademark include specific colors?
                </label>
              </div>
              {formData.hasColorClaim && (
                <Input
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  placeholder="List the colors used in your trademark"
                  className="mt-2"
                />
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isStylized"
                  checked={formData.isStylized}
                  onCheckedChange={(checked) => handleCheckboxChange("isStylized", checked as boolean)}
                />
                <label htmlFor="isStylized" className="text-sm font-medium">
                  Is this a stylized text/logo?
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trademark Name or Word Mark
              </label>
              <Input
                name="trademarkName"
                value={formData.trademarkName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trademark Description
              </label>
              <textarea
                name="trademarkDescription"
                value={formData.trademarkDescription}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Trademark Image
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => handleFileChange(e, "trademarkImage")}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sound/Multimedia File
              </label>
              <input
                type="file"
                accept="audio/mp3,video/mp4"
                onChange={(e) => handleFileChange(e, "soundFile")}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderClassificationInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Classification & Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Select the appropriate classes and provide usage information for your trademark.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class(es) *
              </label>
              <ClassSelector
                selectedClasses={formData.selectedClasses}
                onChange={(classes) => setFormData(prev => ({ ...prev, selectedClasses: classes }))}
              />
              {formErrors.selectedClasses && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formErrors.selectedClasses}</AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goods/Services Covered *
              </label>
              <textarea
                name="goodsAndServices"
                value={formData.goodsAndServices}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Describe the goods/services covered by your trademark"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isUsingInCommerce"
                  checked={formData.isUsingInCommerce}
                  onCheckedChange={(checked) => handleCheckboxChange("isUsingInCommerce", checked as boolean)}
                />
                <label htmlFor="isUsingInCommerce" className="text-sm font-medium">
                  Are you using this mark in commerce already?
                </label>
              </div>
            </div>

            {formData.isUsingInCommerce && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of First Use *
                  </label>
                  <Input
                    name="firstUseDate"
                    type="date"
                    value={formData.firstUseDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Usage Proof *
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, "usageProof")}
                    className="w-full"
                    required
                  />
                </div>
              </>
            )}

            {!formData.isUsingInCommerce && (
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="intentToUse"
                    checked={formData.intentToUse}
                    onCheckedChange={(checked) => handleCheckboxChange("intentToUse", checked as boolean)}
                  />
                  <label htmlFor="intentToUse" className="text-sm font-medium">
                    Intent to Use *
                  </label>
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priorityClaim"
                  checked={formData.priorityClaim}
                  onCheckedChange={(checked) => handleCheckboxChange("priorityClaim", checked as boolean)}
                />
                <label htmlFor="priorityClaim" className="text-sm font-medium">
                  Do you want to claim priority from an earlier filing?
                </label>
              </div>
            </div>

            {formData.priorityClaim && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Country
                  </label>
                  <Input
                    name="priorityCountry"
                    value={formData.priorityCountry}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Date
                  </label>
                  <Input
                    name="priorityDate"
                    type="date"
                    value={formData.priorityDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Number
                  </label>
                  <Input
                    name="priorityNumber"
                    value={formData.priorityNumber}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLegalInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Legal & Additional Info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Please review and confirm the legal declarations before submitting.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="declarationOfOwnership"
                checked={formData.declarationOfOwnership}
                onCheckedChange={(checked) => handleCheckboxChange("declarationOfOwnership", checked as boolean)}
                required
              />
              <label htmlFor="declarationOfOwnership" className="text-sm font-medium">
                I declare that I am the rightful owner or have rights to file this trademark. *
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirmationOfAccuracy"
                checked={formData.confirmationOfAccuracy}
                onCheckedChange={(checked) => handleCheckboxChange("confirmationOfAccuracy", checked as boolean)}
                required
              />
              <label htmlFor="confirmationOfAccuracy" className="text-sm font-medium">
                The information provided is accurate to the best of my knowledge. *
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Digital Signature *
              </label>
              <Input
                name="signature"
                value={formData.signature}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Existing Trademark Number (if applicable)
              </label>
              <Input
                name="existingTrademarkNumber"
                value={formData.existingTrademarkNumber}
                onChange={handleChange}
                placeholder="For re-filing, corrections, or expansions"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Social Media Handles
                </label>
                <Input
                  name="socialMediaHandles"
                  value={formData.socialMediaHandles}
                  onChange={handleChange}
                  placeholder="e.g., @companyname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Additional Supporting Documents
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => handleFileChange(e, "additionalDocuments")}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Trademark Application</h1>
              <Badge variant={formProgress === 100 ? "secondary" : "default"}>
                {formProgress}% Complete
              </Badge>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="applicant" className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${formData.fullName && formData.email ? "text-green-500" : "text-gray-400"}`} />
                  Applicant Info
                </TabsTrigger>
                <TabsTrigger value="classification" className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${formData.selectedClasses.length > 0 ? "text-green-500" : "text-gray-400"}`} />
                  Classification
                </TabsTrigger>
                <TabsTrigger value="legal" className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${formData.declarationOfOwnership && formData.confirmationOfAccuracy ? "text-green-500" : "text-gray-400"}`} />
                  Legal Info
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="applicant">
                {renderApplicantInfo()}
              </TabsContent>
              
              <TabsContent value="classification">
                {renderClassificationInfo()}
              </TabsContent>
              
              <TabsContent value="legal">
                {renderLegalInfo()}
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <div className="flex gap-4">
                {activeTab !== "applicant" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab(activeTab === "legal" ? "classification" : "applicant")}
                  >
                    Previous
                  </Button>
                )}
                {activeTab !== "legal" ? (
                  <Button
                    type="button"
                    onClick={() => setActiveTab(activeTab === "applicant" ? "classification" : "legal")}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Trademark; 