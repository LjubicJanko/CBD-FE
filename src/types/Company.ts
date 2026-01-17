export type CompanyOverview = {
  id: number;
  name: string;
};

export type Company = {
  id: number;
  name: string;
  currency?: string;
  vat?: string;
  logo?: string;
  colors?: string[];
  websiteUrl?: string;
};
