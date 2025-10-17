import { Table, TableBody, TableRow } from '@mui/material';
import useResponsiveWidth from '../../../../hooks/useResponsiveWidth';
import { ContactInfoData } from '../../../../types/Order';
import { xxsMax } from '../../../../util/breakpoints';
import * as Styled from './ContactInfo.styles';
import { useTranslation } from 'react-i18next';
import { ReactNode, useMemo } from 'react';

export type ContactInfoProps = {
  contactInfo?: ContactInfoData;
};

type ContactInfoConfigType = {
  label: string;
  value: string | ReactNode | undefined;
};

const ContactInfo = ({ contactInfo }: ContactInfoProps) => {
  const { t } = useTranslation();
  const width = useResponsiveWidth();
  const { address, city, fullName, phoneNumber, zipCode } = contactInfo ?? {};
  const isMobile = width < xxsMax;

  const contactInfoConfig: ContactInfoConfigType[] = useMemo(
    () =>
      [
        { label: t('full-name'), value: fullName },
        { label: t('contact.phone'), value: phoneNumber },
        { label: t('contact.address'), value: address },
        { label: t('contact.city'), value: city },
        {
          label: t('contact.postalCode'),
          value: zipCode,
        },
      ].filter(Boolean) as ContactInfoConfigType[],
    [address, city, fullName, phoneNumber, t, zipCode]
  );

  return isMobile ? (
    <Styled.MobileContainer>
      {contactInfoConfig
        .filter((x) => x.value !== null)
        .map((info, index) => (
          <div
            key={index}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <strong>{info.label}</strong>
            <span>{info.value}</span>
          </div>
        ))}
    </Styled.MobileContainer>
  ) : (
    <Styled.DesktopContainer>
      <Table className="order-info-table" aria-label="order info overview">
        <TableBody>
          {contactInfoConfig
            .filter((x) => x.value !== null)
            .map((info, index) => (
              <TableRow key={index}>
                <Styled.TableCellContainer
                  component="th"
                  scope="row"
                  style={{ fontWeight: 'bold' }}
                >
                  {info.label}
                </Styled.TableCellContainer>
                <Styled.TableCellContainer className="value">
                  {info.value}
                </Styled.TableCellContainer>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Styled.DesktopContainer>
  );
};

export default ContactInfo;
