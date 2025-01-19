import { IconButton, Tooltip } from '@mui/material';
import * as Styled from './ShippedTooltip.styles';
import { OrderStatusHistory } from '../../../../types/Order';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCallback } from 'react';
import { useSnackbar } from '../../../../hooks/useSnackbar';

export type ShippedInfoTooltipProps = {
  row: OrderStatusHistory;
};

export const ShippedInfoTooltip = ({ row }: ShippedInfoTooltipProps) => {
  const { t } = useTranslation();

  const { showSnackbar } = useSnackbar();

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(row?.postalCode ?? '');
    showSnackbar(t('postal-code-coppied'), 'success');
  }, [row?.postalCode, showSnackbar, t]);

  return (
    <Tooltip
      title={
        <Styled.TooltipContent>
          <p>
            {t(`${row?.postalService}`)}: {row?.postalCode}
          </p>
          <IconButton onClick={copyCode} edge="end">
            <ContentCopyIcon />
          </IconButton>
        </Styled.TooltipContent>
      }
      arrow
    >
      <InfoIcon color="info" />
    </Tooltip>
  );
};
