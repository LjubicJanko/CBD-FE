import { useState, useRef, useEffect, useCallback } from 'react';

interface UseImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  acceptedTypes?: string[];
}

export const useImageUpload = ({
  value,
  onChange,
  acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg'],
}: UseImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && !fileName) {
      // Extract filename from data URL if possible, or use default
      const match = value.match(/data:image\/(png|jpg|jpeg);/);
      if (match) {
        const extension = match[1];
        setFileName(`banner-image.${extension}`);
      } else {
        setFileName('banner-image.png');
      }
    }
  }, [value, fileName]);

  const convertToBase64 = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (file && acceptedTypes.includes(file.type)) {
        convertToBase64(file);
      }
    },
    [acceptedTypes, convertToBase64]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleClick = useCallback(() => {
    if (!value) {
      fileInputRef.current?.click();
    }
  }, [value]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange('');
      setFileName('');
    },
    [onChange]
  );

  return {
    isDragging,
    fileName,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleClick,
    handleDelete,
  };
};
