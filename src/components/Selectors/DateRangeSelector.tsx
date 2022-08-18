import moment, { Moment } from 'moment';
import { useState } from 'react';
import { DateRangePicker } from 'react-dates';
import Selector from './Selector';
import { Flex } from '@chakra-ui/react'

interface DateRangeSelectorProps {
  name?: string;
  startDate?: Date,
  endDate?: Date,
  onChange?: (change: { startDate: Date, endDate: Date }) => void,
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ startDate, endDate, onChange, name }) => {
  const id = name || new Date().toISOString();
  const [range, setRange] = useState<string>('FY2022');
  const [focused, setFocused] = useState<boolean>();

  const quarters = [
    [],
    [10, 11, 12],
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  const currentQuarter = (() => {
    const d = moment();
    const month = d.month() + 1;
    return quarters.reduce((acc, quarter, index) => {
      if (quarter.includes(month)) {
        return index;
      }
      return acc;
    }, 0)
  })();

  const lastQuarterStart = quarters[currentQuarter - 1][0];
  const lastQuarterEnd = quarters[currentQuarter - 1][2];

  const quarterStart = quarters[currentQuarter][0];
  const quarterEnd = quarters[currentQuarter][2];

  console.log(quarterStart, quarterEnd);

  const ranges = [
    {
      label: 'FY 2021',
      value: 'FY2021',
      startDate: moment('2021-10-01'),
      endDate: moment('2022-09-30')
    },
    {
      label: 'FY 2022',
      value: 'FY2022',
      startDate: moment('2022-10-01'),
      endDate: moment('2023-09-30')
    },
    {
      label: 'FY 2023',
      value: 'FY2023',
      startDate: moment('2023-10-01'),
      endDate: moment('2024-09-30')
    },
    {
      label: 'This Quarter',
      value: 'thisQuarter',
      startDate: moment().month(quarterStart - 1).startOf('month'),
      endDate: moment().month(quarterEnd - 1).endOf('month'),
    },
    {
      label: 'Last Quarter',
      value: 'lastQuarter',
      startDate: moment().month(lastQuarterStart - 1).startOf('month'),
      endDate: moment().month(lastQuarterEnd - 1).endOf('month'),
    },
    {
      label: 'This Month',
      value: 'thisMonth',
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month')
    },
    {
      label: 'Last Month',
      value: 'lastMonth',
      startDate: moment().subtract(1, 'month').startOf('month'),
      endDate: moment().subtract(1, 'month').endOf('month')
    },
    {
      label: 'This Year',
      value: 'thisYear',
      startDate: moment().startOf('year'),
      endDate: moment().endOf('year')
    },
    {
      label: 'Last Year',
      value: 'lastYear',
      startDate: moment().subtract(1, 'year').startOf('year'),
      endDate: moment().subtract(1, 'year').endOf('year')
    },
  ]

  const [value, setValue] = useState<{ startDate: Moment, endDate: Moment }>({
    startDate: moment(startDate),
    endDate: moment(endDate),
  });

  const handleClose = () => {
    setFocused(false)
  }

  const handleChange = (change: { startDate: Moment, endDate: Moment }) => {
    setValue(change);
    if (onChange) onChange({
      startDate: change.startDate.toDate(),
      endDate: change.endDate.toDate(),
    });
  }

  const handleSelectRange = (value: string) => {
    const range = ranges.find(r => r.value === value);
    if (range) {
      handleChange({
        startDate: moment(range.startDate),
        endDate: moment(range.endDate),
      });
    }
  }

  return (
    <Flex width={'500px'}>
      <Flex width={'200px'} alignItems={'center'} mr={3}>
        <Selector
          label="Date Range"
          initialValue={{ label: 'FY 2022', value: 'FY2022' }}
          onSelect={handleSelectRange}
          options={ranges}
        />
      </Flex>
      <Flex>
        <DateRangePicker
          startDate={value.startDate} // momentPropTypes.momentObj or null,
          startDateId={`${id}_start`} // PropTypes.string.isRequired,
          endDate={value.endDate} // momentPropTypes.momentObj or null,
          endDateId={`${id}_end`} // PropTypes.string.isRequired,
          onDatesChange={handleChange} // PropTypes.func.isRequired,
          focusedInput={focused} // PropTypes.bool
          onFocusChange={setFocused} // PropTypes.func.isRequired
          onClose={handleClose}
          isDayBlocked={() => false}
          isOutsideRange={() => false}
        />
      </Flex>
    </Flex>
  )
}

export default DateRangeSelector;