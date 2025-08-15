import React from 'react';
import classNames from 'classnames';
import * as Styled from './SideMenu.styles'
import { useTranslation } from 'react-i18next';

export interface MenuItem {
  key: string;
  label: string;
}

interface SideMenuProps {
  items: MenuItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ items, activeKey, onSelect }) => {
  const {t} = useTranslation();
  return (
    <Styled.SideMenuContainer>
      {items.map((item) => (
        <div
          key={item.key}
          className={classNames('side-menu__item', {
            'side-menu__item--active': activeKey === item.key,
          })}
          onClick={() => onSelect(item.key)}
        >
          {t(item.label)}
        </div>
      ))}
    </Styled.SideMenuContainer>
  );
};

export default SideMenu;
