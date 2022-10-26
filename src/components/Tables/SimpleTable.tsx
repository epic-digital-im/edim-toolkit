import {
  Flex,
  Text,
  Box,
  useColorModeValue,
  Spinner,
  Switch
} from "@chakra-ui/react";

import React, { useMemo, useState, useEffect } from "react";

import {
  useTable,
  useRowSelect,
} from "react-table";

import { useColorPalette } from '@app/theme';

import useKeyPress from '../../hooks/useKeyPress';

export interface SimpleTableProps {
  columnsData: any[];
  columnStyle?: any;
  tableData: any[];
  isLoading?: boolean;
  fullHeight?: boolean;
  fixedHeader?: boolean;
  fixedFirstColumn?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selected: number[]) => void;
  renderHeader?: () => React.ReactNode;
}

export const SimpleTable = (props: SimpleTableProps) => {
  const {
    columnsData,
    columnStyle,
    tableData,
    isLoading,
    fullHeight,
    renderHeader,
    fixedHeader,
    fixedFirstColumn,
    selectable,
    onSelectionChange,
  } = props;

  const [data, setData] = useState<Parse.Object<Parse.Attributes>[]>([]);

  useEffect(() => {
    if (!isLoading) {
      setData(tableData);
    }
  }, [tableData, isLoading]);

  const [rowEditable, setRowEditable] = useState<{ [key: string]: boolean }>({});
  const columns = columnsData;

  useKeyPress("Escape", () => setRowEditable({}));

  const { textColor } = useColorPalette();
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const bgColor2 = useColorModeValue("white", "gray.700");

  const rowBg1 = useColorModeValue("gray.50", "gray.800");
  const rowBg2 = useColorModeValue("white", "gray.700");

  const defaultColumn = useMemo(
    () => ({
      width: 150,
    }),
    []
  );

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, title, checked, style, onChange }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])

      return (
        <Switch
          ref={resolvedRef}
          style={style}
          aria-label={title}
          isChecked={checked}
          onChange={onChange}
        />
      )
    }
  )


  // Use the state and functions returned from useTable to build your UI
  const {
    headerGroups,
    prepareRow,
    rows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    selectable ? useRowSelect : null,
    hooks => {
      if (selectable)
        return hooks.visibleColumns.push(columns => [
          // Let's make a column for selection
          {
            id: 'selection',
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
    }
  );

  const pageSize = data.length;

  if (selectable && onSelectionChange) {
    onSelectionChange(
      Object.keys(selectedRowIds || {}).map((k: string) => parseInt(k, 10))
    );
  }

  const tableWidth = headerGroups[0].headers.reduce((acc, val) => {
    const width = val.width as number || 100;
    acc += width;
    return acc;
  }, 0);

  return (
    <Box width={'100%'}>
      {renderHeader && renderHeader()}
      <Flex
        id="table-container"
        direction="column"
        w="100%"
        pb={'1.5rem'}
        borderColor={bgColor}
        borderWidth={1}
        borderStyle={'solid'}
        position={'relative'}>
        {isLoading && <Flex alignItems={'center'} justifyContent={'center'} height={'100%'} width={'100%'} position={'absolute'} top={0} left={0} zIndex={1000}>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Flex>}
        <Flex
          id="table-container"
          direction={'row'}
        >
          <Flex
            color="gray.500"
            mb="24px"
            display={'block'}
            position={'relative'}
            height={fullHeight ? 'auto' : 'calc(100vh - 300px)'}
            overflowY={'auto'}
            id="scroll-pane"
            borderWidth={"1px"}
            borderColor={rowBg2}
          >
            <Flex
              width={tableWidth}
              display="flex"
              flexDirection={"row"}
              position={fixedHeader ? 'sticky' : 'relative'}
              top={fixedHeader ? '0' : 'auto'}
              id="table-header-column-wrapper"
              zIndex={750}
            >
              <Flex
                width={"100%"}
                display="flex"
                flexDirection={"column"}
                position={'relative'}
                id="table-header-column-2"
              >
                {headerGroups.map((headerGroup, rowIndex) => {
                  const { key } = headerGroup.getHeaderGroupProps();
                  return (
                    <Flex
                      key={`${key}_${rowIndex}`}
                      display="flex"
                      flexDirection={"row"}
                    >
                      {headerGroup.headers.map((column, index) => {
                        const props = column.getHeaderProps();
                        let width: string | number = 100;
                        if (index === 0) {
                          width = (column.width) ? column.width : 250
                        } else {
                          width = (column.width) ? column.width : 100
                        }
                        const isFixeed = fixedFirstColumn && index === 0;

                        return (
                          <Flex
                            {...props}
                            display="flex"
                            flexDirection={"column"}
                            justifyContent="center"
                            alignItems={'center'}
                            pe="0px"
                            key={`${rowIndex}_${index}`}
                            style={columnStyle}
                            borderRightWidth={"1px"}
                            borderRightColor={rowBg2}
                            borderBottomWidth={"1px"}
                            borderBottomColor={rowBg2}
                            position={isFixeed ? "sticky" : "relative"}
                            left={isFixeed ? "0px" : "auto"}
                            width={width}
                            zIndex={isFixeed ? 750 : 1}
                            boxSizing={'border-box'}
                            backgroundColor={column.bgColor || rowBg1}
                          >

                            <Flex direction={'row'} justifyContent={'space-around'} width={'100%'}>
                              <Flex
                                justify="space-between"
                                align="center"
                              >
                                <Text fontSize={{ sm: '12px', md: '14px' }} color={textColor}>{column.render("Header")}</Text>
                              </Flex>
                            </Flex>
                          </Flex>
                        );
                      })}
                    </Flex>
                  )
                })}
              </Flex>
            </Flex>
            <Flex
              display="flex"
              flexDirection={"row"}
              position={'relative'}
              id="table-column-wrapper"
              width={tableWidth}
            >
              <Flex
                width={"100%"}
                display="flex"
                flexDirection={"column"}
                position={'relative'}
                id="table-column-2"
              >
                {rows.map((row, rowIndex) => {
                  prepareRow(row);
                  const { key } = row.getRowProps();
                  const objectId = (row.original._object) ? row.original._object.id : row.original.id;
                  const rowKey = `${rowIndex}_${key}_${objectId}`;
                  const isEditable = rowEditable[rowKey];
                  return (
                    <Flex
                      key={rowKey}
                      backgroundColor={rowIndex % 2 ? rowBg1 : rowBg2}
                      display="flex"
                      flexDirection={"row"}
                      borderTopWidth={"1px"}
                      borderTopColor={bgColor2}
                      overflow={'visible'}
                      zIndex={pageSize - rowIndex}
                    >
                      {row.cells.map((cell, index) => {
                        const { key } = cell.getCellProps()
                        const cellKey = `${key}_${row.original.objectId}`;
                        const isFixeed = fixedFirstColumn && index === 0;
                        let width: string | number = 100;
                        if (index === 0) {
                          width = (cell.column.width) ? cell.column.width : 250
                        } else {
                          width = (cell.column.width) ? cell.column.width : 100
                        }
                        return (
                          <Flex
                            key={cellKey}
                            display="flex"
                            flexDirection={"row"}
                            justifyContent="center"
                            alignItems="center"
                            fontSize={{ sm: "14px" }}
                            borderRightWidth={"1px"}
                            borderRightColor={bgColor2}
                            position={isFixeed ? "sticky" : "relative"}
                            left={isFixeed ? "0px" : "auto"}
                            width={width}
                            backgroundColor={rowIndex % 2 ? rowBg1 : rowBg2}
                            zIndex={isFixeed ? 10 : 1}
                            boxSizing={'border-box'}
                            padding={0}
                            paddingTop={2}
                            paddingBottom={2}
                            overflow={'visible'}
                            px={2}
                          >
                            {cell.render("Cell", {
                              editable: true,
                              rowEditable: Boolean(rowEditable[rowKey]),
                              setRowEditable: (shouldClear?: boolean) => {
                                if (shouldClear) {
                                  setRowEditable({});
                                } else {
                                  setRowEditable({ ...rowEditable, [rowKey]: !isEditable })
                                }
                              },
                            })}
                          </Flex>
                        );
                      })}
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
