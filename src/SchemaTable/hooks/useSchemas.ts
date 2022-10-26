import Parse from 'parse/dist/parse.min.js';
import { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClassNames } from '@app/shared/types';

interface UseSchemaProps {
  objectClass?: ClassNames | string;
}

interface UseSchemaModel {
  schemas: Parse.Schema[];
  selectedSchema: Parse.Schema;
  setSelectedSchema: (schema: Parse.Schema) => void;
  schemaOptions: { value: string; label: string }[]
  handleSchemaChange: (value: string) => void;
  refetch: () => void;
  isLoading: boolean;
  isError: boolean;
}


const useSchema = ({ objectClass }: UseSchemaProps): UseSchemaModel => {
  const [selectedSchema, setSelectedSchema] = useState<Parse.Schema>();

  const getClassSchemas = async () => {
    const classSchema = await Parse.Cloud.run('getClassSchemas');
    return classSchema;
  }

  const ClassSchemaRequest = useQuery<Parse.Schema[]>(
    ['ClassSchemas'],
    () => getClassSchemas(),
    {
      enabled: !!objectClass,
    }
  );

  useEffect(() => {
    if (ClassSchemaRequest.data) {
      const selected = (objectClass)
        ? ClassSchemaRequest.data.find((schema) => schema.className === objectClass)
        : ClassSchemaRequest.data[0];
      setSelectedSchema(selected);
    }
  }, [ClassSchemaRequest.data]);

  const handleSchemaChange = (className: string) => {
    const schema = ClassSchemaRequest.data.find(schema => schema.className === className);
    setSelectedSchema(schema);
  }

  const schemaOptions = useMemo(() => {
    if (!ClassSchemaRequest.data) return [];
    return ClassSchemaRequest.data.map((schema) => {
      return {
        value: schema.className,
        label: schema.className,
      }
    })
  }, [ClassSchemaRequest]);

  return {
    schemas: ClassSchemaRequest.data || [],
    selectedSchema,
    setSelectedSchema,
    schemaOptions,
    handleSchemaChange,
    refetch: ClassSchemaRequest.refetch,
    isLoading: ClassSchemaRequest.isLoading,
    isError: ClassSchemaRequest.isError,
  }
}

export default useSchema;