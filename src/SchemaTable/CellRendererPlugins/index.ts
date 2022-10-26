export * from './EditableCell';
export * from './EditableAttributeCell';
export * from './EditableColorPicker';
export * from './EditableNumberCell';
export * from './EditableDateCell';
export * from './EditableRelationCell';
export * from './EditableBooleanCell';
export * from './EditableWeekdayCell';
export * from './StatusRenderer';
export * from './ParseCellRenderers';

import EditableCell from './EditableCell';
import EditableAttributeCell from './EditableAttributeCell';
import EditableColorPicker from './EditableColorPicker';
import EditableNumberCell from './EditableNumberCell';
import EditableDateCell from './EditableDateCell';
import EditableRelationCell from './EditableRelationCell';
import EditableBooleanCell from './EditableBooleanCell';
import EditableWeekdayCell from './EditableWeekdayCell';
import StatusRenderer from './StatusRenderer';

import {
  RelationButtonRenderer
} from './ParseCellRenderers';

import { PluginTypes, Plugin } from '../types';

const RenderPlugins: Plugin[] = [
  EditableCell,
  EditableAttributeCell,
  EditableColorPicker,
  EditableNumberCell,
  EditableDateCell,
  EditableRelationCell,
  EditableBooleanCell,
  EditableWeekdayCell,
  StatusRenderer,
  {
    name: 'RelationButtonRenderer',
    type: PluginTypes.CellRenderer,
    component: RelationButtonRenderer,
  }
]

export default RenderPlugins;