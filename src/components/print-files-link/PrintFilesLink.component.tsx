import { useTranslation } from 'react-i18next';
import { isSafeHttpsHref } from '../../util/util';
import * as Styled from './PrintFilesLink.styles';

export type PrintFilesLinkProps = {
  url?: string | null;
};

// Renders nothing unless the stored value is a safe https URL. The raw URL is
// never printed, only the localized link text.
const PrintFilesLink = ({ url }: PrintFilesLinkProps) => {
  const { t } = useTranslation();

  if (!isSafeHttpsHref(url)) return null;

  return (
    <Styled.PrintFilesAnchor
      className="print-files-link"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {t('open-print-files')}
    </Styled.PrintFilesAnchor>
  );
};

export default PrintFilesLink;
