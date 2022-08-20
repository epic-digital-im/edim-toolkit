import React, { useState, useEffect } from "react";
import { SingleDatePickerParse } from '../../forms/Fields/DatePickerField';
import DiscussionButton from '../../components/Buttons/DiscussionButton';

export const EditableDateCell = ({ cell, row: { original }, column }) => {
  if (!column.editable) {
    const d = original._object.get(column.id);
    if (!d) return null;
    return d.toLocaleDateString();
  }
  return (
    <>
      <SingleDatePickerParse
        property={column.id}
        object={original._object}
      />
      {column.discussion && <DiscussionButton
        type='icon'
        object={original._object}
        property={column.id}
      />}
    </>
  )
}
