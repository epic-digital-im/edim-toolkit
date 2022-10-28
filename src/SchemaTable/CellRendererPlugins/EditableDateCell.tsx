import React, { } from "react";
import { SingleDatePickerParse } from '../../forms/Fields/DatePickerField';
import DiscussionButton from '../../components/Buttons/DiscussionButton';
import ToggleEditWrapper from "./ToggleEditWrapper";
import { PluginTypes } from '../types';

export const EditableDateCell = (props) => {
  const {
    column: {
      columnDef: {
        editable,
        textAlign,
        discussion,
        discussionTitle,
      }
    },
    row,
    cell: {
      getValue,
    },
    row: { original },
    column, // This is a custom function that we supplied to our table instance
  } = props;

  const { id } = column;
  const initialValue = getValue();

  return (
    <ToggleEditWrapper
      width={'100%'}
      textAlign={textAlign || 'center'}
      value={initialValue}
      editable={editable}
    >
      <>
        <SingleDatePickerParse
          property={id}
          object={original}
        />
        {discussion && <DiscussionButton
          type='icon'
          object={original}
          context={id}
          title={discussionTitle && discussionTitle(original)}
        />}
      </>
    </ToggleEditWrapper>
  )
}

export default {
  name: 'EditableDateCell',
  type: PluginTypes.CellRenderer,
  component: EditableDateCell
}
