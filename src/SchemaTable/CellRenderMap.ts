const CellRenderMap: { [key: string]: string } = {
  "default": "EditableCell",
  "Date": "EditableDateCell",
  "Boolean": "EditableBooleanCell",
  "Number": "EditableNumberCell",
  "String": "EditableCell",
  "Object": "EditableCell",
  "ACL": "EditableCell",
  "Pointer": "EditableRelationCell",
  "Relation": "EditableRelationCell",
  "Attribute": "EditableAttributeCell",
}

export default CellRenderMap;
