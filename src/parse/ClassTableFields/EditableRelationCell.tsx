import React, { useMemo } from "react";
import { ClassNames } from "@app/shared/types";
import { Flex } from "@chakra-ui/react";
import { ParsePropUpdater } from "../PropUpdater";
import ClassSearchSelect, { Filter } from '../../components/Selectors/ClassSearchSelect';
import DiscussionButton from '../../components/Buttons/DiscussionButton';
import ToggleEditWrapper from './ToggleEditWrapper';

interface EditableRelationCellProps {
  objectClass: ClassNames;
  valueGetter: (data: any) => string;
  labelGetter: (data: any) => string;
  isClearable?: boolean;
  filters?: Filter[];
  getFilters?: (object: Parse.Object<any>) => Filter[];
  isMulti?: boolean;
}

export const EditableRelationCell = ({
  objectClass,
  valueGetter,
  labelGetter,
  isClearable,
  filters,
  getFilters,
  isMulti,
}: EditableRelationCellProps) => ({
  row: { original },
  column: { id, discussion, discussionTitle, editable, textAlign },
  rowEditable,
  setRowEditable
}) => {
    // const initialValue = original._object.get(id);
    // const initialData = initialValue?.toJSON();

    if (!setRowEditable) {
      return (
        <ToggleEditWrapper
          width={'100%'}
          textAlign={textAlign || 'center'}
          value={valueGetter(original)}
          rowEditable={rowEditable}
          setRowEditable={setRowEditable}
          editable={editable}
        />
      );
    }

    return useMemo(() => {
      return (
        <Flex width={'100%'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
          <ParsePropUpdater object={original._object} property={id}>
            {({ onChange, value, isLoading }) => {
              const handleClear = () => {
                onChange(null);
              }
              return (
                <ClassSearchSelect
                  filters={filters}
                  getFilters={getFilters}
                  isClearable={isClearable}
                  isLoading={isLoading}
                  disabled={isLoading}
                  style={{ width: '100%' }}
                  objectClass={objectClass}
                  queryName={objectClass}
                  object={original._object}
                  initialValue={value?.toJSON()}
                  valueGetter={valueGetter}
                  labelGetter={labelGetter}
                  onSelect={onChange}
                  onClear={handleClear}
                  isCreateable
                  placeholder=""
                  isMulti={isMulti}
                />
              )
            }}
          </ParsePropUpdater>
          {discussion && <DiscussionButton
            type='icon'
            object={original._object}
            context={id}
            title={discussionTitle && discussionTitle(original._object)}
          />}
        </Flex>
      )
    }, [original._object, id]);
  }
