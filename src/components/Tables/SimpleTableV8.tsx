import React, { FC, Children, ReactNode } from 'react';

import {
  Flex,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
} from '@chakra-ui/react';

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

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'

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

const defaultColumns: ColumnDef<Person>[] = [
  {
    id: "name",
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      },
    ],
  },
  {
    id: "info",
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: props => props.column.id,
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: props => props.column.id,
          },
        ],
      },
    ],
  },
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
  return [...columnOrder]
}

const DraggableColumnHeader: FC<{
  header: HeaderType<Person, unknown>
  table: TableType<Person>,
  columnResizeMode: string,
}> = ({ header, table, columnResizeMode }) => {
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
  })

  return (
    <Th
      ref={dropRef}
      colSpan={header.colSpan}
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: header.getSize(),
      }}
    >
      <Box ref={previewRef}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <Box
          {...{
            onMouseDown: header.getResizeHandler(),
            onTouchStart: header.getResizeHandler(),
            className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
              }`,
            style: {
              transform:
                columnResizeMode === 'onEnd' &&
                  header.column.getIsResizing()
                  ? `translateX(${table.getState().columnSizingInfo.deltaOffset
                  }px)`
                  : '',
            },
          }}
        />
        <Button ref={dragRef}>🟰</Button>
      </Box>
    </Th>
  )
}

const ColumnHeader: FC<{
  header: HeaderType<Person, unknown>,
  table: TableType<Person>,
  columnResizeMode: string,
}> = ({ header, table, columnResizeMode }) => {
  return (
    <Th
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
          header.column.columnDef.header,
          header.getContext()
        )}
      <Box
        {...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
            }`,
          style: {
            transform:
              columnResizeMode === 'onEnd' &&
                header.column.getIsResizing()
                ? `translateX(${table.getState().columnSizingInfo.deltaOffset
                }px)`
                : '',
          },
        }}
      />
    </Th>
  )
}

export interface SimpleTableV8Props {
  objectClass?: string;
}

export const SimpleTableV8: React.FC<SimpleTableV8Props> = ({ }) => {
  const [data, setData] = React.useState(() => [...defaultData])
  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns])

  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>('onChange')

  const rerender = React.useReducer(() => ({}), {})[1]

  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    columns.map(column => column.id as string)
  )

  console.log(columns)

  const regenerateData = () => setData(() => makeData(20))

  const resetOrder = () => setColumnOrder(columns.map(column => column.id as string))

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
  })

  console.log(columnOrder);

  return (
    <Box className="p-2">
      <select
        value={columnResizeMode}
        onChange={e => setColumnResizeMode(e.target.value as ColumnResizeMode)}
        className="border p-2 border-black rounded"
      >
        <option value="onEnd">Resize: "onEnd"</option>
        <option value="onChange">Resize: "onChange"</option>
      </select>

      <Table
        {...{
          style: {
            width: table.getCenterTotalSize(),
          },
        }}
      >
        <Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <DraggableColumnHeader
                  key={header.id}
                  header={header}
                  table={table}
                  columnResizeMode={columnResizeMode}
                />
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map(row => (
            <Tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <Td
                  {...{
                    key: cell.id,
                    style: {
                      width: cell.column.getSize(),
                    },
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button onClick={() => rerender()} className="border p-2">
        Rerender
      </Button>
      <pre>
        {JSON.stringify(
          {
            columnSizing: table.getState().columnSizing,
            columnSizingInfo: table.getState().columnSizingInfo,
          },
          null,
          2
        )}
      </pre>
    </Box>
  )
}

const SimpleTableV8DND: React.FC<SimpleTableV8Props> = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <SimpleTableV8 {...props} />
    </DndProvider>
  )
}

export default SimpleTableV8DND;