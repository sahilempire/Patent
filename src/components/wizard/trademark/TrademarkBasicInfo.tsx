
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TrademarkBasicInfo: React.FC = () => {
  const { formData, updateFormData } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <Label htmlFor="filingBasis">Filing Basis</Label>
        <Select 
          value={formData.filingBasis || ''} 
          onValueChange={(value) => handleSelectChange('filingBasis', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select filing basis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="use">Use in Commerce (already using the mark)</SelectItem>
            <SelectItem value="intent">Intent to Use (plan to use in the future)</SelectItem>
            <SelectItem value="foreign">Foreign Registration</SelectItem>
            <SelectItem value="treaty">International Treaty</SelectItem>
          </SelectContent>
        </Select>
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
    </div>
  );
};

export default TrademarkBasicInfo;
