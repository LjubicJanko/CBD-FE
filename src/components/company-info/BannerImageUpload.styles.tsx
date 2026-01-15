import styled from 'styled-components';

export const BannerImageUploadContainer = styled.div`
  .banner-image-upload {
    &__wrapper {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    &__drop-zone {
      flex: 1;
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      background-color: #fafafa;
      transition: all 0.3s ease;
      margin-top: 8px;

      &:hover {
        border-color: #1976d2;
        background-color: #f0f7ff;
      }

      &--dragging {
        border-color: #1976d2;
        background-color: #f0f7ff;
      }
    }

    &__input {
      display: none;
    }

    &__file-name {
      margin: 0 0 12px 0;
      color: #1976d2;
      font-weight: 500;
    }

    &__delete-button {
      margin-top: 8px;
    }

    &__sub-text {
      margin: 8px 0 0 0;
      font-size: 12px;
      color: #666;
    }

    &__placeholder-text {
      margin: 0;
      color: #666;
    }

    &__hint-text {
      margin: 8px 0 0 0;
      font-size: 12px;
      color: #999;
    }

    &__preview {
      flex: 0 0 300px;
      margin-top: 8px;
    }

    &__preview-label {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    &__preview-image {
      width: 100%;
      height: auto;
      border-radius: 8px;
      border: 1px solid #ddd;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
`;
