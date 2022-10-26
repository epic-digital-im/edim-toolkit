import {
  Flex,
  Box,
  useColorModeValue,
  Spinner,
  Switch,
  IconButton,
} from "@chakra-ui/react";

import React, { FC, useState, HTMLProps, useMemo } from "react";

import {
  Column,
  ColumnDef,
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  Header as HeaderType,
  Table as TableType,
  useReactTable,
  ColumnResizeMode,
} from '@tanstack/react-table'

import { DragHandleIcon } from '@chakra-ui/icons'

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useColorPalette } from '@app/theme';

import useKeyPress from '../../hooks/useKeyPress';

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

function IndeterminateCheckbox({
  indeterminate,
  title,
  checked,
  style,
  onChange,
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <Switch
      ref={ref}
      style={style}
      aria-label={title}
      isChecked={checked}
      onChange={onChange}
    />
  )
}

const defaultColumns: ColumnDef<Person>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    id: 'id',
    accessorKey: 'objectId',
    cell: info => info.getValue(),
    footer: props => props.column.id,
    size: 300
  },
  {
    id: 'title',
    accessorFn: row => row.title || null,
    cell: info => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: props => props.column.id,
    size: 300,
  },
  {
    id: 'description',
    accessorFn: row => row.description || null,
    cell: info => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: props => props.column.id,
    size: 300,
  },
  // {
  //   id: 'visits',
  //   accessorKey: 'visits',
  //   header: () => <span>Visits</span>,
  //   footer: props => props.column.id,
  // },
  // {
  //   id: 'status',
  //   accessorKey: 'status',
  //   header: 'Status',
  //   footer: props => props.column.id,
  // },
  // {
  //   id: 'progress',
  //   accessorKey: 'progress',
  //   header: 'Profile Progress',
  //   footer: props => props.column.id,
  // },
]

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  )
  return [...columnOrder];
}

const DraggableColumnHeader: FC<{
  header: HeaderType<Person, unknown>
  table: TableType<Person>,
  columnResizeMode: string,
  isFixed: boolean,
}> = ({ header, table, columnResizeMode, isFixed }) => {
  const { getState, setColumnOrder } = table
  const { columnOrder } = getState()
  const { column } = header

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<Person>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      )
      setColumnOrder(newColumnOrder)
    },
  })

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  });

  const rowBg1 = useColorModeValue("gray.50", "gray.800");
  const rowBg2 = useColorModeValue("white", "gray.700");

  return (
    <Flex
      ref={dropRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: header.getSize(),
      }}
      {...{
        key: header.id,
        style: {
          width: header.getSize(),
        },
      }}
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems={'center'}
      pe="0px"
      borderRightWidth={"1px"}
      borderRightColor={rowBg2}
      borderBottomWidth={"1px"}
      borderBottomColor={rowBg2}
      position={isFixed ? "sticky" : "relative"}
      left={isFixed ? "0px" : "auto"}
      width={header.getSize()}
      zIndex={isFixed ? 750 : 1}
      boxSizing={'border-box'}
      backgroundColor={rowBg1}
    >
      <Flex ref={previewRef} direction={'row'} justifyContent={'space-around'} width={'100%'}>
        <Flex
          justify="space-between"
          align="center"
        >
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
          <Box
            {...{
              onMouseDown: header.getResizeHandler(),
              onTouchStart: header.getResizeHandler(),
              className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
              style: {
                transform:
                  columnResizeMode === 'onEnd' &&
                    header.column.getIsResizing()
                    ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
                    : '',
              },
            }}
          />
          <IconButton
            cursor={'grab'}
            background={'transparent'}
            size={'sm'}
            aria-label="move"
            icon={<DragHandleIcon />}
            ref={dragRef} />
        </Flex>
      </Flex>
    </Flex>
  )
}

const ColumnFooter: FC<{
  header: HeaderType<Person, unknown>,
  table: TableType<Person>,
}> = ({ header, table, }) => {
  return (
    <Flex
      {...{
        key: header.id,
        colSpan: header.colSpan,
        style: {
          width: header.getSize(),
        },
      }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(
          header.column.columnDef.footer,
          header.getContext()
        )}
    </Flex>
  )
}

export interface ControlledTableProps {
  data: any[];
  columns: ColumnDef<any>[];
  columnStyle?: any;
  isLoading?: boolean;
  fullHeight?: boolean;
  fixedHeader?: boolean;
  fixedFirstColumn?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selected: number[]) => void;
  renderHeader?: () => React.ReactNode;
}

export const ControlledTableComponent = (props: ControlledTableProps) => {
  const {
    data,
    columnStyle,
    isLoading,
    fullHeight,
    renderHeader,
    fixedHeader,
    fixedFirstColumn,
    selectable,
    onSelectionChange,
  } = props;

  console.log(props);

  const [rowSelection, setRowSelection] = React.useState({})
  const [rowsEditable, setRowsEditable] = useState<{ [key: string]: boolean }>({});

  useKeyPress("Escape", () => setRowsEditable({}));

  const bgColor = useColorModeValue("gray.100", "gray.800");
  const bgColor2 = useColorModeValue("white", "gray.700");

  const rowBg1 = useColorModeValue("gray.50", "gray.800");
  const rowBg2 = useColorModeValue("white", "gray.700");

  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>('onEnd');

  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    ['select', ...props.columns.map(column => column.id as string)]
  );

  if (onSelectionChange) {
    onSelectionChange(Object.keys(rowSelection).map(key => parseInt(key)));
  }

  const columns = useMemo(() => {
    const cols: any[] = [];
    if (selectable) {
      cols.push(
        {
          id: 'select',
          header: ({ table }) => (
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          ),
          cell: ({ row }) => (
            <div className="px-1">
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            </div>
          ),
        }
      );
      return [...cols, ...props.columns].map((col) => ({
        ...col,
        columnStyle,
        rowEditable: (row) => rowsEditable[row.id],
        setRowEditable: (row, shouldReset?: boolean) => {
          if (shouldReset) {
            setRowsEditable({});
          } else {
            setRowsEditable({ ...rowsEditable, [row.id]: true })
          }
        },
      }));
    }, [props.columns, selectable]);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      rowsEditable,
      columnOrder,
      rowSelection,
    },
    onColumnOrderChange: setColumnOrder,
    setRowsEditable,
  });

  const pageSize = data.length;
  const tableWidth = table.getCenterTotalSize();

  console.log({
    rowSelection,
    columnOrder,
    columnSizing: table.options.state.columnSizing,
  });

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
                {table.getHeaderGroups().map(headerGroup => (
                  <Flex
                    key={headerGroup.id}
                    display="flex"
                    flexDirection={"row"}
                  >
                    {headerGroup.headers.map((header, index) => {
                      return (
                        <DraggableColumnHeader
                          key={header.id}
                          header={header}
                          table={table}
                          columnResizeMode={columnResizeMode}
                          isFixed={fixedFirstColumn && index === 0}
                        />
                      )
                    })}
                  </Flex>
                )
                )}
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
                {table.getRowModel().rows.map((row, rowIndex) => {
                  return (
                    <Flex
                      key={row.id}
                      backgroundColor={rowIndex % 2 ? rowBg1 : rowBg2}
                      display="flex"
                      flexDirection={"row"}
                      borderTopWidth={"1px"}
                      borderTopColor={bgColor2}
                      overflow={'visible'}
                      zIndex={pageSize - rowIndex}
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        const isFixed = fixedFirstColumn && index === 0;
                        return (
                          <Flex
                            {...{
                              key: cell.id,
                              style: {
                                width: cell.column.getSize(),
                              },
                            }}
                            display="flex"
                            flexDirection={"row"}
                            justifyContent="center"
                            alignItems="center"
                            fontSize={{ sm: "14px" }}
                            borderRightWidth={"1px"}
                            borderRightColor={bgColor2}
                            position={isFixed ? "sticky" : "relative"}
                            left={isFixed ? "0px" : "auto"}
                            backgroundColor={rowIndex % 2 ? rowBg1 : rowBg2}
                            zIndex={isFixed ? 10 : 1}
                            boxSizing={'border-box'}
                            padding={0}
                            paddingTop={2}
                            paddingBottom={2}
                            overflow={'visible'}
                            px={2}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Flex>
                        );
                      })}
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
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
                {table.getFooterGroups().map(footerGroup => (
                  <Flex
                    key={footerGroup.id}
                    display="flex"
                    flexDirection={"row"}
                  >
                    {footerGroup.headers.map(header => (
                      <ColumnFooter
                        key={header.id}
                        header={header}
                        table={table}
                      />
                    ))}
                  </Flex>
                )
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export const ControlledTable: React.FC<ControlledTableProps> = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ControlledTableComponent {...props} />
    </DndProvider>
  )
}

export default ControlledTable;