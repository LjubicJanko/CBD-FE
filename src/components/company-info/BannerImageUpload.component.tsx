import { InputLabel, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Styled from './BannerImageUpload.styles';
import { useImageUpload } from './useImageUpload.hook';

interface BannerImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
}

const BannerImageUpload = ({ value, onChange }: BannerImageUploadProps) => {
  const { t } = useTranslation();
  const {
    isDragging,
    fileName,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleClick,
    handleDelete,
  } = useImageUpload({ value, onChange });

  return (
    <Styled.BannerImageUploadContainer className="company-info-form__banner-image">
      <InputLabel>{t('Banner Image')}</InputLabel>
      <div className="banner-image-upload__wrapper">
        <div
          className={`banner-image-upload__drop-zone ${isDragging ? 'banner-image-upload__drop-zone--dragging' : ''}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileInputChange}
            className="banner-image-upload__input"
          />
          {value ? (
            <div>
              <p className="banner-image-upload__file-name">{fileName || 'Image uploaded'}</p>
              <IconButton
                onClick={handleDelete}
                color="error"
                className="banner-image-upload__delete-button"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ) : (
            <div>
              <p className="banner-image-upload__placeholder-text">
                Drag and drop an image here, or click to browse
              </p>
              <p className="banner-image-upload__hint-text">Accepts PNG and JPG files</p>
            </div>
          )}
        </div>
        {value && (
          <div className="banner-image-upload__preview">
            <p className="banner-image-upload__preview-label">Preview:</p>
            <img src={value} alt="Banner preview" className="banner-image-upload__preview-image" />
          </div>
        )}
      </div>
    </Styled.BannerImageUploadContainer>
  );
};

export default BannerImageUpload;
