import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from './ColorPreviewCard.styles';

/**
 * Static sample card shown next to the brand-color pickers in
 * `TenantDetailsForm`. Reads the theme tokens directly (`theme.PRIMARY_1`,
 * `SECONDARY_1/2/3`, `PRIMARY_2`) rather than formik values, so it needs no
 * props: those tokens are CSS vars that `TenantDetailsForm`'s live-preview
 * effect already pushes onto `document.documentElement` while editing (see
 * `applyTenantTheme`), so this card re-colors itself for free, in sync with
 * every other themed element on the page.
 */
const ColorPreviewCard: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Styled.ColorPreviewCard>
            <span className="tenant-form__section-label">
                {t('tenantDetails.colorsPreviewLabel')}
            </span>
            <div className="color-preview__card">
                <span className="color-preview__heading">
                    {t('tenantDetails.colorsPreviewHeading')}
                </span>
                <span className="color-preview__muted">
                    {t('tenantDetails.colorsPreviewMuted')}
                </span>
                <span className="color-preview__subtle">
                    {t('tenantDetails.colorsPreviewSubtle')}
                </span>
                {/* Decorative only, a live color swatch, not a real action.
                    tabIndex/aria-hidden keep it out of keyboard/AT focus so
                    it doesn't read as a dead, unresponsive button. */}
                <button
                    type="button"
                    className="color-preview__button"
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    {t('tenantDetails.colorsPreviewButton')}
                </button>
            </div>
        </Styled.ColorPreviewCard>
    );
};

export default ColorPreviewCard;
