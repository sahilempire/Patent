import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { validateBasicInfo } from "@/services/trademarkValidation";
import { useToast } from "@/components/ui/use-toast";

interface BasicInfo {
  applicantName: string;
  trademark: string;
  filingBasis: string;
}

interface TrademarkBasicInfoProps {
  onNext: (data: BasicInfo) => void;
  onBack: () => void;
  initialData?: BasicInfo;
}

const TrademarkBasicInfo = ({ onNext, onBack, initialData }: TrademarkBasicInfoProps) => {
  const { toast } = useToast();
  const { formData, updateFormData } = useAppContext();
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const { isValid, errors } = validateBasicInfo(formData);
    setErrors(errors);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors } = validateBasicInfo(formData);
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="applicantName">Applicant Name</Label>
          <Input
            id="applicantName"
            name="applicantName"
            value={formData.applicantName}
            onChange={(e) => handleChange(e)}
            placeholder="Enter applicant name"
            className={errors.includes("Applicant name is required") ? "border-red-500" : ""}
          />
          {errors.includes("Applicant name is required") && (
            <p className="text-sm text-red-500">Applicant name is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="trademark">Trademark</Label>
          <Input
            id="trademark"
            name="trademark"
            value={formData.trademark}
            onChange={(e) => handleChange(e)}
            placeholder="Enter trademark"
            className={errors.includes("Trademark is required") ? "border-red-500" : ""}
          />
          {errors.includes("Trademark is required") && (
            <p className="text-sm text-red-500">Trademark is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="filingBasis">Filing Basis</Label>
          <Select
            value={formData.filingBasis}
            onValueChange={(value) => handleSelectChange('filingBasis', value)}
          >
            <SelectTrigger className={errors.includes("Filing basis is required") ? "border-red-500" : ""}>
              <SelectValue placeholder="Select filing basis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="use_in_commerce">Use in Commerce</SelectItem>
              <SelectItem value="intent_to_use">Intent to Use</SelectItem>
              <SelectItem value="foreign_registration">Foreign Registration</SelectItem>
            </SelectContent>
          </Select>
          {errors.includes("Filing basis is required") && (
            <p className="text-sm text-red-500">Filing basis is required</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="markName">Trademark Name</Label>
        <Input
          id="markName"
          name="markName"
          placeholder="Enter the exact text of your trademark"
          value={formData.markName || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label>Mark Type</Label>
        <RadioGroup 
          defaultValue={formData.markType || 'standard'} 
          onValueChange={(value) => handleSelectChange('markType', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="cursor-pointer">Standard Character Mark (text only)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="design" id="design" />
            <Label htmlFor="design" className="cursor-pointer">Design Mark (logo or stylized text)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sound" id="sound" />
            <Label htmlFor="sound" className="cursor-pointer">Sound Mark</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.markType === 'design' && (
        <Alert>
          <AlertTitle>Logo Upload Required</AlertTitle>
          <AlertDescription>
            You've selected a Design Mark. Please upload your logo in the Upload Manager section after completing this form.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Label htmlFor="ownerName">Owner Name</Label>
        <Input
          id="ownerName"
          name="ownerName"
          placeholder="Full legal name of the trademark owner (person or entity)"
          value={formData.ownerName || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="ownerType">Owner Type</Label>
        <Select 
          value={formData.ownerType || ''} 
          onValueChange={(value) => handleSelectChange('ownerType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select owner type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="corporation">Corporation</SelectItem>
            <SelectItem value="llc">Limited Liability Company</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
            <SelectItem value="association">Association</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="ownerAddress">Owner Address</Label>
        <Textarea
          id="ownerAddress"
          name="ownerAddress"
          placeholder="Full mailing address of the trademark owner"
          rows={3}
          value={formData.ownerAddress || ''}
          onChange={handleChange}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">AI Suggestion</CardTitle>
          <CardDescription>Based on your trademark name, consider:</CardDescription>
        </CardHeader>
        <CardContent>
          {formData.markName ? (
            <ul className="list-disc ml-5 text-sm text-muted-foreground">
              <li>Check for potential conflicts with existing marks</li>
              <li>Consider broader protection with slight variations</li>
              <li>Ensure your mark is distinctive and not merely descriptive</li>
              {formData.markType === 'design' && (
                <li>Use vector format for your logo upload for best results</li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter your trademark details to receive AI suggestions
            </p>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export default TrademarkBasicInfo;
