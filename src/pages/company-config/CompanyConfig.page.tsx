import { useCallback, useContext } from 'react';
import * as Styled from './CompanyConfig.styles';
import CompanyContext from '../../store/CompanyProvider/Company.context';
import useQueryParams from '../../hooks/useQueryParams';
import SideMenu from '../../components/side-menu/SideMenu.component';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CompanyInfo from '../../components/company-info/CompanyInfo.component';

const menuItems = [
  { key: 'INFORMATION', label: 'Informacije' },
  { key: 'PRICE_LIST', label: 'Price List' },
  { key: 'size-table', label: 'Size Table' },
  { key: 'GEAR_CATEGORY', label: 'Equipment category' },
  { key: 'GEAR_TYPE', label: 'Equipment Type' },
  { key: 'TEMPLATES', label: 'TEMPLATES' },
];

const CompanyConfigPage = () => {
  const { t } = useTranslation();
  const { company } = useContext(CompanyContext);
  const { params, setQParam } = useQueryParams();
  const navigate = useNavigate();

  const activeTab = params['tab'] || 'info';

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'INFORMATION':
        return <CompanyInfo />;
      case 'PRICE_LIST':
        return <div>Price list for {company?.name}</div>;
      case 'size-table':
        return <div>Size table for {company?.name}</div>;
      case 'GEAR_CATEGORY':
        return <div>Equipment categories for {company?.name}</div>;
      case 'GEAR_TYPE':
        return <div>Equipment types for {company?.name}</div>;
      case 'TEMPLATES':
        return <div>TEMPLATES for {company?.name}</div>;
      default:
        return <div>General info about {company?.name}</div>;
    }
  }, [activeTab, company?.name]);

  return (
    <Styled.CompanyConfigContainer className="company-info">
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
    </Styled.CompanyConfigContainer>
  );
};

export default CompanyConfigPage;
