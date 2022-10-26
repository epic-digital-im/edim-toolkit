import Parse from 'parse/dist/parse.min.js';
import { useState, useMemo } from 'react';
import { SchemaConfig } from '@app/shared/parse-types';
import { ClassNames } from '@app/shared/types';

import RenderPlugins, {
  EditableCell,
  EditableAttributeCell,
  EditableRelationCell,
  EditableDateCell,
} from '../CellRendererPlugins';

import { AttributeAttributes } from '@app/shared/parse-types';
import { SchemaConfigProp, Plugin, PluginTypes } from '../types';
import { exportAsCSV } from '../../utils/export';


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
}

export const useColumns = ({ config, schema, plugins }: UseColumnsProps): UseColumnsState => {
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
            isClearable: true,
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
          accessorFn: (d) => d[field] || null,
          cell: CellRender,
          size: columnWidths[field],
          editable,
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
