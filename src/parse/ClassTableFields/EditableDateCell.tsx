import React, { } from "react";
import { SingleDatePickerParse } from '../../forms/Fields/DatePickerField';
import DiscussionButton from '../../components/Buttons/DiscussionButton';
import ToggleEditWrapper from "./ToggleEditWrapper";

export const EditableDateCell = ({ cell, row: { original }, column, rowEditable, setRowEditable, }) => {
  const { id, editable, textAlign, discussion, discussionTitle } = column;

  if (!rowEditable) {
    const d = original._object.get(id);
    if (!d) return null;
    return (
      <ToggleEditWrapper
        width={'100%'}
        textAlign={textAlign || 'center'}
        value={d.toISOString().split('T')[0]}
        rowEditable={rowEditable}
        setRowEditable={setRowEditable}
        editable={editable}
      />
    )
  }

  return (
    <>
      <SingleDatePickerParse
        property={id}
        object={original._object}
      />
      {discussion && <DiscussionButton
        type='icon'
        object={original._object}
        context={id}
        title={discussionTitle && discussionTitle(original._object)}
      />}
    </>
  )
}
