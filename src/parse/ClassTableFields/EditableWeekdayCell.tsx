import React, { useState, useEffect } from "react";
import { weekdayList, Weekdays } from "@app/shared/types";
import WeekdaySelect from '../../components/Selectors/WeekdaySelector';
import DiscussionButton from '../../components/Buttons/DiscussionButton';

export const EditableWeekdayCell = ({
  value: initialValue,
  row: { original },
  column: { id, editable, discussion, discussionTitle }, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateTask = (value: Weekdays) => {
    const object = original._object;
    const dayId = weekdayList.indexOf(value);
    if (dayId > -1) {
      setIsLoading(true);
      object.set(id, dayId);
      object.save().then(() => {
        setIsLoading(false);
      })
    }
  }

  // If the initialValue is changed externall, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (!editable) {
    return weekdayList[value] || null;
  }

  return (
    <div style={{ width: '90%', zIndex: 1000 }}>
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
        property={id}
        title={discussionTitle && discussionTitle(original._object)}
      />}
    </div>
  )
}
