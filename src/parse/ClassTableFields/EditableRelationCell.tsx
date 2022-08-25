import React from "react";
import { ClassNames } from "@app/shared/types";
import { Flex } from "@chakra-ui/react";
import { ParsePropUpdater } from "../PropUpdater";
import ClassSearchSelect from '../../components/Selectors/ClassSearchSelect';
import DiscussionButton from '../../components/Buttons/DiscussionButton';

interface EditableRelationCellProps {
  objectClass: ClassNames;
  valueGetter: (data: any) => string;
  labelGetter: (data: any) => string;
  isClearable?: boolean;
}

export const EditableRelationCell = ({
  objectClass,
  valueGetter,
  labelGetter,
  isClearable,
}: EditableRelationCellProps) => ({
  row: { original },
  column: { id, discussion, discussionTitle },
}) => {
    // const initialValue = original._object.get(id);
    // const initialData = initialValue?.toJSON();

    return (
      <Flex width={'100%'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
        <ParsePropUpdater object={original._object} property={id}>
          {({ onChange, value, isLoading }) => {
            const handleClear = () => {
              onChange(null);
            }
            return (
              <ClassSearchSelect
                isClearable={isClearable}
                isLoading={isLoading}
                disabled={isLoading}
                style={{ width: '100%' }}
                objectClass={objectClass}
                queryName={objectClass}
                initialValue={value?.toJSON()}
                valueGetter={valueGetter}
                labelGetter={labelGetter}
                onSelect={onChange}
                onClear={handleClear}
                isCreateable
                placeholder=""
              />
            )
          }}
        </ParsePropUpdater>
        {discussion && <DiscussionButton
          type='icon'
          object={original._object}
          property={id}
          title={discussionTitle && discussionTitle(original._object)}
        />}
      </Flex>
    )
  }
