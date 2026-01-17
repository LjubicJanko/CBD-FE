import { useCallback, useContext, useEffect } from 'react';
import * as Styled from './Companies.styles';
import AuthContext from '../../store/AuthProvider/Auth.context';
import companyService from '../../api/services/companies';
import { CompanyOverview } from '../../types/Company';
import { useNavigate } from 'react-router-dom';
import localStorageService from '../../services/localStorage.service';
import { useTranslation } from 'react-i18next';

const CompaniesPage = () => {
  const { companiesInfo, setCompaniesInfo, authData, isSuperAdmin } =
    useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToCompany = useCallback(
    (id: number) => {
      navigate(`/company/${id}/orders`);
    },
    [navigate]
  );

  const saveCompanies = useCallback(
    (_companies: CompanyOverview[]) => {
      setCompaniesInfo(_companies);
      localStorageService.saveCompanies(_companies);
    },
    [setCompaniesInfo]
  );

  const fetchAllCompanies = useCallback(async () => {
    const _companies = await companyService.getAll();
    saveCompanies(_companies);
  }, [saveCompanies]);

  const fetchCompanies = useCallback(async () => {
    const ids = authData?.companyIds ?? [];
    if (!ids) return;

    const _companies = await companyService.getCompanies(ids);
    saveCompanies(_companies);
  }, [authData?.companyIds, saveCompanies]);

  const fetchCompany = useCallback(
    async (companyId: number) => {
      if (!companyId) return;

      const _company = await companyService.getCompany(companyId);
      saveCompanies([_company]);
      goToCompany(companyId);
    },
    [goToCompany, saveCompanies]
  );

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
    fetchCompany(authData?.companyIds?.[0] ?? 0);
  }, [
    isSuperAdmin,
    authData?.companyIds,
    fetchAllCompanies,
    fetchCompanies,
    goToCompany,
    fetchCompany,
  ]);

  return (
    <Styled.CompaniesPageContainer className="companies-overview">
      <h1>{t('Izaberi kompaniju')}</h1>
      <div className="companies-overview__list">
        {companiesInfo?.map((company) => (
          <div
            className="companies-overview__list__company"
            onClick={() => goToCompany(company?.id ?? 0)}
            key={`company-${company.id}`}
          >
            <p className="companies-overview__list__company--name">{company.name}</p>
          </div>
        ))}
      </div>
    </Styled.CompaniesPageContainer>
  );
};

export default CompaniesPage;
