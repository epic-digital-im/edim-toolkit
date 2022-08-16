import React, { ReactNode } from 'react';
import { useState } from "react";

import {
  useToast,
  Text,
  Link,
} from "@chakra-ui/react";

interface FuncArgs {
  onChange: (value: any) => void,
  value: any,
}

type FunctionChild = (args: FuncArgs) => React.ReactNode;

interface DatePickerFieldProps {
  object: Parse.Object<any>;
  property: string;
  children: FunctionChild;
}

export const ParsePropUpdater = (props: DatePickerFieldProps): ReactNode => {
  const { object, property, children } = props;
  const toast = useToast();
  const [value, setValue] = useState<Date | undefined>(object.get(property));
  const [prevValue, setPrevValue] = useState<Date | undefined>(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = (v: Date, isUndo?: boolean) => {
    setIsLoading(true);
    setValue(v);
    object.set(property, v);
    object.save().then(() => {
      setIsLoading(false);
      toast({
        title: isUndo
          ? (
            <Text fontSize="sm">
              {`${property} successully reverted.`}
            </Text>
          )
          : (
            <Text fontSize="sm">
              {`${property} updated`} - <Link onClick={handleUndo}>Undo</Link>
            </Text>
          ),
        status: isUndo ? "info" : "success",
        duration: 5000,
        isClosable: true,
      });
      setPrevValue(v);
    }).catch((e) => {
      setIsLoading(false);
      toast({
        title: `ERROR: ${e.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });
  }

  const handleUndo = () => {
    if (prevValue) {
      handleUpdate(prevValue, true);
    }
  }

  return children({
    onChange: handleUpdate,
    value,
  })
}
