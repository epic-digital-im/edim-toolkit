import React from "react";
import { weekdayList, Weekdays } from "@app/shared/types";
import WeekdaySelect from '../../components/Selectors/WeekdaySelector';
import DiscussionButton from '../../components/Buttons/DiscussionButton';
import { ParsePropUpdater } from "../PropUpdater";
import ToggleEditWrapper from './ToggleEditWrapper';
import { PluginTypes } from '../types';

export const EditableWeekdayCell = (props) => {
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
    column,
  } = props;

  const { id } = column;
  const initialValue = getValue();

  return (
    <ToggleEditWrapper
      width={'100%'}
      textAlign={textAlign || 'center'}
      value={weekdayList[initialValue] || null}
      editable={editable}
    >
      <ParsePropUpdater object={original} property={id}>
        {({ onChange, value, isLoading }) => {

          const handleUpdateTask = (value: Weekdays) => {
            const dayId = weekdayList.indexOf(value);
            if (dayId > -1) {
              onChange(dayId);
            }
          }

          return (
            <div key={`weekday_${value}`} style={{ width: '90%', zIndex: 1000 }}>
              <WeekdaySelect
                isDisabled={isLoading}
                isLoading={isLoading}
                initialValue={{
                  value: weekdayList[value],
                  label: weekdayList[value]
                }}
                onSelect={handleUpdateTask}
              />
              {discussion && <DiscussionButton
                type='icon'
                object={original}
                context={id}
                title={discussionTitle && discussionTitle(original)}
              />}
            </div>
          )
        }}
      </ParsePropUpdater>
    </ToggleEditWrapper>
  );
}

export default {
  name: 'EditableWeekdayCell',
  type: PluginTypes.CellRenderer,
  component: EditableWeekdayCell
}
