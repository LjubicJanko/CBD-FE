import { useContext, useMemo, useSyncExternalStore } from 'react';
import AuthContext from '../store/AuthProvider/Auth.context';
import { selectedTenantFeaturesStore } from '../services/selectedTenantFeatures.store';
import { Feature } from '../util/features';

/**
 * Resolves the ACTIVE tenant's enabled feature keys.
 *
 * - Regular user: from `authData.features` (reactive via context).
 * - Superadmin: from the selected (impersonated) tenant's features, subscribed
 *   reactively through `selectedTenantFeaturesStore`. A superadmin has no tenant
 *   of their own, so this comes from the localStorage selection, but it updates
 *   live, so toggling a feature in /profile re-renders the menu, route guards and
 *   privilege-derived UI without a manual refresh.
 */
export const useFeatures = (): string[] => {
  const { authData } = useContext(AuthContext);
  const selectedTenantFeatures = useSyncExternalStore(
    selectedTenantFeaturesStore.subscribe,
    selectedTenantFeaturesStore.getSnapshot
  );

  return useMemo(() => {
    if (authData?.superadmin) {
      return selectedTenantFeatures;
    }
    return authData?.features ?? [];
  }, [authData?.superadmin, authData?.features, selectedTenantFeatures]);
};

export const useHasFeature = (feature: Feature): boolean => {
  const features = useFeatures();
  return useMemo(() => features.includes(feature), [features, feature]);
};
