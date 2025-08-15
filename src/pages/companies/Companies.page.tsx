import { useCallback, useContext, useEffect, useState } from 'react';
import * as Styled from './Companies.styles';
import AuthContext from '../../store/AuthProvider/Auth.context';
import companyService from '../../api/services/companies';
import { CompanyOverview } from '../../types/Company';
import { useNavigate } from 'react-router-dom';
import localStorageService from '../../services/localStorage.service';

const CompaniesPage = () => {
  const { setCompaniesInfo, authData, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyOverview[]>([]);

  const goToCompany = useCallback(
    (id: number) => {
      navigate(`/company/${id}/orders`);
    },
    [navigate]
  );

  const fetchAllCompanies = useCallback(async () => {
    const _companies = await companyService.getAll();
    setCompanies(_companies);
    setCompaniesInfo(_companies);
    localStorageService.saveCompanies(_companies);
  }, [setCompaniesInfo]);

  const fetchCompanies = useCallback(async () => {
    const ids = authData?.companyIds ?? [];
    if (!ids) return;

    const _companies = await companyService.getCompanies(ids);
    setCompanies(_companies);
    setCompaniesInfo(_companies);
    localStorageService.saveCompanies(_companies);
  }, [authData?.companyIds, setCompaniesInfo]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAllCompanies();
      return;
    }
    const numOfCompanies = authData?.companyIds?.length ?? 0;
    if (numOfCompanies > 1) {
      fetchCompanies();
      return;
    }

    // todo: if there is no id, go to some error page
    goToCompany(authData?.companyIds?.[0] ?? 0);
  }, [
    isSuperAdmin,
    authData?.companyIds,
    fetchAllCompanies,
    fetchCompanies,
    goToCompany,
  ]);

  return (
    <Styled.CompaniesPageContainer className="companies-overview">
      {companies.map((company) => (
        <div className="companies-overview__company">
          {/* <p className="companies-overview__company--id">{company.id}</p> */}
          <p
            className="companies-overview__company--name"
            onClick={() => goToCompany(company?.id ?? 0)}
          >
            {company.name}
          </p>
        </div>
      ))}
    </Styled.CompaniesPageContainer>
  );
};

export default CompaniesPage;
