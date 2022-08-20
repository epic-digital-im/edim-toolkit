import React from "react";
import { CanStates } from "@app/shared/types";
import { Text } from "@chakra-ui/react";

export const CanStateCellRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
  } = props;
  return <Text fontSize="sm">{CanStates[original._object.get(id)]}</Text>
};
