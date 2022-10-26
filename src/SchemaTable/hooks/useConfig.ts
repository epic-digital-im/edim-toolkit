import Parse from 'parse/dist/parse.min.js';
import { useQuery } from '@tanstack/react-query';
import { SchemaConfig } from '@app/shared/parse-types';
import { ClassNames } from '@app/shared/types';

interface UseSchemaConfigState {
  schemaConfig: SchemaConfig;
  setColumnOrder: (columnOrder: string[]) => void;
  refetch: () => void;
}

interface UseSchemaConfigProps {
  schema: Parse.Schema;
}

export const useSchemaConfig = ({ schema }: UseSchemaConfigProps): UseSchemaConfigState => {
  const getSchemaConfig = async () => {
    const SchemaConfigClass = Parse.Object.extend(ClassNames.SchemaConfig);
    const query = new Parse.Query(SchemaConfigClass);
    query.equalTo('schema', schema.className);
    const config = await query.first();
    if (!config) {
      const newConfig = new SchemaConfigClass({
        schema: schema.className,
        columnOrder: Object.keys(schema.fields),
        columnWidths: {},
        columnVisibility: {},
        columnEditable: {},
        columnRenderer: {},
      });
      await newConfig.save();
      return newConfig;
    }
    return config;
  }

  const ClassSchemaOptionsRequest = useQuery(
    ['SchemaConfig', { className: schema?.className }],
    () => getSchemaConfig(),
    {
      enabled: !!schema,
    }
  );

  const schemaConfig = ClassSchemaOptionsRequest.data as SchemaConfig;

  const setColumnOrder = (columnOrder: string[]) => {
    if (schemaConfig) {
      schemaConfig.set('columnOrder', columnOrder);
      schemaConfig.save().then(() => {
        ClassSchemaOptionsRequest.refetch();
      });
    }
  }

  return {
    schemaConfig,
    setColumnOrder,
    refetch: ClassSchemaOptionsRequest.refetch,
  }
}

export default useSchemaConfig;