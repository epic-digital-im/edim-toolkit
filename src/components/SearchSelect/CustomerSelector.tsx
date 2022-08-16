import { CustomerAttributes } from "@app/shared/parse-types";
import { ClassNames } from "@app/shared/types";
import ClassSearchSelect from './ClassSearchSelect';

interface CustomerSelectorProps {
  customer?: CustomerAttributes;
  onSelect: (customer: Parse.Object<Parse.Attributes>) => void;
}

const CustomerSelector = ({ customer, onSelect }: CustomerSelectorProps) => {
  const valueGetter = (customer: CustomerAttributes): string => {
    if (!customer) return "UNASSIGNED"
    return customer.objectId || "UNASSIGNED";
  };
  const labelGetter = (customer: CustomerAttributes): string => {
    if (!customer) return "UNASSIGNED";
    let firstName = customer.firstName;
    let lastName = customer.lastName;
    let label = firstName || '';
    if (lastName) label += ` ${lastName}`;
    return label;
  };
  return (
    <ClassSearchSelect
      style={{ width: '200px' }}
      label="Select Customer:"
      initialValue={customer}
      objectClass={ClassNames.Customer}
      valueGetter={valueGetter}
      labelGetter={labelGetter}
      onSelect={onSelect}
    />
  )
}

export default CustomerSelector;
