import {
  Button,
  Flex,
  Icon,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  Box,
  Grid,
  GridItem,
  useDisclosure,
  useColorModeValue,
  IconButton,
  Spinner,
  useToast,
} from "@chakra-ui/react";

import React, { forwardRef, useMemo, useState, useRef, useEffect } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

import { matchSorter } from 'match-sorter';

import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowLeft,
  TiArrowRight,
  TiArrowUnsorted,
} from "react-icons/ti";

import { FiList, FiCreditCard, FiMap, FiRefreshCw } from "react-icons/fi";

import { AddIcon } from "@chakra-ui/icons";

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
  useFilters,
  useGroupBy,
  useExpanded,
  useRowSelect,
  useColumnOrder,
} from "react-table";

import FormDialog from '../components/FormDialog';

interface FitlerTableProps {
  history: any;
  columnsData: any[];
  columnStyle: any;
  showFilters?: boolean;
  title?: string;
  renderRowCard?: (row: any, index: number, initialState: any, onEdit: (item: Parse.Object<Parse.Attributes>) => void, onDelete: (item: Parse.Object<Parse.Attributes>) => void) => React.ReactNode | null;
  renderForm?: (initialValues: any, onClose?: () => void, refetch?: () => void) => React.ReactNode | null;
  renderHeader?: () => React.ReactNode | null;
  renderFilters?: () => React.ReactNode | null;
  isAdmin?: boolean;
  isPropertyDetail?: boolean;
  refetch?: () => void;
  tableData: any[];
  isLoading?: boolean;
  objectType?: string;
  queryKey: string;
  hidePaging?: boolean;
  hideSearch?: boolean;
  canReorder?: boolean;
  getMapItems?: (items: any[]) => any[];
  renderMap?: () => React.ReactNode | undefined;
  onColumnOrderChange?: (columnOrder: string[]) => void;
}

export const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef()
    const resolvedRef = ref || defaultRef

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

// Define a default UI for filtering
export function DefaultColumnFilter({
  column,
}) {
  const { header, filterValue, preFilteredRows, setFilter } = column;
  const count = preFilteredRows.length
  return (
    <Input
      width={'100%'}
      textAlign={'center'}
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={column.Header}
    />
  )
}

export function SelectColumnFilter({
  column: { Header, filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  try {
    const options = useMemo(() => {
      const options = new Set()
      preFilteredRows.forEach(row => {
        options.add(row.values[id])
      })
      return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
      <Select
        textAlign={'center'}
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">{Header}</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </Select>
    )
  } catch (err) {
    console.error(err)
    return null;
  }
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

const FitlerTable = (props: FitlerTableProps) => {
  const {
    columnsData,
    columnStyle,
    renderRowCard,
    showFilters,
    renderForm,
    renderHeader,
    renderFilters,
    title,
    isAdmin,
    isPropertyDetail,
    tableData,
    isLoading,
    objectType,
    refetch,
    queryKey,
    getMapItems,
    hidePaging,
    hideSearch,
    renderMap,
    onColumnOrderChange,
    canReorder,
  } = props;

  const toast = useToast();
  const [initialValues, setInitialValues] = useState<any>();
  const [data, setData] = useState<Parse.Object<Parse.Attributes>[]>([]);
  const [originalData] = useState(data);

  useEffect(() => {
    setData(tableData);
  }, [tableData, isLoading, queryKey]);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const skipResetRef = useRef(false)

  const skipReset = skipResetRef.current;

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  // const updateMyData = (rowIndex, columnId, value) => {
  //   // We also turn on the flag to not reset the page
  //   skipResetRef.current = true
  //   setData(old =>
  //     old.map((row, index) => {
  //       if (index === rowIndex) {
  //         return {
  //           ...row,
  //           [columnId]: value,
  //         }
  //       }
  //       return row
  //     })
  //   )
  // }

  // After data changes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  useEffect(() => {
    skipResetRef.current = false
  }, [data])

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => {
    // Don't reset the page when we do this
    skipResetRef.current = true
    setData(originalData)
  }

  const FormState = useDisclosure();
  const intialView = (renderRowCard) ? 'list' : 'table';
  const [viewType, setViewType] = useState(intialView);
  const columns = useMemo(() => columnsData, [columnsData]);

  // const data = useMemo(() => {
  //   if (isLoading) return [];
  //   return tableData.map((item: Parse.Object<Parse.Attributes>) => toJson(item));
  // }, [isLoading, query]);

  const textColor = useColorModeValue("gray.500", "white");
  const bgColor = useColorModeValue("gray.200", "gray.900");

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    skipResetRef.current = true
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = useMemo(
    () => ({
      width: 150,
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    setColumnOrder,
    visibleColumns,
    state: {
      pageIndex,
      pageSize,
      sortBy,
      groupBy,
      expanded,
      filters,
      selectedRowIds,
      columnOrder
    },
  } = useTable(
    {
      initialState: {
        pageIndex: 0,
        pageSize: 25,
      },
      columns,
      data,
      defaultColumn,
      filterTypes,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      refetch,
      isAdmin,
      isPropertyDetail,
      // We also need to pass this so the page doesn't change
      // when we edit the data.
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true,
    },
    useColumnOrder,
    useFilters,
    useGroupBy,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    // Here we will use a plugin to add our selection column
    hooks => {
      hooks.visibleColumns.push(columns => {
        return [
          // {
          //   width: 25,
          //   id: 'selection',
          //   // Make this column a groupByBoundary. This ensures that groupBy columns
          //   // are placed after it
          //   groupByBoundary: true,
          //   // The header can use the table's getToggleAllRowsSelectedProps method
          //   // to render a checkbox
          //   Header: ({ getToggleAllRowsSelectedProps }) => (
          //     <div>
          //       <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          //     </div>
          //   ),
          //   // The cell can use the individual row's getToggleRowSelectedProps method
          //   // to the render a checkbox
          //   Cell: ({ row }) => (
          //     <div>
          //       <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          //     </div>
          //   ),
          // },
          ...columns,
        ]
      })
    }
  );

  function shuffle(arr) {
    arr = [...arr]
    const shuffled = []
    while (arr.length) {
      const rand = Math.floor(Math.random() * arr.length)
      shuffled.push(arr.splice(rand, 1)[0])
    }
    return shuffled
  }

  const reorderColumn = (column: string, direction: number) => {
    const columns = visibleColumns.map(d => d.id);
    const order = [...columns].filter(d => d !== column);
    const itemIndex = columns.indexOf(column);
    order.splice(itemIndex + direction, 0, column);
    setColumnOrder(order);
    if (onColumnOrderChange) onColumnOrderChange(order);
  }

  const tableWidth = headerGroups[0].headers.reduce((acc, val) => {
    const width = val.width || 100;
    acc += width;
    return acc;
  }, 0);

  const createPages = (count) => {
    let arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };

  return (
    <Box width={'100%'}>
      {renderHeader && <Box p="12px 5px">
        {renderHeader()}
      </Box>}
      <Box>
        <Flex
          id="table-container"
          direction="column"
          w="100%"
          pb={'1.5rem'}
          borderColor={bgColor}
          borderWidth={1}
          borderStyle={'solid'}>
          <Box bg={bgColor} px={4}>
            {showFilters && (
              <Flex
                h={{ sm: 'auto', md: 16 }}
                alignItems={"center"}
                justifyContent={showFilters ? "space-between" : "flex-end"}
                position="relative"
                zIndex={1000}
                direction={{ sm: 'column', md: 'row' }}
              >
                <Flex direction={'row'} alignItems={"center"}>
                  {title && <Text color={textColor} fontWeight="bold" fontSize="lg" mr="1.5rem">
                    {title}
                  </Text>}
                  <Stack
                    direction={{ sm: "row", md: "row" }}
                    spacing={{ sm: "4px", md: "12px" }}
                    align="center"
                    me="12px"
                    my="24px"
                    minW={{ sm: "100px", md: "200px" }}
                  >
                    {!hidePaging && (<>
                      <Select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        color="gray.500"
                        size="sm"
                        borderRadius="12px"
                        maxW="75px"
                        cursor="pointer"
                        backgroundColor="white"
                      >
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                        <option>250</option>
                      </Select>
                      <Text fontSize="xs" color="gray.400" fontWeight="normal">
                        entries per page
                      </Text>
                    </>)
                    }
                    {isAdmin && renderFilters && renderFilters()}
                  </Stack>
                </Flex>
                <Box position={'relative'} zIndex={1}>
                  <Flex alignItems={"center"}>
                    {refetch && <IconButton
                      size={"md"}
                      icon={<Icon as={FiRefreshCw} />}
                      onClick={() => refetch()}
                      aria-label={"Refresh"}
                      mx={'0.5rem'}
                    />}
                    {!hideSearch && <Input
                      type="text"
                      placeholder="Search..."
                      minW="75px"
                      maxW="175px"
                      fontSize="sm"
                      _focus={{ borderColor: "qcmidnight.400" }}
                      backgroundColor="white"
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      mx={'0.5rem'}
                    />}
                    {renderRowCard && <IconButton
                      size={"md"}
                      icon={<Icon as={FiCreditCard} />}
                      onClick={() => setViewType("list")}
                      aria-label={"View List"}
                      mx={'0.5rem'}
                    />}
                    {renderRowCard && <IconButton
                      size={"md"}
                      icon={<Icon as={FiList} />}
                      onClick={() => setViewType("table")}
                      aria-label={"View Table"}
                      mx={'0.5rem'}
                    />}
                    {renderMap && <IconButton
                      size={"md"}
                      icon={<Icon as={FiMap} />}
                      onClick={() => setViewType("map")}
                      aria-label={"View Map"}
                      mx={'0.5rem'}
                    />}
                    {isAdmin && renderForm && <Button
                      disabled={FormState.isOpen}
                      variant={"solid"}
                      colorScheme={"teal"}
                      size={"sm"}
                      mx={'0.5rem'}
                      leftIcon={<AddIcon />}
                      onClick={FormState.onOpen}
                    >
                      {`Add ${objectType}`}
                    </Button>}
                  </Flex>
                </Box>
              </Flex>
            )}
          </Box>
          <Flex justify="space-between" align="center" w="100%" px="22px"></Flex>
          {isLoading ? (
            <Flex alignItems={'center'} justifyContent={'center'} height={'100px'} width={'100%'}>
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
              />
            </Flex>
          ) : (
            <Flex
              id="table-container"
              direction={'row'}
            >
              {renderMap && viewType === "map" && (
                <Box width={'100%'}>
                  {renderMap(data)}
                </Box>
              )}
              {renderRowCard && viewType === "list" && (
                <Grid
                  width={"100%"}
                  gap={6}
                  p={'1.5rem'}
                  templateColumns={{ sm: "1fr", lg: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }}
                  templateRows={{ md: "repeat(1, 1fr)" }}>
                  {page.map((row: any, index: number) => {
                    prepareRow(row);
                    const objectId = row.original.id;
                    const initialState = tableData.find((p: any) => {
                      return p.id === objectId
                    });
                    const handleEdit = () => {
                      setInitialValues(row.original);
                      FormState.onOpen();
                    }
                    const handleDelete = () => {
                      const item = tableData.find(i => i.id === objectId);
                      item?._object?.destroy().then(() => {
                        if (refetch) refetch();
                        toast({
                          title: `${objectId} deleted`,
                          status: 'success',
                          duration: 5000,
                          isClosable: true,
                        });
                      }).catch((err) => {
                        toast({
                          title: `ERROR: ${err.message}`,
                          status: 'error',
                          duration: 5000,
                          isClosable: true,
                        });
                      })
                    }
                    return (
                      <GridItem key={row.original.id}>
                        {renderRowCard(row, index, initialState, handleEdit, handleDelete)}
                      </GridItem>
                    );
                  })}
                </Grid>
              )}
              {viewType === "table" && (
                <Flex
                  color="gray.500"
                  mb="24px"
                  display={'block'}
                  position={'relative'}
                  height={'calc(100vh - 375px)'}
                  overflowY={'auto'}
                  id="scroll-pane"
                  borderWidth={"1px"}
                  borderColor={"gray.200"}
                >
                  <Flex
                    width={tableWidth}
                    display="flex"
                    flexDirection={"row"}
                    position={'sticky'}
                    top={'0'}
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
                                  borderRightColor={"gray.200"}
                                  borderBottomWidth={"1px"}
                                  borderBottomColor={"gray.200"}
                                  position={index === 0 ? "sticky" : "relative"}
                                  left={index === 0 ? "0px" : "auto"}
                                  width={width}
                                  zIndex={index === 0 ? 750 : 1}
                                  height={'50px'}
                                  boxSizing={'border-box'}
                                  backgroundColor={column.bgColor || 'white'}
                                >
                                  {(column.canFilter && column.Filter) ? column.render('Filter') : (
                                    <Flex direction={'row'} justifyContent={canReorder ? 'space-between' : 'space-around'} width={'100%'}>
                                      {canReorder && <Icon as={TiArrowLeft} onClick={() => reorderColumn(column.id, -1)} />}
                                      <Flex
                                        justify="space-between"
                                        align="center"
                                        fontSize={{ sm: "10px", lg: "12px" }}
                                        textTransform={"uppercase"}
                                        color="gray.400"
                                        {...column.getSortByToggleProps()}
                                      >
                                        <Box textColor={"gray.900"} textAlign={'center'}>{column.render("Header")}</Box>
                                        <Icon
                                          w={{ sm: "10px", md: "14px" }}
                                          h={{ sm: "10px", md: "14px" }}
                                          color={"gray.900"}
                                          fontWeight={column.isSorted ? "900" : "400"}
                                          float="right"
                                          as={
                                            column.isSorted
                                              ? column.isSortedDesc
                                                ? TiArrowSortedDown
                                                : TiArrowSortedUp
                                              : TiArrowUnsorted
                                          }
                                        />
                                      </Flex>
                                      {canReorder && <Icon as={TiArrowRight} onClick={() => reorderColumn(column.id, 1)} />}
                                    </Flex>
                                  )}
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
                      {page.map((row, rowIndex) => {
                        prepareRow(row);
                        const { key } = row.getRowProps();
                        const rowKey = `${key}_${row.original.id}`;
                        return (
                          <Flex
                            key={`${rowIndex}_${rowKey}`}
                            backgroundColor={rowIndex % 2 ? "gray.50" : "white"}
                            display="flex"
                            flexDirection={"row"}
                            borderTopWidth={"1px"}
                            borderTopColor={"gray.200"}
                            overflow={'visible'}
                            zIndex={pageSize - rowIndex}
                          >
                            {row.cells.map((cell, index) => {
                              const { key } = cell.getCellProps()
                              const cellKey = `${key}_${row.original.objectId}`;
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
                                  borderRightColor={"gray.200"}
                                  position={index === 0 ? "sticky" : "relative"}
                                  left={index === 0 ? "0px" : "auto"}
                                  width={width}
                                  backgroundColor={rowIndex % 2 ? "gray.50" : "white"}
                                  zIndex={index === 0 ? 10 : 1}
                                  boxSizing={'border-box'}
                                  padding={0}
                                  paddingTop={2}
                                  paddingBottom={2}
                                  overflow={'visible'}
                                >
                                  {cell.render("Cell", { editable: true })}
                                </Flex>
                              );
                            })}
                          </Flex>
                        );
                      })}
                    </Flex>
                  </Flex>
                </Flex>
              )}
            </Flex>)}
          {showFilters && (
            <Flex
              direction={{ sm: "column", md: "row" }}
              justify="space-between"
              align="center"
              px="22px"
              w="100%"
              px={{ md: "22px" }}
            >
              <Text
                fontSize="sm"
                color="gray.500"
                fontWeight="normal"
                mb={{ sm: "24px", md: "0px" }}
              >
                Showing {pageSize * pageIndex + 1} to{" "}
                {pageSize * (pageIndex + 1) <= tableData.length
                  ? pageSize * (pageIndex + 1)
                  : tableData.length}{" "}
                of {tableData.length} entries
              </Text>
              <Stack direction="row" alignSelf="flex-end" spacing="4px" ms="auto">
                <Button
                  variant="no-hover"
                  onClick={() => previousPage()}
                  transition="all .5s ease"
                  w="40px"
                  h="40px"
                  borderRadius="50%"
                  bg="#fff"
                  border="1px solid lightgray"
                  disabled={!canPreviousPage}
                  _hover={{
                    bg: "gray.200",
                    opacity: "0.7",
                    borderColor: "gray.500",
                  }}
                >
                  <Icon as={GrFormPrevious} w="16px" h="16px" color="gray.400" />
                </Button>
                {pageSize === 5 ? (
                  <NumberInput
                    max={pageCount - 1}
                    min={1}
                    w="75px"
                    mx="6px"
                    defaultValue="1"
                    onChange={(e) => gotoPage(e)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper onClick={() => nextPage()} />
                      <NumberDecrementStepper onClick={() => previousPage()} />
                    </NumberInputStepper>
                  </NumberInput>
                ) : (
                  createPages(pageCount).map((pageNumber, index) => {
                    return (
                      <Button
                        variant="no-hover"
                        transition="all .5s ease"
                        onClick={() => gotoPage(pageNumber - 1)}
                        w="40px"
                        h="40px"
                        borderRadius="160px"
                        bg={pageNumber === pageIndex + 1 ? "qcmidnight.400" : "#fff"}
                        border="1px solid lightgray"
                        _hover={{
                          bg: "gray.200",
                          opacity: "0.7",
                          borderColor: "gray.500",
                        }}
                        key={`${pageNumber}_${index}`}
                      >
                        <Text
                          fontSize="xs"
                          color={
                            pageNumber === pageIndex + 1 ? "#fff" : "gray.600"
                          }
                        >
                          {pageNumber}
                        </Text>
                      </Button>
                    );
                  })
                )}
                <Button
                  variant="no-hover"
                  onClick={() => nextPage()}
                  transition="all .5s ease"
                  w="40px"
                  h="40px"
                  borderRadius="160px"
                  bg="#fff"
                  border="1px solid lightgray"
                  disabled={!canNextPage}
                  _hover={{
                    bg: "gray.200",
                    opacity: "0.7",
                    borderColor: "gray.500",
                  }}
                >
                  <Icon as={GrFormNext} w="16px" h="16px" color="gray.400" />
                </Button>
              </Stack>
            </Flex>
          )}
        </Flex>
      </Box>
      {
        renderForm && <FormDialog
          isOpen={FormState.isOpen}
          onClose={() => {
            FormState.onClose();
            setInitialValues(undefined);
          }}
          onOpen={FormState.onOpen}
          objectClass={objectType}
          initialValues={initialValues}
          renderForm={() => renderForm(
            initialValues,
            () => {
              FormState.onClose();
              setInitialValues(undefined);
            },
            refetch,
          )}
        />
      }
    </Box>
  );
}

export default FitlerTable;
