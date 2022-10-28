/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import * as Filters from './Filters';
import React from 'react';
import stringCompare from '../../utils/stringCompare';
import { useContainer } from '../SchemaTableProvider';

function changeField(schema, filters, index, newField) {
  const newFilter = new Map({
    field: newField,
    constraint: Filters.FieldConstraints[schema[newField].type][0],
    compareTo: Filters.DefaultComparisons[schema[newField].type]
  });
  return filters.set(index, newFilter);
}

function changeConstraint(schema, filters, index, newConstraint) {
  let field = filters.get(index).get('field');
  let compareType = schema[field].type;
  if (Object.prototype.hasOwnProperty.call(Filters.Constraints[newConstraint], 'field')) {
    compareType = Filters.Constraints[newConstraint].field;
  }
  let newFilter = new Map({
    field: field,
    constraint: newConstraint,
    compareTo: Filters.DefaultComparisons[compareType]
  })
  return filters.set(index, newFilter);
}

function changeCompareTo(schema, filters, index, type, newCompare) {
  let newValue = newCompare;
  return filters.set(index, filters.get(index).set('compareTo', newValue));
}

function deleteRow(filters, index) {
  return filters.delete(index);
}

const Filter = ({ schema, filters, renderRow, onChange, blacklist, className }) => {
  const State = useContainer();
  blacklist = blacklist || [];
  const available = Filters.availableFilters(schema, filters);
  const columnPreference = {};
  return (
    <div>
      {filters.toArray().map((filter, i) => {
        const field = filter.get('field');
        const constraint = filter.get('constraint');
        const compareTo = filter.get('compareTo');

        const fields = Object.keys(available).concat([]);
        if (fields.indexOf(field) < 0) {
          fields.push(field);
        }

        // Get the column preference of the current class.
        const currentColumnPreference = columnPreference ? columnPreference[className] : null;

        // Check if the preference exists.
        if (currentColumnPreference) {
          const fieldsToSortToTop = currentColumnPreference
            .filter(item => item.filterSortToTop)
            .map(item => item.name);
          // Sort the fields.
          fields.sort((a, b) => {
            // Only "a" should sorted to the top.
            if (fieldsToSortToTop.includes(a) && !fieldsToSortToTop.includes(b)) {
              return -1
            }
            // Only "b" should sorted to the top.
            if (!fieldsToSortToTop.includes(a) && fieldsToSortToTop.includes(b)) {
              return 1;
            }
            // Both should sorted to the top -> they should be sorted to the same order as in the "fieldsToSortToTop" array.
            if (fieldsToSortToTop.includes(a) && fieldsToSortToTop.includes(b)) {
              return fieldsToSortToTop.indexOf(a) - fieldsToSortToTop.indexOf(b);
            }
            return stringCompare(a, b);
          });
        }
        // If there's no preference: Use the default sort function.
        else {
          fields.sort();
        }

        const constraints = Filters.FieldConstraints[schema[field].type].filter((c) => blacklist.indexOf(c) < 0);
        const compareType = schema[field].type;
        if (Object.prototype.hasOwnProperty.call(Filters.Constraints[constraint], 'field')) {
          compareType = Filters.Constraints[constraint].field;
        }
        return renderRow({
          fields,
          constraints,
          compareInfo: {
            type: compareType,
            targetClass: schema[field].targetClass,
          },
          currentField: field,
          currentConstraint: constraint,
          compareTo,
          key: field + '-' + constraint + '-' + i,

          onChangeField: newField => {
            onChange(changeField(schema, filters, i, newField));
          },
          onChangeConstraint: newConstraint => {
            onChange(changeConstraint(schema, filters, i, newConstraint));
          },
          onChangeCompareTo: newCompare => {
            onChange(changeCompareTo(schema, filters, i, compareType, newCompare));
          },
          onDeleteRow: () => {
            onChange(deleteRow(filters, i));
          }
        });
      })}
    </div>
  );
};

export default Filter;