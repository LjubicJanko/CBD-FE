import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { SocialLink } from '../../api/services/platform';
import * as Styled from './SocialLinkButton.styles';

export type SocialLinkButtonProps = {
    socialLink: SocialLink;
    className?: string;
};

const ICONS = {
    INSTAGRAM: InstagramIcon,
    FACEBOOK: FacebookIcon,
} as const;

/**
 * Public-facing social link: renders the network icon next to its display text
 * and opens the link in a new tab. Replaces the old hardcoded InstagramButton;
 * the `socialLink` now comes from the tenant (see PublicFooter).
 */
const SocialLinkButton = ({ socialLink, className }: SocialLinkButtonProps) => {
    const Icon = ICONS[socialLink.type];

    return (
        <Styled.SocialLinkButtonContainer
            className={className}
            onClick={() => window.open(socialLink.url, '_blank')}
        >
            <Icon />
            <p>{socialLink.displayText}</p>
        </Styled.SocialLinkButtonContainer>
    );
};

export default SocialLinkButton;
