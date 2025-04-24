import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AppContext";
import { Checkbox } from "@/components/ui/checkbox";

const Trademark = () => {
  const navigate = useNavigate();
  const { setFilingType, setCurrentStep } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    // Page 1: Applicant & Basic Trademark Info
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
    authorizedRepName: "",
    attorneyName: "",
    attorneyDetails: "",
    
    // Trademark Basics
    trademarkType: "word",
    trademarkName: "",
    trademarkDescription: "",
    trademarkImage: null,
    soundFile: null,
    tagline: "",
    meaning: "",
    trademarkLanguage: "English",

    // Page 2: Classification & Usage Info
    selectedClasses: [],
    goodsAndServices: "",
    businessCategory: "",
    firstUseDate: "",
    isCurrentlyUsed: false,
    usageProof: "",
    intentionToUse: false,
    geographicAreas: "",
    hasDomainName: false,
    domainName: "",

    // Page 3: Legal & Additional Info
    declarationOfOwnership: false,
    confirmationOfAccuracy: false,
    signature: "",
    submissionDate: new Date().toISOString().split('T')[0],
    notes: "",
    existingTrademarkNumber: "",
    competitorReferences: "",
    additionalDocuments: null,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    } else {
      setFilingType("trademark");
      setCurrentStep(1);
      navigate("/filing/upload");
    }
  };

  const renderPage1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Applicant & Basic Trademark Info</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name / Organization Name
          </label>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entity Type
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
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Trademark Basics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trademark Type
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
    </div>
  );

  const renderPage2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Classification & Usage Info</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Class(es)
          </label>
          <select
            name="selectedClasses"
            multiple
            value={formData.selectedClasses}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="25">Class 25: Clothing</option>
            <option value="9">Class 9: Electronics</option>
            <option value="35">Class 35: Advertising</option>
            {/* Add more classes as needed */}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            List of Goods/Services
          </label>
          <textarea
            name="goodsAndServices"
            value={formData.goodsAndServices}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Category
          </label>
          <Input
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of First Use
          </label>
          <Input
            name="firstUseDate"
            type="date"
            value={formData.firstUseDate}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isCurrentlyUsed"
              checked={formData.isCurrentlyUsed}
              onCheckedChange={(checked) => handleCheckboxChange("isCurrentlyUsed", checked as boolean)}
            />
            <label htmlFor="isCurrentlyUsed" className="text-sm font-medium">
              Is it currently being used?
            </label>
          </div>
        </div>

        {formData.isCurrentlyUsed && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Proof
            </label>
            <Input
              name="usageProof"
              value={formData.usageProof}
              onChange={handleChange}
              placeholder="Website link, invoice, product label, etc."
            />
          </div>
        )}

        {!formData.isCurrentlyUsed && (
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="intentionToUse"
                checked={formData.intentionToUse}
                onCheckedChange={(checked) => handleCheckboxChange("intentionToUse", checked as boolean)}
              />
              <label htmlFor="intentionToUse" className="text-sm font-medium">
                Intention to Use Statement
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPage3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Legal & Additional Info</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="declarationOfOwnership"
            checked={formData.declarationOfOwnership}
            onCheckedChange={(checked) => handleCheckboxChange("declarationOfOwnership", checked as boolean)}
            required
          />
          <label htmlFor="declarationOfOwnership" className="text-sm font-medium">
            I declare that I am the rightful owner or have rights to file this trademark.
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
            The information provided is accurate to the best of my knowledge.
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Signature
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
            Notes / Special Instructions
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
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
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Trademark Application</h1>
            <div className="text-sm text-gray-500">
              Page {currentPage} of 3
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentPage === 1 && renderPage1()}
            {currentPage === 2 && renderPage2()}
            {currentPage === 3 && renderPage3()}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => currentPage > 1 ? setCurrentPage(currentPage - 1) : navigate("/dashboard")}
              >
                {currentPage > 1 ? "Previous" : "Cancel"}
              </Button>
              <Button type="submit">
                {currentPage < 3 ? "Next" : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Trademark; 