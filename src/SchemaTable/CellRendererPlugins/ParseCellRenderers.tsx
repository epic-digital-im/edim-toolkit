import Parse from 'parse/dist/parse.min.js';
import React, { useState, useEffect } from "react";
import { ClassNames } from "@app/shared/types";
import { NavLink } from 'react-router-dom';
import { Text, Flex, Button, Spinner } from "@chakra-ui/react";
import { ParseLiveQuery } from '../../hoc/ParseLiveQuery';
import { PluginTypes } from '../types';
import getters from '@app/shared/utils/getters';

const abbrevString = (str: string, maxLength: number) => {
  if (!str) return '';
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
}

export const RelationCell = ({ objectClass, objectId, Cell }: { objectClass: string, objectId: string, Cell: any }) => {
  return (
    <ParseLiveQuery objectClass={objectClass} objectId={objectId}>
      {({ data, isLoading }) => {
        if (isLoading) {
          return (
            <Flex alignItems={'center'} justifyContent={'center'} height={'100%'} width={'100%'}>
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='md'
              />
            </Flex>
          );
        }
        return (
          <Cell data={data} />
        )
      }}
    </ParseLiveQuery>
  );
}

export const RelationButtonRenderer = ({ objectClass }) => (props: any) => {
  const {
    column: {
      columnDef: {
        rowEditable,
        setRowEditable,
        editable,
        textAlign,
        discussion,
        discussionTitle,
        isAdmin,
      }
    },
    row,
    cell: {
      getValue,
    },
    row: { original },
    column,
  } = props;

  const relation = getValue();
  const getter = getters(objectClass);
  const objectData = relation // relation?.toJSON();
  const label = getter.labelGetter(objectData);
  const classRoute = objectClass?.toLowerCase();

  const link = isAdmin
    ? `/admin/${classRoute}/${original.id}`
    : `/customer/${classRoute}/${original.id}`;

  if (!label) return null;

  return (
    <div style={{ width: '90%', zIndex: 1000 }}>
      <NavLink to={link}>
        <Button
          size={'sm'}
          fontWeight={'normal'}
          backgroundColor={'transparent'}
          width="100%">
          {label}
        </Button>
      </NavLink>
    </div>
  )
};

export const ParseButtonRenderer = (props: any) => {
  const {
    value,
    row: { original },
    isAdmin,
  } = props;
  const object = original._object;
  const classRoute = object.className.toLowerCase();

  return <div style={{ width: '90%', zIndex: 1000 }}>
    <NavLink to={isAdmin ? `/admin/${classRoute}/${original.objectId}` : `/customer/${classRoute}/${original.objectId}`}>
      <Button width="100%">
        {value}
      </Button>
    </NavLink>
  </div>
};

export const ParseCellRenderer = ({ cell }) => {
  console.log(cell)
  return <Text>{'Blah!'}</Text>
};

export const ParseStripePlanRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
  } = props;
  const plan = original._object.get(id);
  const plan_id = plan?.id;
  const [planData, setPlanData] = useState<StripePlan | undefined>();
  const [loading, setLoading] = useState(false);
  const StripePlanClass = Parse.Object.extend(ClassNames.StripePlan);

  const loadPlan = async () => {
    const query = new Parse.Query(StripePlanClass);
    query.equalTo('plan_id', plan_id);
    const planObj = await query.first() as StripePlan;
    setPlanData(planObj);
  }

  useEffect(() => {
    loadPlan();
  }, [plan_id]);

  if (loading) {
    return null;
  }
  if (planData) {
    return <Text>{planData.get('nickname')}</Text>
  }
  return <Text>Plan</Text>
};

export const ParseStripeAmountRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
  } = props;
  const val = original._object.get(id);
  return <Text>{val ? `$${val / 100}` : ''}</Text>
};

export const ParseStripeDateCellRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
  } = props;
  const val = original._object.get(id);
  if (!val) return null;
  const date = new Date(original._object.get(id) * 1000);
  return <Text>{date && date.toLocaleString('en-US', { timeZone: 'America/Phoenix' })}</Text>
};

export const ParseDateCellRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
  } = props;
  const val = original._object.get(id);
  if (!val) return null;
  const date = new Date(original._object.get(id));
  return <Text>{date && date.toLocaleString('en-US', { timeZone: 'America/Phoenix' })}</Text>
};
