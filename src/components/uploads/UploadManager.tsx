
import React, { useState, useRef } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, File, Check, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { IFileUpload } from '@/contexts/AppContext';

const UploadManager: React.FC = () => {
  const { filingType, uploadedFiles, addFile, removeFile, complianceScore, updateComplianceScore } = useAppContext();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const patentCategories = [
    { value: 'drawings', label: 'Technical Drawings' },
    { value: 'priorArt', label: 'Prior Art References' },
    { value: 'assignmentDocs', label: 'Assignment Documents' },
    { value: 'inventor', label: 'Inventor Declarations' },
  ];

  const trademarkCategories = [
    { value: 'logo', label: 'Logo/Mark Image' },
    { value: 'specimens', label: 'Specimens of Use' },
    { value: 'consent', label: 'Consent Documents' },
    { value: 'foreignReg', label: 'Foreign Registration' },
  ];

  const categories = filingType === 'patent' ? patentCategories : trademarkCategories;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Category required",
        description: "Please select a document category before uploading",
        variant: "destructive",
      });
      return;
    }

    // Convert FileList to Array and process each file
    Array.from(files).forEach(file => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB size limit`,
          variant: "destructive",
        });
        return;
      }

      // Check file type
      const acceptedTypes = [
        'application/pdf', 
        'image/jpeg', 
        'image/png', 
        'image/tiff',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!acceptedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        });
        return;
      }

      // Create a new file upload object
      const newFile: IFileUpload = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
        category: selectedCategory,
      };

      // Add file to context
      addFile(newFile);

      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Update compliance score - FIX: Pass a direct number instead of a function
    const newScore = Math.min(complianceScore + 10, 100);
    updateComplianceScore(newScore);
  };

  const handleDeleteFile = (id: string) => {
    removeFile(id);
    
    toast({
      title: "File removed",
      description: "The file has been removed successfully",
    });

    // Update compliance score - FIX: Pass a direct number instead of a function
    const newScore = Math.max(complianceScore - 5, 0);
    updateComplianceScore(newScore);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getRequiredDocuments = () => {
    if (filingType === 'patent') {
      return [
        'Technical drawings showing the invention',
        'Information about any known prior art',
        'Properly signed inventor declarations',
      ];
    } else {
      return [
        'Clear image of the trademark/logo',
        'Specimens showing the mark in use in commerce',
        'Signed declaration of use or intent to use',
      ];
    }
  };

  const getMissingDocumentTypes = () => {
    const requiredTypes = filingType === 'patent' 
      ? ['drawings', 'priorArt', 'inventor']
      : ['logo', 'specimens', 'consent'];
    
    const uploadedTypes = uploadedFiles.map(file => file.category);
    return requiredTypes.filter(type => !uploadedTypes.includes(type));
  };

  const missingTypes = getMissingDocumentTypes();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Manager</h1>
        <p className="text-muted-foreground">
          Upload and manage supporting documents for your {filingType} application
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Upload Documents</CardTitle>
              <CardDescription>
                Select a category and upload supporting files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="mb-2 text-sm text-center text-muted-foreground">
                    Drag and drop files here, or click to select files
                  </p>
                  <p className="mb-4 text-xs text-center text-muted-foreground">
                    Supported formats: PDF, DOCX, JPEG, PNG, TIFF (Max 10MB)
                  </p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept=".pdf,.docx,.doc,.jpeg,.jpg,.png,.tiff"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Select Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Uploaded Files</CardTitle>
                <CardDescription>
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium flex items-center">
                          <File className="h-4 w-4 mr-2" />
                          <span className="truncate max-w-[200px]">{file.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {categories.find(c => c.value === file.category)?.label || file.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="mb-8 sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">Required Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {getRequiredDocuments().map((doc, index) => {
                  const isUploaded = !missingTypes.includes(
                    filingType === 'patent' 
                      ? ['drawings', 'priorArt', 'inventor'][index]
                      : ['logo', 'specimens', 'consent'][index]
                  );
                  
                  return (
                    <li key={index} className="flex items-start gap-2">
                      {isUploaded ? (
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      )}
                      <span className={isUploaded ? "text-muted-foreground line-through" : ""}>
                        {doc}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {missingTypes.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing Required Documents</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 text-sm mt-2">
                  {missingTypes.map((type, index) => (
                    <li key={index}>
                      {categories.find(c => c.value === type)?.label || type}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadManager;
