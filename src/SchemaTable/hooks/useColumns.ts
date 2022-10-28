import Parse from 'parse/dist/parse.min.js';
import { useState, useMemo } from 'react';
import { SchemaConfig } from '@app/shared/parse-types';
import { ClassNames } from '@app/shared/types';

import RenderPlugins, {
  EditableCell,
  EditableAttributeCell,
  EditableRelationCell,
  EditableDateCell,
  RelationButtonRenderer
} from '../CellRendererPlugins';

import { AttributeAttributes } from '@app/shared/parse-types';
import { SchemaConfigProp, Plugin, PluginTypes } from '../types';
import { exportAsCSV } from '../../utils/export';
import getters from '@app/shared/utils/getters';

const formatDate = (date: Date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const _date = `0${d.getDate()}`.slice(-2);
  const hour = `0${d.getHours()}`.slice(-2);
  const minute = `0${d.getMinutes()}`.slice(-2);
  const second = `0${d.getSeconds()}`.slice(-2);
  return `${month}-${_date}-${year} ${hour}:${minute}:${second}`;
};

interface UseColumnsState {
  tableColumns: any[];
  handleExport: (data: any) => void;
  exportLoading: boolean;
  include: string[];
  select: string[];
  columnOrder: string[];
}

interface UseColumnsProps {
  config: SchemaConfig;
  schema: Parse.Schema;
  plugins: Plugin[];
  isAdmin?: boolean;
}

const accessorFn = (item: Parse.Object<Parse.Attributes<any>>, accessor: string, type: string) => {
  if (!item) return null;
  // if (accessor === 'objectId') return item.id;
  const value = item[accessor];
  const className = value?.targetClass;
  if (className) {
    const getter = getters(className);
    return getter.labelGetter(item);
  }
  if (type === 'Date') return formatDate(value);
  return value;
}

export const useColumns = ({ config, schema, plugins, isAdmin, }: UseColumnsProps): UseColumnsState => {
  const objectClass = schema?.className as ClassNames;
  const renderers = RenderPlugins.concat(plugins?.find(p => p.type === PluginTypes.CellRenderer) || []);
  const rendererConfig = config?.get(SchemaConfigProp.columnRenderer) || {};
  const columnEditable = config?.get(SchemaConfigProp.columnEditable) || {};
  const visibility = config?.get(SchemaConfigProp.columnVisibility) || {};
  const columnOrder = config?.get(SchemaConfigProp.columnOrder) || [];
  const columnWidths = config?.get(SchemaConfigProp.columnWidths) || {};
  const [exportLoading, setExportLoading] = useState(false);

  const columnsData = useMemo(() => {
    if (!schema) return null;
    const include: string[] = [];
    const select: string[] = [];

    const cols = Object.keys(schema.fields)
      .filter((field) => visibility[field] !== false)
      .map((field) => {
        const editable = columnEditable[field] === true;
        const renderer = rendererConfig[field];
        const f = schema.fields[field];
        select.push(field);

        let CellRender = null; // renderers.find((r: Plugin) => r.name === renderer)?.component;

        if (f.type === 'Pointer' || f.type === 'Relation') {
          include.push(field)
        }

        if (f.type === 'Pointer' && f.targetClass.indexOf('Attribute') > -1) {
          CellRender = EditableAttributeCell({
            attributeName: field,
            objectClass: f.targetClass,
            valueGetter: (row: AttributeAttributes) => row.objectId,
            labelGetter: (row: AttributeAttributes) => row.value,
          });
        } else if (f.type === 'Relation' && f.targetClass.indexOf('Attribute') > -1) {
          CellRender = EditableAttributeCell({
            attributeName: field,
            objectClass: f.targetClass,
            valueGetter: (row: AttributeAttributes) => row.objectId,
            labelGetter: (row: AttributeAttributes) => row.value,
            isClearable: true,
            isMulti: true,
          });
        } else if (f.type === 'Relation') {
          CellRender = EditableRelationCell({
            objectClass: f.targetClass,
            isClearable: true,
            isMulti: true,
          });
        } else if (f.type === 'Pointer') {
          CellRender = EditableRelationCell({
            objectClass: f.targetClass,
          });
        } else if (f.type === 'Date') {
          CellRender = EditableDateCell;
        } else {
          if (!CellRender) {
            CellRender = EditableCell;
          }
        }

        return {
          id: field,
          header: field,
          accessorFn: (item: Parse.Object<Parse.Attributes<any>>) => accessorFn(item, field, f.type),
          cell: CellRender,
          size: columnWidths[field],
          editable,
          isAdmin,
          // Header: field,
          // accessor: field,
          // width: columnWidths[field] || 200,
          // Cell: CellRender,
        };
      }).reduce((acc, val) => {
        if (columnOrder.length > 0 && columnOrder.indexOf(val.accessor) !== -1) {
          acc[columnOrder.indexOf(val.accessor)] = val;
          return acc;
        }
        return [...acc, val];
      }, [])
      .filter((col) => !!col);
    return {
      tableColumns: cols,
      include,
      select,
    };
  }, [schema, rendererConfig, columnEditable, visibility, columnOrder, columnWidths]);

  const handleExport = async (data: any) => {
    setExportLoading(true);
    const d = data.map((row: any) => {
      const r = { ...row };
      Object.keys(r).forEach((key) => {
        const value = r[key];
        if (value && value.id) {
          r[key] = value.id;
        } else {
          r[key] = value;
        }
      });
      if (r._object) {
        delete r._object;
      }
      return r;
    });
    await exportAsCSV(`${objectClass}.csv`, d);
    setExportLoading(false);
  }

  return {
    ...columnsData,
    handleExport,
    exportLoading,
    columnOrder,
  }
}

export default useColumns;
