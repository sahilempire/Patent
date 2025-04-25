import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PatentDetailedInfo: React.FC = () => {
  const { formData, updateFormData } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="technicalField">Technical Field</Label>
        <Textarea
          id="technicalField"
          name="technicalField"
          placeholder="Describe the technical field to which the invention relates"
          rows={3}
          value={formData.technicalField || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="backgroundArt">Background Art</Label>
        <Textarea
          id="backgroundArt"
          name="backgroundArt"
          placeholder="Describe the existing art, problems, and limitations that your invention addresses"
          rows={5}
          value={formData.backgroundArt || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="detailedDescription">Detailed Description</Label>
        <Textarea
          id="detailedDescription"
          name="detailedDescription"
          placeholder="Provide a detailed description of your invention, including all components, how they interact, and alternative embodiments"
          rows={10}
          value={formData.detailedDescription || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="advantageousEffects">Advantageous Effects</Label>
        <Textarea
          id="advantageousEffects"
          name="advantageousEffects"
          placeholder="Describe the advantages and improvements your invention provides over existing solutions"
          rows={4}
          value={formData.advantageousEffects || ''}
          onChange={handleChange}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Drawing References</Label>
        <p className="text-sm text-muted-foreground mb-2">
          List the drawings you plan to include and briefly describe each
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Input
              name="drawingLabel1"
              placeholder="Fig. 1"
              value={formData.drawingLabel1 || ''}
              onChange={handleChange}
              className="col-span-1"
            />
            <Input
              name="drawingDescription1"
              placeholder="Description of Figure 1"
              value={formData.drawingDescription1 || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <Input
              name="drawingLabel2"
              placeholder="Fig. 2"
              value={formData.drawingLabel2 || ''}
              onChange={handleChange}
              className="col-span-1"
            />
            <Input
              name="drawingDescription2"
              placeholder="Description of Figure 2"
              value={formData.drawingDescription2 || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">AI Suggestion</CardTitle>
          <CardDescription>Improvement opportunities for your description:</CardDescription>
        </CardHeader>
        <CardContent>
          {formData.detailedDescription && formData.detailedDescription.trim() ? (
            <ul className="list-disc ml-5 text-sm text-muted-foreground">
              <li>Include specific dimensions and materials where relevant</li>
              <li>Describe multiple embodiments to broaden protection</li>
              <li>Ensure you explain how to make and use the invention</li>
              <li>Link description elements to your drawing references</li>
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter a detailed description to receive AI suggestions
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatentDetailedInfo;
