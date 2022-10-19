import React, { useEffect, useState } from 'react';
import { TabList, TabPanels, TabPanel, Tabs, Tab } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { Roles } from '@app/shared/types';

interface Tab {
  label: string;
  Component: React.FC<any>;
  roles: string[];
  props?: any;
}

interface TabsProps {
  location: any;
  isAdmin?: boolean;
  isAdminCustomerDetail?: boolean;
  tabs: Tab[];
}

const Tabber: React.FC<TabsProps> = (props) => {
  const { location, isAdmin, tabs } = props;
  const history = useHistory();
  const search = new URLSearchParams(location.search);
  const initialTab = search.get('t');

  const labelList = tabs.map(t => t.label);
  const defaultIndex = (initialTab) ? labelList.indexOf(initialTab) : 0;
  const [tabIndex, setTabIndex] = useState(defaultIndex);

  const handleTabChange = (index: number) => {
    history.push({
      pathname: location.pathname,
      search: `?t=${labelList[index]}`
    })
    setTabIndex(index);
  }

  useEffect(() => {
    if (initialTab) {
      const tabIndex = labelList.indexOf(initialTab);
      setTabIndex(tabIndex);
    }
  }, [initialTab]);

  const t = tabs.filter((tab: Tab) => {
    if (!tab.roles) return true;
    if (tab.roles.length === 0) return true;
    if (tab.roles.indexOf(Roles.editor) > -1 && !isAdmin) return false;
    return true;
  })

  return (
    <Tabs index={tabIndex} isFitted variant='enclosed' width="100%" onChange={handleTabChange}>
      <TabList>
        {t.map((tab, index) => (<Tab key={`${index}_${tab.label}_Tab`}>{tab.label}</Tab>))}
      </TabList>
      <TabPanels borderWidth="1px" borderColor={'grey.200'} borderStyle="solid">
        {t.map((tab, index) => {
          const tabProps = tab.props || {};
          return (
            <TabPanel key={`${index}_${tab.label}_tabPanel`}>
              {tabIndex === index && <tab.Component {...props} {...tabProps} />}
            </TabPanel>
          )
        }
        )}
      </TabPanels>
    </Tabs>
  );
}

export default Tabber;
