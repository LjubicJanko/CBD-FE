import { Outlet } from 'react-router-dom';
import * as Styled from './Company.styles';

const CompanyPage = () => {
  return (
    <Styled.CompanyPageContainer>
      <Outlet />
    </Styled.CompanyPageContainer>
  );
};

export default CompanyPage;
