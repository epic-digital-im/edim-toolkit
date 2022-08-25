import React, { useState, useEffect } from "react";
import { SingleDatePickerParse } from '../../forms/Fields/DatePickerField';
import DiscussionButton from '../../components/Buttons/DiscussionButton';

export const EditableDateCell = ({ cell, row: { original }, column }) => {
  const { id, editable, textAlign, discussion, discussionTitle } = column;
  if (!editable) {
    const d = original._object.get(id);
    if (!d) return null;
    return d.toLocaleDateString();
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
        property={id}
        title={discussionTitle && discussionTitle(original._object)}
      />}
    </>
  )
}
