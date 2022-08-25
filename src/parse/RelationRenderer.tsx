import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface RelationRendererProps {
  object: Parse.Object<any>;
  relation: string;
  render: any
}

export const RelationRenderer: React.FC<RelationRendererProps> = ({
  object,
  relation,
  render
}) => {
  const r = object && object.relation && object.relation(relation);
  const RelationQuery = useQuery(
    [`${object.id}`, { relation }],
    () => {
      if (!r) return [];
      return r.query().find();
    },
    {
      enabled: Boolean(object && relation)
    }
  )
  const items = RelationQuery.data || [];
  return items.map(item => render(item));
}

export default RelationRenderer;
