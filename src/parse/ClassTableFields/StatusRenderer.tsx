import React from "react";
import { Weekdays } from "@app/shared/types";
import Selector from '../../components/Selectors/Selector';
import { ParsePropUpdater } from "../PropUpdater";
import ToggleEditWrapper from "./ToggleEditWrapper";

export const StatusRenderer = (StatusList: any[]) => ({
  rowEditable,
  setRowEditable,
  value: initialValue,
  row: { original },
  column: { id, editable, textAlign, discussion, discussionTitle }, // This is a custom function that we supplied to our table instance
}) => {
  if (!editable) {
    return
  }
  if (!rowEditable) {
    const value = (typeof initialValue === 'object') ? JSON.stringify(initialValue) : initialValue;
    return (
      <ToggleEditWrapper
        width={'100%'}
        textAlign={textAlign || 'center'}
        value={StatusList[initialValue]}
        rowEditable={rowEditable}
        setRowEditable={setRowEditable}
        editable={editable}
      />
    );
  }

  return (
    <ParsePropUpdater object={original._object} property={id}>
      {({ onChange, value, isLoading }) => {

        const handleUpdateTask = (value: Weekdays) => {
          const statusId = StatusList.indexOf(value);
          if (statusId > -1) {
            onChange(statusId);
          }
        }

        return (
          <div key={`status_${value}`} style={{ width: '90%', zIndex: 1000 }}>
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
      }}
    </ParsePropUpdater>
  )
}