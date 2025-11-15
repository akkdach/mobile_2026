export type ImageOtherContextType = {
  allValues: any[];
  fileDataAfter: any[];
  formDataAfter: any[];
  fileDataBefore: any[];
  formDataBefore: any[];
  updateFileDataAfter: (fileData: any) => void;
  updateFormDataAfter: (formData: any) => void;
  updateFileDataBefore: (fileData: any) => void;
  updateFormDataBefore: (formData: any) => void;
  updateAllValue: (data: any) => void;
};
