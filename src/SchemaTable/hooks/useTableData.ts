import { useMemo } from 'react';
import getters from '@app/shared/utils/getters';

interface UseTableDataState {
  tableData: any[];
}

interface UseTableDataProps {
  data: any;
}

export const useTableData = ({ data }: UseTableDataProps): UseTableDataState => {

  const tableData = useMemo(() => {
    if (!data) return [];
    const d = data || [];
    const tableData = d.map((item) => {
      let raw = item.toJSON();
      raw = Object.keys(raw).reduce((acc, key) => {
        const v = raw[key];
        const className = v?.className;
        if (className) {
          const getter = getters(className);
          const label = getter.labelGetter(v);
          acc[key] = label;
        } else if (v && v.value) {
          acc[key] = v.value;
        } else if (v && v.iso) {
          acc[key] = v.iso;
        } else {
          acc[key] = v;
        }
        return acc;
      }, {});

      return {
        ...raw,
        _object: item,
      }
    });
    return tableData;
  }, [data]);

  return {
    tableData,
  }
}

export default useTableData;