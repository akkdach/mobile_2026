import * as React from 'react';
import { ImageOtherContextType } from '../models/image-other';

export const ImageOtherContext =
  React.createContext<ImageOtherContextType | null>(null);

const ImageOtherProvider = ({ children }: React.PropsWithChildren) => {
  const [allValues, setAllValues] = React.useState([] as any);
  const [fileDataAfter, setFileDataAfter] = React.useState([] as any);
  const [formDataAfter, setFormDataAfter] = React.useState([] as any);
  const [fileDataBefore, setFileDataBefore] = React.useState([] as any);
  const [formDataBefore, setFormDataBefore] = React.useState([] as any);

  const updateFileDataAfter = (fileData: any) => {
    setFileDataAfter(fileData);
  };

  const updateFormDataAfter = (formData: any) => {
    setFormDataAfter(formData);
  };

  const updateFileDataBefore = (fileData: any) => {
    setFileDataBefore(fileData);
  };

  const updateFormDataBefore = (formData: any) => {
    setFormDataBefore(formData);
  };

  const updateAllValue: any = {};

  return (
    <ImageOtherContext.Provider
      value={{
        allValues,
        fileDataAfter,
        fileDataBefore,
        formDataAfter,
        formDataBefore,
        updateAllValue,
        updateFileDataAfter,
        updateFormDataAfter,
        updateFileDataBefore,
        updateFormDataBefore,
      }}
    >
      {children}
    </ImageOtherContext.Provider>
  );
};

export default ImageOtherProvider;
