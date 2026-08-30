export type Role = 'company_admin' | 'manager' | 'manufacturer' | 'consumer';

export type AuthData = {
  id: number;
  name: string;
  username: string;
  token: string;
  roles: Role[];
  privileges: string[];
  features: string[];
  tenantId: number | null;
  tenantSlug: string | null;
  tenantLogoUrl: string | null;
  // Active tenant's brand colors (null when unset or for a superadmin, who has
  // no tenant). Applied at runtime only when `features` includes 'theming'.
  tenantAccentColor: string | null;
  tenantBackgroundColor: string | null;
  tenantTextColor: string | null;
  tenantMutedTextColor: string | null;
  tenantSubtleTextColor: string | null;
  superadmin: boolean;
};

export type LoginData = {
  username: string;
  password: string;
};

export type RegisterData = LoginData & {
  fullName: string;
  role: string;
};

export type ChangePasswordData = {
  username: string;
  oldPassword: string;
  newPassword: string;
};

export type User = {
  fullName: string;
  username: string;
  createdAt: string;
  roles: {
    name: string;
  }[];
};
