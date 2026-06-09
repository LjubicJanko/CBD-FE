import { Navigate, Outlet } from 'react-router-dom';
import { useFeatures } from '../../hooks/useFeatures';
import { Feature, firstEnabledModuleRoute } from '../../util/features';

export type FeatureRouteProps = {
  requiredFeature: Feature;
};

/**
 * Per-tenant feature guard (the `ProtectedRoute` analogue for the tenant-level
 * capability layer). Reads the active tenant's features SYNCHRONOUSLY via
 * `useFeatures` (auth payload for regular users, cached selected-tenant features
 * for superadmins) and, when the feature is off, redirects to the tenant's first
 * enabled module instead of hard-coding `/dashboard` (which itself may be gated
 * off when `orders` is disabled).
 *
 * Compose OUTSIDE the privilege `ProtectedRoute`: feature gate first, then the
 * per-user privilege gate.
 */
const FeatureRoute = ({ requiredFeature }: FeatureRouteProps) => {
  const features = useFeatures();
  const hasFeature = features.includes(requiredFeature);

  return hasFeature ? (
    <Outlet />
  ) : (
    <Navigate to={firstEnabledModuleRoute(features)} replace />
  );
};

export default FeatureRoute;
