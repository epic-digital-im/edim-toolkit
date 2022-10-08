import React, { useState, useEffect } from "react";
import { weekdayList, Weekdays } from "@app/shared/types";
import WeekdaySelect from '../../components/Selectors/WeekdaySelector';
import DiscussionButton from '../../components/Buttons/DiscussionButton';
import { ParsePropUpdater } from "../PropUpdater";

export const EditableWeekdayCell = ({
  value: initialValue,
  row: { original },
  column: { id, editable, discussion, discussionTitle }, // This is a custom function that we supplied to our table instance
}) => {

  if (!editable) {
    return weekdayList[initialValue] || null;
  }

  return (
    <ParsePropUpdater object={original._object} property={id}>
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
              object={original._object}
              context={id}
              title={discussionTitle && discussionTitle(original._object)}
            />}
          </div>
        )
      }}
    </ParsePropUpdater>
  )
}
