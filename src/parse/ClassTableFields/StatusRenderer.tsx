import React, { useState, useEffect } from "react";
import { Weekdays } from "@app/shared/types";
import Selector from '../../components/Selectors/Selector';

export const StatusRenderer = (StatusList: any[]) => ({
  value: initialValue,
  row: { original },
  column: { id, editable }, // This is a custom function that we supplied to our table instance
}) => {


  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateTask = (value: Weekdays) => {
    const object = original._object;
    const statusId = StatusList.indexOf(value);
    if (statusId > -1) {
      setIsLoading(true);
      object.set(id, statusId);
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
    return StatusList[value]
  }

  return (
    <div style={{ width: '90%', zIndex: 1000 }}>
      <Selector
        isDisabled={isLoading}
        isLoading={isLoading}
        initialValue={{
          value: StatusList[value],
          label: StatusList[value]
        }}
        onSelect={handleUpdateTask}
        options={StatusList.map((value: string) => ({
          value: value,
          label: value
        }))}
      />
    </div>
  )
}