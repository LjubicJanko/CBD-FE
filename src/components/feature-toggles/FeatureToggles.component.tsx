import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    FEATURE_CATALOG,
    getMissingDependencies,
} from '../../util/features';
import * as Styled from './FeatureToggles.styles';

type FeatureTogglesProps = {
    /** Currently-enabled feature keys. */
    features: string[];
    /** Called when a single feature is toggled on/off. */
    onToggle: (key: string, enabled: boolean) => void;
    disabled?: boolean;
};

/** key -> i18n label key, for rendering a dependency's name in the hint. */
const LABEL_KEY_BY_FEATURE = Object.fromEntries(
    FEATURE_CATALOG.map((entry) => [entry.key, entry.labelKey])
);

/**
 * Presentational list of premium feature/module switches, driven by
 * `FEATURE_CATALOG`. Shared by the superadmin tenant-details form
 * (`/platform/tenants/:id`) and the superadmin "Premium features" tab in
 * `/profile`, so the two stay in lockstep. Purely controlled — the caller owns
 * the `features` state and persistence.
 *
 * A feature whose prerequisites aren't enabled (see `FEATURE_DEPENDENCIES`) is
 * rendered locked, with a hint naming the modules it requires.
 */
const FeatureToggles: React.FC<FeatureTogglesProps> = ({
    features,
    onToggle,
    disabled = false,
}) => {
    const { t } = useTranslation();

    return (
        <Styled.FeatureToggles className="feature-toggles">
            {FEATURE_CATALOG.map(({ key, labelKey, descriptionKey }) => {
                const checked = features.includes(key);
                const missing = getMissingDependencies(key, features);
                const locked = !checked && missing.length > 0;
                const requiresHint =
                    missing.length > 0
                        ? t('feature-requires', {
                              features: missing
                                  .map((dep) => t(LABEL_KEY_BY_FEATURE[dep]))
                                  .join(', '),
                          })
                        : null;

                return (
                    <FormControlLabel
                        key={key}
                        className="feature-toggles__item"
                        disabled={disabled || locked}
                        control={
                            <Switch
                                checked={checked}
                                onChange={(e) =>
                                    onToggle(key, e.target.checked)
                                }
                            />
                        }
                        label={
                            <span className="feature-toggles__label">
                                <strong>{t(labelKey)}</strong>
                                <span className="feature-toggles__desc">
                                    {t(descriptionKey)}
                                </span>
                                {requiresHint && (
                                    <span className="feature-toggles__requires">
                                        {requiresHint}
                                    </span>
                                )}
                            </span>
                        }
                    />
                );
            })}
        </Styled.FeatureToggles>
    );
};

export default FeatureToggles;
