import classNames from 'classnames';
import * as Styled from './Section.styles';

export type SectionProps = {
  panelClassName?: string;
  to: string;
  title: string;
};

const Section = ({title, to, panelClassName}: SectionProps) => {
  return (
    <Styled.SectionContainer className="section">
      <a
        href={to}
        className={classNames('section__panel', panelClassName)}
      >
        <h2 className="section__panel__title">{title}</h2>
      </a>
    </Styled.SectionContainer>
  );
};

export default Section;
