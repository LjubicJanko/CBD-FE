import classNames from 'classnames';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import configService from '../../api/services/config';
import ChipConfigComponent from '../../components/chip-config/ChipConfig.component';
import SideMenu from '../../components/side-menu/SideMenu.component';
import useQueryParams from '../../hooks/useQueryParams';
import ConfigTabLayout from '../../layouts/config-tab/ConfigTabLayout';
import {
  ConfigType,
  GenericConfig,
  GenericConfigType,
} from '../../types/GenericConfig';
import * as Styled from './Config.style';

interface TabContent {
  onCancel?: () => void;
  onSubmit?: () => void;
  hideFooter?: boolean;
  title: string;
  component: ReactNode;
}

const menuItems: {
  key: ConfigType;
  label: string;
}[] = [
  {
    key: 'POST_SERVICE',
    label: 'Kurirska sluzba',
  },
  {
    key: 'EQUIPMENT_TYPE',
    label: 'Tip opreme',
  },
  {
    key: 'PRINT_TYPE',
    label: 'Nacin stampe',
  },
  {
    key: 'SIZES',
    label: 'Velicine',
  },
  {
    key: 'TEMPLATES',
    label: 'Sabloni',
  },
  {
    key: 'PRICE_LIST',
    label: 'Cenovnik',
  },
];

const isGenericTab = (tab: ConfigType): tab is GenericConfigType => {
  return ['POST_SERVICE', 'EQUIPMENT_TYPE', 'PRINT_TYPE'].includes(tab);
};

export const ConfigPage = () => {
  const { params, setQParam } = useQueryParams<{ tab: ConfigType }>();
  const activeTab: ConfigType = (params['tab'] as ConfigType) || 'POST_SERVICE';

  const [items, setItems] = useState<GenericConfig[]>([]);

  useEffect(() => {
    if (isGenericTab(activeTab)) {
      console.log(activeTab);
      configService.getConfigsByType(activeTab).then(setItems);
    }
  }, [activeTab]);

  const content: Record<ConfigType, TabContent> = useMemo(() => {
    return {
      POST_SERVICE: {
        onCancel: () => console.log('cancel'),
        onSubmit: () => console.log('submit'),
        title: 'Kurirska sluzba',
        component: <>kurirska sluzba</>,
      },
      PRINT_TYPE: {
        hideFooter: true,
        title: 'PRINT_TYPE',
        component: (
          <ChipConfigComponent
            items={items}
            onAdd={async (item: string) => {
              const response = await configService.createConfig({
                type: activeTab as GenericConfigType,
                value: item,
              });

              setItems((old) => [...old, response]);
            }}
            onRemove={async (itemId: number) => {
              await configService.deleteConfig(itemId);

              setItems((old) => old.filter((x) => x.id !== itemId));
            }}
            title={'Tip stampe'}
          />
        ),
      },
      EQUIPMENT_TYPE: {
        hideFooter: true,
        title: 'EQUIPMENT_TYPE',
        component: (
          <ChipConfigComponent
            items={items}
            onAdd={async (item: string) => {
              const response = await configService.createConfig({
                type: activeTab as GenericConfigType,
                value: item,
              });

              setItems((old) => [...old, response]);
            }}
            onRemove={async (itemId: number) => {
              await configService.deleteConfig(itemId);

              setItems((old) => old.filter((x) => x.id !== itemId));
            }}
            title={'EQUIPMENT_TYPE'}
          />
        ),
      },
      SIZES: {
        onCancel: () => console.log('cancel'),
        onSubmit: () => console.log('submit'),
        title: 'SIZES',
        component: (
          <ChipConfigComponent
            items={[]}
            onAdd={(item: string) => console.log(`add item: ${item}`)}
            onRemove={(itemId: number) => console.log(`remove item: ${itemId}`)}
            title={'SIZES'}
          />
        ),
      },
      PRICE_LIST: {
        onCancel: () => console.log('cancel'),
        onSubmit: () => console.log('submit'),
        title: 'PRICE_LIST',
        component: <>price list</>,
      },
      TEMPLATES: {
        onCancel: () => console.log('cancel'),
        onSubmit: () => console.log('submit'),
        title: 'TEMPLATES',
        component: <>templates</>,
      },
      GENERAL: {
        onCancel: () => {},
        onSubmit: () => {},
        title: '',
        component: <></>,
      },
    };
  }, [activeTab, items]);

  return (
    <Styled.ConfigPageContainer
      className={classNames('config-page', {
        'config-page--general': activeTab === 'GENERAL',
      })}
    >
      <SideMenu
        items={menuItems}
        activeKey={activeTab}
        onSelect={(key) => setQParam('tab', key)}
      />

      {activeTab === 'GENERAL' ? (
        <></>
      ) : (
        <ConfigTabLayout
          className="config-page__content"
          title={content[activeTab].title}
          onClose={() => setQParam('tab', 'general')}
          onCancel={content[activeTab]?.onCancel}
          onSubmit={content[activeTab]?.onSubmit}
          hideFooter={content[activeTab]?.hideFooter}
        >
          {content[activeTab].component}
        </ConfigTabLayout>
      )}
    </Styled.ConfigPageContainer>
  );
};
