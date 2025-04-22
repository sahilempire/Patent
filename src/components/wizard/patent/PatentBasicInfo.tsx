
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PatentBasicInfo: React.FC = () => {
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
        <Label htmlFor="inventionTitle">Invention Title</Label>
        <Input
          id="inventionTitle"
          name="inventionTitle"
          placeholder="Enter a clear, concise title for your invention"
          value={formData.inventionTitle || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="inventorNames">Inventor Name(s)</Label>
        <Input
          id="inventorNames"
          name="inventorNames"
          placeholder="Full names of all inventors, separated by commas"
          value={formData.inventorNames || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="inventionType">Type of Patent</Label>
        <Select 
          value={formData.inventionType || ''} 
          onValueChange={(value) => handleSelectChange('inventionType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select patent type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="utility">Utility Patent</SelectItem>
            <SelectItem value="design">Design Patent</SelectItem>
            <SelectItem value="plant">Plant Patent</SelectItem>
            <SelectItem value="provisional">Provisional Patent Application</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="briefSummary">Brief Summary</Label>
        <Textarea
          id="briefSummary"
          name="briefSummary"
          placeholder="Provide a brief summary of your invention (1-2 paragraphs)"
          rows={5}
          value={formData.briefSummary || ''}
          onChange={handleChange}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">AI Suggestion</CardTitle>
          <CardDescription>Based on your summary, consider these improvements:</CardDescription>
        </CardHeader>
        <CardContent>
          {formData.briefSummary ? (
            <ul className="list-disc ml-5 text-sm text-muted-foreground">
              <li>Include specific technical field of the invention</li>
              <li>Mention key components or steps clearly</li>
              <li>Highlight the primary advantage over existing solutions</li>
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter a summary to receive AI suggestions
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatentBasicInfo;
