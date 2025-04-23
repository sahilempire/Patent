import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { validateUsageEvidence } from "@/services/trademarkValidation";

interface UsageEvidence {
  firstUseDate: string;
  currentUseStatus: string;
  specimenDescription: string;
  specimenType: string;
}

interface TrademarkUsageProps {
  onNext: (data: UsageEvidence) => void;
  onBack: () => void;
  initialData?: UsageEvidence;
}

const TrademarkUsage = ({ onNext, onBack, initialData }: TrademarkUsageProps) => {
  const { formData, updateFormData } = useAppContext();
  const { toast } = useToast();
  const [firstUseDate, setFirstUseDate] = useState<Date | undefined>(
    formData.firstUseDate ? new Date(formData.firstUseDate) : undefined
  );
  const [firstUseCommerce, setFirstUseCommerce] = useState<Date | undefined>(
    formData.firstUseCommerce ? new Date(formData.firstUseCommerce) : undefined
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleDateChange = (field: 'firstUseDate' | 'firstUseCommerce', date?: Date) => {
    if (field === 'firstUseDate') {
      setFirstUseDate(date);
      if (date) {
        updateFormData({ firstUseDate: date.toISOString() });
      }
    } else {
      setFirstUseCommerce(date);
      if (date) {
        updateFormData({ firstUseCommerce: date.toISOString() });
      }
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    updateFormData({ [name]: checked });
  };

  const handleUploadPrompt = () => {
    toast({
      title: "Upload required",
      description: "Please go to the Upload Manager to add specimens showing use of your mark",
    });
  };

  useEffect(() => {
    const { isValid, errors } = validateUsageEvidence(formData);
    setErrors(errors);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors } = validateUsageEvidence(formData);
    
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
      <Alert className="mb-6">
        <AlertTitle>Usage Information</AlertTitle>
        <AlertDescription>
          If you're filing based on "Use in Commerce," you'll need to provide information about how 
          and when your mark has been used. If filing based on "Intent to Use," you can skip the 
          dates but should still describe planned use.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <Label>Date of First Use Anywhere</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !firstUseDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {firstUseDate ? format(firstUseDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={firstUseDate}
              onSelect={(date) => handleDateChange('firstUseDate', date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <Label>Date of First Use in Commerce</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !firstUseCommerce && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {firstUseCommerce ? format(firstUseCommerce, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={firstUseCommerce}
              onSelect={(date) => handleDateChange('firstUseCommerce', date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <Label htmlFor="commerceType">Type of Commerce</Label>
        <Select 
          value={formData.commerceType || ''} 
          onValueChange={(value) => handleSelectChange('commerceType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type of commerce" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="interstate">Interstate</SelectItem>
            <SelectItem value="international">International</SelectItem>
            <SelectItem value="both">Both Interstate and International</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="usageDescription">Describe How Mark is Used</Label>
        <Input
          id="usageDescription"
          name="usageDescription"
          placeholder="Describe how the mark appears on goods, packaging, or in connection with services"
          value={formData.usageDescription || ''}
          onChange={(e) => updateFormData({ usageDescription: e.target.value })}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Specimen of Use</CardTitle>
          <CardDescription>
            Upload a specimen showing how you use your trademark in commerce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="specimen">Upload Specimen</Label>
              <Input
                id="specimen"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateFormData({ ...formData, specimen: file });
                  }
                }}
              />
              <p className="text-sm text-muted-foreground">
                Accepts images and PDF files
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Declaration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="declarationTruth" 
                checked={formData.declarationTruth || false}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('declarationTruth', checked as boolean)
                }
              />
              <Label htmlFor="declarationTruth" className="text-sm cursor-pointer">
                I declare that all statements made of my own knowledge are true and all statements made 
                on information and belief are believed to be true.
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="declarationPenalty" 
                checked={formData.declarationPenalty || false}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('declarationPenalty', checked as boolean)
                }
              />
              <Label htmlFor="declarationPenalty" className="text-sm cursor-pointer">
                I understand that willful false statements may result in penalties and 
                jeopardize the validity of the application or any registration resulting from it.
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default TrademarkUsage;
