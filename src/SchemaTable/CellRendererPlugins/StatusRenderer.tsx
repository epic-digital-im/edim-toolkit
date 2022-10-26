import React from "react";
import { Weekdays } from "@app/shared/types";
import Selector from '../../components/Selectors/Selector';
import { ParsePropUpdater } from "../PropUpdater";
import { PluginTypes } from '../types';

export const StatusRenderer = (StatusList: any[]) => ({
  value: initialValue,
  row: { original },
  column: { id, editable }, // This is a custom function that we supplied to our table instance
}) => {

  if (!editable) {
    return StatusList[initialValue]
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

export default {
  name: 'StatusRenderer',
  type: PluginTypes.CellRenderer,
  component: StatusRenderer
}