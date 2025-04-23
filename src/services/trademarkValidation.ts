interface BasicInfo {
  applicantName: string;
  trademark: string;
  filingBasis: string;
}

interface GoodsServices {
  description: string;
  class: string;
  industry: string;
  targetMarket: string;
}

interface UsageEvidence {
  firstUseDate: string;
  currentUseStatus: string;
  specimenDescription: string;
  specimenType: string;
}

interface TrademarkData {
  basicInfo: BasicInfo;
  goodsServices: GoodsServices;
  usage: UsageEvidence;
}

export const validateBasicInfo = (data: BasicInfo): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.applicantName?.trim()) {
    errors.push("Applicant name is required");
  }
  if (!data.trademark?.trim()) {
    errors.push("Trademark is required");
  }
  if (!data.filingBasis?.trim()) {
    errors.push("Filing basis is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateGoodsServices = (data: GoodsServices): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.description?.trim()) {
    errors.push("Goods/Services description is required");
  }
  if (!data.class?.trim()) {
    errors.push("International class is required");
  }
  if (!data.industry?.trim()) {
    errors.push("Industry is required");
  }
  if (!data.targetMarket?.trim()) {
    errors.push("Target market is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUsageEvidence = (data: UsageEvidence): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.firstUseDate?.trim()) {
    errors.push("Date of first use is required");
  }
  if (!data.currentUseStatus?.trim()) {
    errors.push("Current use status is required");
  }
  if (!data.specimenDescription?.trim()) {
    errors.push("Specimen description is required");
  }
  if (!data.specimenType?.trim()) {
    errors.push("Specimen type is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateTrademarkData = (data: TrademarkData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate Basic Info
  const basicInfoValidation = validateBasicInfo(data.basicInfo);
  if (!basicInfoValidation.isValid) {
    errors.push(...basicInfoValidation.errors);
  }

  // Validate Goods and Services
  const goodsServicesValidation = validateGoodsServices(data.goodsServices);
  if (!goodsServicesValidation.isValid) {
    errors.push(...goodsServicesValidation.errors);
  }

  // Validate Usage
  const usageValidation = validateUsageEvidence(data.usage);
  if (!usageValidation.isValid) {
    errors.push(...usageValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// This function should be called with the actual data from your state management
export const getTrademarkData = (data: TrademarkData): TrademarkData => {
  return data;
}; 