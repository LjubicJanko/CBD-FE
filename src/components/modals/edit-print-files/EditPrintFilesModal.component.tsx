import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { orderService } from '../../../api';
import { useSnackbar } from '../../../hooks/useSnackbar';
import OrdersContext from '../../../store/OrdersProvider/Orders.context';
import { OrderMutationResponse } from '../../../types/Order';
import { isValidPrintFilesUrl } from '../../../util/util';
import ConfirmModal from '../confirm-modal/ConfirmModal.component';
import * as Styled from './EditPrintFilesModal.styles';

export type EditPrintFilesModalProps = {
  orderId: number;
  currentUrl?: string | null;
  isOpen?: boolean;
  onClose: () => void;
};

type EditPrintFilesValues = { printFilesUrl: string };

const EditPrintFilesModal = ({
  orderId,
  currentUrl,
  isOpen = false,
  onClose,
}: EditPrintFilesModalProps) => {
  const { t } = useTranslation();
  const { applyOrderResponse } = useContext(OrdersContext);
  const { showSnackbar } = useSnackbar();
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const hasLink = !!currentUrl;

  const save = useCallback(
    async (url: string | null) => {
      try {
        const response: OrderMutationResponse =
          await orderService.editPrintFilesUrl(orderId, url);
        applyOrderResponse(response);
        showSnackbar(t('print-files-updated'), 'success');
        onClose();
      } catch (error) {
        console.error(error);
        showSnackbar(t('print-files-update-failed'), 'error');
      }
    },
    [applyOrderResponse, onClose, orderId, showSnackbar, t]
  );

  const onSubmit = useCallback(
    async ({ printFilesUrl }: EditPrintFilesValues) => {
      const trimmed = printFilesUrl.trim();
      // Blank with no existing link is a no-op: nothing to send.
      if (trimmed === '' && !hasLink) {
        onClose();
        return;
      }
      await save(trimmed === '' ? null : trimmed);
    },
    [hasLink, onClose, save]
  );

  const validationSchema = Yup.object({
    printFilesUrl: Yup.string().test(
      'print-files-url',
      t('validation.invalid.print-files-url'),
      (value) => {
        const trimmed = (value ?? '').trim();
        return trimmed === '' || isValidPrintFilesUrl(trimmed);
      }
    ),
  });

  const formik = useFormik<EditPrintFilesValues>({
    initialValues: { printFilesUrl: currentUrl ?? '' },
    validationSchema,
    onSubmit,
  });

  const handleCancel = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <>
      <Styled.EditPrintFilesModalContainer
        title={t(hasLink ? 'edit-print-files-link' : 'add-print-files-link')}
        className="edit-print-files-modal"
        isOpen={isOpen}
        onClose={handleCancel}
      >
        <form onSubmit={formik.handleSubmit}>
          <TextField
            className="print-files-input"
            label={t('print-files-url')}
            name="printFilesUrl"
            type="text"
            value={formik.values.printFilesUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.printFilesUrl}
            helperText={formik.errors.printFilesUrl}
            inputProps={{
              'aria-describedby': formik.errors.printFilesUrl
                ? 'edit-print-files-input-error'
                : undefined,
            }}
            FormHelperTextProps={{
              id: 'edit-print-files-input-error',
            }}
          />
          <div className="actions">
            {hasLink && (
              <Button
                className="actions__clear"
                onClick={() => setIsClearConfirmOpen(true)}
              >
                {t('clear-print-files-link')}
              </Button>
            )}
            <Button className="actions__cancel" onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <Button
              variant="contained"
              type="submit"
              className="actions__save"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {t('save')}
            </Button>
          </div>
        </form>
      </Styled.EditPrintFilesModalContainer>
      <ConfirmModal
        text={t('clear-print-files-confirm')}
        isOpen={isClearConfirmOpen}
        hideNote
        onCancel={() => setIsClearConfirmOpen(false)}
        onConfirm={async () => {
          await save(null);
          setIsClearConfirmOpen(false);
        }}
      />
    </>
  );
};

export default EditPrintFilesModal;
