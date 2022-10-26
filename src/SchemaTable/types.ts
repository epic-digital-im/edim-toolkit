export enum PluginTypes {
  CellRenderer = 'CellRenderer',
}

export enum SchemaConfigProp {
  columnWidths = 'columnWidths',
  columnVisibility = 'columnVisibility',
  columnEditable = 'columnEditable',
  columnRenderer = 'columnRenderer',
  columnRequired = 'columnRequired',
  columnOrder = 'columnOrder',
}

export interface Plugin {
  name: string;
  type: string;
  component: React.FC<any>;
}

export const locked = [
  'createdAt',
  'updatedAt',
  'ACL',
  'objectId',
  'e_id',
];