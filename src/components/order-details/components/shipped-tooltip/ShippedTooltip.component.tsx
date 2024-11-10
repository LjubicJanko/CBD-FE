import { IconButton, Tooltip } from '@mui/material';
import * as Styled from './ShippedTooltip.styles';
import { OrderStatusHistory } from '../../../../types/Order';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export type ShippedInfoTooltipProps = {
  row: OrderStatusHistory;
};

export const ShippedInfoTooltip = ({ row }: ShippedInfoTooltipProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      title={
        <Styled.TooltipContent>
          <Styled.TooltipRow>
            <p style={{ fontWeight: 'bold' }}>{t('postal-service')}:</p>
            <p>{row?.postalService}</p>
          </Styled.TooltipRow>
          <Styled.TooltipRow>
            <p style={{ fontWeight: 'bold' }}>{t('postal-code')}:</p>
            <p>{row?.postalCode}</p>
            <IconButton
              onClick={() =>
                navigator.clipboard.writeText(row?.postalCode ?? '')
              }
              edge="end"
            >
              <ContentCopyIcon />
            </IconButton>
          </Styled.TooltipRow>
        </Styled.TooltipContent>
      }
      arrow
    >
      <InfoIcon color="info" />
    </Tooltip>
  );
};
