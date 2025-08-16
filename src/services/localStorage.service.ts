import { AuthData } from '../types/Auth';
import { BannerLocation } from '../types/Banner';
import { CompanyOverview } from '../types/Company';

export default {
  saveData(data: AuthData): void {
    const { token, ...rest } = data;

    localStorage.setItem('token', token);
    localStorage.setItem('authData', JSON.stringify(rest));
  },
  saveCompanies(companiesInfo: CompanyOverview[]): void {
    localStorage.setItem('companiesInfo', JSON.stringify(companiesInfo));
  },
  clearData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('authData');
    localStorage.removeItem('companiesInfo');
  },
  get token(): string | null {
    return localStorage.getItem('token');
  },
  get authData(): Omit<AuthData, 'token'> {
    const data = localStorage.getItem('authData');
    return JSON.parse(data || 'null');
  },
  get companiesInfo(): CompanyOverview[] {
    const companiesInfo = localStorage.getItem('companiesInfo');
    return JSON.parse(companiesInfo || 'null');
  },

  setBannerDismissed(page: BannerLocation, value: boolean) {
    localStorage.setItem(`bannerDismissed_${page}`, JSON.stringify(value));
  },

  getBannerDismissed(page: BannerLocation): boolean {
    return JSON.parse(
      localStorage.getItem(`bannerDismissed_${page}`) || 'false'
    );
  },
};
