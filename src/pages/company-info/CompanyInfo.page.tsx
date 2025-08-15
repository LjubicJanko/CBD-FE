import { useCallback, useContext } from 'react';
import * as Styled from './CompanyInfo.styles';
import CompanyContext from '../../store/CompanyProvider/Company.context';
import useQueryParams from '../../hooks/useQueryParams';
import SideMenu from '../../components/side-menu/SideMenu.component';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const menuItems = [
  { key: 'info', label: 'Info' },
  { key: 'price-list', label: 'Price List' },
  { key: 'size-table', label: 'Size Table' },
  { key: 'equipment-type', label: 'Equipment Type' },
  { key: 'templates', label: 'Templates' },
];

const CompanyInfoPage = () => {
  const { t } = useTranslation();
  const { company } = useContext(CompanyContext);
  const { params, setQParam } = useQueryParams();
  const navigate = useNavigate();

  const activeTab = params['tab'] || 'info';

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'price-list':
        return <div>Price list for {company?.name}</div>;
      case 'size-table':
        return <div>Size table for {company?.name}</div>;
      case 'equipment-type':
        return <div>Equipment types for {company?.name}</div>;
      case 'templates':
        return <div>Templates for {company?.name}</div>;
      default:
        return <div>General info about {company?.name}</div>;
    }
  }, [activeTab, company?.name]);
  return (
    <Styled.CompanyInfoContainer className="company-info">
      <div className="company-info__heading">
        <IconButton
          className="company-info__heading__back-btn"
          onClick={() => navigate('../orders')}
          edge="end"
        >
          <ChevronLeftIcon />
        </IconButton>
        <h1 className="company-info__heading__title">
          {t('Podesavanje kompanije')}
        </h1>
      </div>
      <div className="company-info">
        <SideMenu
          items={menuItems}
          activeKey={activeTab}
          onSelect={(key) => setQParam('tab', key)}
        />

        <div className="company-info__content-column">{renderContent()}</div>
      </div>
    </Styled.CompanyInfoContainer>
  );
};

export default CompanyInfoPage;
