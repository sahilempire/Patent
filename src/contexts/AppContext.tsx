import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FilingType = 'patent' | 'trademark' | null;

export interface IFileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
  category: string;
}

export interface AppContextType {
  filingType: FilingType;
  setFilingType: (type: FilingType) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
  uploadedFiles: IFileUpload[];
  addFile: (file: IFileUpload) => void;
  removeFile: (id: string) => void;
  complianceScore: number;
  updateComplianceScore: (score: number) => void;
  resetWizard: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filingType, setFilingType] = useState<FilingType>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({
    inventionTitle: '',
    inventorNames: '',
    inventionType: '',
    briefSummary: '',
    technicalField: '',
    backgroundArt: '',
    detailedDescription: '',
    advantageousEffects: '',
    claims: [],
    newClaim: {
      text: '',
      type: 'independent'
    },
    claimSuggestions: null,
    priorArtReferences: [],
    newReference: '',
    newType: '',
    newRelevance: '',
    searchKeywords: '',
    searchResults: null
  });
  const [uploadedFiles, setUploadedFiles] = useState<IFileUpload[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);

  const updateFormData = (data: Record<string, any>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const addFile = (file: IFileUpload) => {
    setUploadedFiles((prev) => [...prev, file]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const updateComplianceScore = (score: number) => {
    setComplianceScore(score);
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setFormData({
      inventionTitle: '',
      inventorNames: '',
      inventionType: '',
      briefSummary: '',
      technicalField: '',
      backgroundArt: '',
      detailedDescription: '',
      advantageousEffects: '',
      claims: [],
      newClaim: {
        text: '',
        type: 'independent'
      },
      claimSuggestions: null,
      priorArtReferences: [],
      newReference: '',
      newType: '',
      newRelevance: '',
      searchKeywords: '',
      searchResults: null
    });
    setUploadedFiles([]);
    setComplianceScore(0);
  };

  return (
    <AppContext.Provider
      value={{
        filingType,
        setFilingType,
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        uploadedFiles,
        addFile,
        removeFile,
        complianceScore,
        updateComplianceScore,
        resetWizard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
