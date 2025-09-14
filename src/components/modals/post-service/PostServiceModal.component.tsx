import { useTranslation } from 'react-i18next';
import * as Styled from './PostServiceModal.styles';
import { PostServiceReqDto } from '../../../types/PostService';
import { useCallback, useMemo, useState } from 'react';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, InputLabel, TextField } from '@mui/material';

export type PostServiceModalProps = {
  isOpen: boolean;
  postServiceProp?: PostServiceReqDto;
  onSubmit: (postService: PostServiceReqDto) => void;
  onCancel: () => void;
};

const PostServiceModal = ({
  postServiceProp = { name: '', websiteUrl: '' },
  isOpen,
  onCancel,
  onSubmit,
}: PostServiceModalProps) => {
  const { t } = useTranslation();
  const [postService, setPostService] =
    useState<PostServiceReqDto>(postServiceProp);

  const isSubmitDisabled = useMemo(
    () => Object.values(postService).some((x) => !x),
    [postService]
  );

  const handleSubmit = useCallback(() => {
    onSubmit(postService);
  }, [onSubmit, postService]);

  return (
    <Styled.PostServiceModalContainer
      className="postService-modal"
      isOpen={isOpen}
      title={`${postServiceProp?.id ? 'Edit' : 'Create'} post service`}
      onClose={onCancel}
    >
      <div className="postService-modal__fields">
        <div className="postService-modal__fields__name">
          <InputLabel>{t('Naziv')}</InputLabel>
          <TextField
            value={postService.name}
            onChange={(e) =>
              setPostService((old) => ({ ...old, name: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
        </div>
        <div className="postService-modal__fields__website">
          <InputLabel>{t('Website')}</InputLabel>
          <TextField
            fullWidth
            margin="normal"
            name="websiteUrl"
            value={postService.websiteUrl}
            onChange={(e) =>
              setPostService((old) => ({ ...old, websiteUrl: e.target.value }))
            }
          />
        </div>
        <Button
          variant="contained"
          onClick={handleSubmit}
          className="postService-modal__fields__confirm"
          disabled={isSubmitDisabled}
          endIcon={<SaveOutlinedIcon />}
        >
          {t('confirm')}
        </Button>
      </div>
    </Styled.PostServiceModalContainer>
  );
};

export default PostServiceModal;
