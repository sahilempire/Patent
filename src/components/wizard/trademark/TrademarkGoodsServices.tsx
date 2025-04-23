import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Plus, Search, X, FileText, InfoIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { validateGoodsServices } from "@/services/trademarkValidation";

interface GoodsService {
  id: string;
  description: string;
  class: string;
}

// Nice Classification categories
const niceClassifications = [
  { id: "1", name: "Class 1", description: "Chemicals" },
  { id: "9", name: "Class 9", description: "Computer hardware and software" },
  { id: "16", name: "Class 16", description: "Paper goods and printed materials" },
  { id: "25", name: "Class 25", description: "Clothing" },
  { id: "35", name: "Class 35", description: "Advertising and business" },
  { id: "36", name: "Class 36", description: "Insurance and financial services" },
  { id: "38", name: "Class 38", description: "Telecommunications" },
  { id: "41", name: "Class 41", description: "Education and entertainment" },
  { id: "42", name: "Class 42", description: "Scientific and technological services" },
  { id: "45", name: "Class 45", description: "Legal services" },
];

interface GoodsServices {
  description: string;
  class: string;
  industry: string;
  targetMarket: string;
}

interface TrademarkGoodsServicesProps {
  onNext: (data: GoodsServices) => void;
  onBack: () => void;
  initialData?: GoodsServices;
}

const TrademarkGoodsServices = ({ onNext, onBack, initialData }: TrademarkGoodsServicesProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<GoodsServices>({
    description: initialData?.description || "",
    class: initialData?.class || "",
    industry: initialData?.industry || "",
    targetMarket: initialData?.targetMarket || "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const { isValid, errors } = validateGoodsServices(formData);
    setErrors(errors);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors } = validateGoodsServices(formData);
    
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
    <div className="space-y-8">
      {/* Business Description Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" /> Business Description
          </CardTitle>
          <CardDescription>
            Tell us about your business to help identify the appropriate trademark classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessDescription">
                Describe your business, products, or services
              </Label>
              <Textarea
                id="businessDescription"
                placeholder="e.g., We develop mobile applications for fitness tracking and provide online coaching services"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="resize-none"
                className={errors.includes("Goods/Services description is required") ? "border-red-500" : ""}
              />
              {errors.includes("Goods/Services description is required") && (
                <p className="text-sm text-red-500">Goods/Services description is required</p>
              )}
              <p className="text-xs text-muted-foreground">
                Include detailed information about what you sell or provide to customers
              </p>
            </div>
            <Button onClick={handleSubmit} className="w-full sm:w-auto" disabled={errors.length > 0}>
              <Search className="h-4 w-4 mr-2" /> Analyze & Get Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions Section */}
      {formData.class && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" /> Suggested Classifications
            </CardTitle>
            <CardDescription>
              Based on your business description, we recommend these trademark classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {niceClassifications.map((cls) => (
                <div key={cls.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                      <Badge className="mb-1">Nice Class {cls.id}</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, class: cls.id })}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Use
                    </Button>
                  </div>
                  <p className="text-sm mt-2">{cls.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Goods & Services Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" /> Add Goods & Services
          </CardTitle>
          <CardDescription>
            Specify the exact goods and services for which you're seeking trademark protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="class">International Class</Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) => setFormData({ ...formData, class: value })}
                >
                  <SelectTrigger className={errors.includes("International class is required") ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select international class" />
                  </SelectTrigger>
                  <SelectContent>
                    {niceClassifications.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        Class {cls.id}: {cls.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.includes("International class is required") && (
                  <p className="text-sm text-red-500">International class is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="Enter industry"
                  className={errors.includes("Industry is required") ? "border-red-500" : ""}
                />
                {errors.includes("Industry is required") && (
                  <p className="text-sm text-red-500">Industry is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMarket">Target Market</Label>
                <Input
                  id="targetMarket"
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  placeholder="Enter target market"
                  className={errors.includes("Target market is required") ? "border-red-500" : ""}
                />
                {errors.includes("Target market is required") && (
                  <p className="text-sm text-red-500">Target market is required</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onBack} disabled>
                Back
              </Button>
              <Button type="submit" disabled={errors.length > 0}>
                Next
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Added Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Goods & Services</CardTitle>
          <CardDescription>
            Items you've added to your trademark application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formData.class && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24">Class</TableHead>
                  <TableHead className="w-16 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {niceClassifications.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="align-top">{cls.description}</TableCell>
                    <TableCell className="align-top">
                      <Badge>Class {cls.id}</Badge>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFormData({ ...formData, class: cls.id })}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrademarkGoodsServices;
