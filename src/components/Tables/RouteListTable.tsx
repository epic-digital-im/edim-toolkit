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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  IconButton,
  useColorModeValue,
  Spinner,
  useToast,
} from "@chakra-ui/react";

import { Fragment, useMemo, useEffect } from "react";

import { GrFormNext, GrFormPrevious } from "react-icons/gr";

import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti";

import { ArrowForwardIcon, ArrowDownIcon } from "@chakra-ui/icons";

import {
  useExpanded,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQuery, QueryClient } from "react-query";

import { weekdayList } from "@app/shared/types";

import RunnerSearchSelector from "../RunnerSearchSelector";
import LoadingOverlay from "../LoadingOverlay";

import {
  fetchProperties,
  fetchRoute,
  fetchRoutes,
  fetchRunners,
  fetchTasks,
} from "../../services/serviceApi";

import { useContainer as useRoutes } from "../../store/events";

import { secondsToTime, metersToMiles } from "@app/shared/utils/units";

import { setRouteRunner } from "../../services/serviceApi";

import TaskMap from "../../views/Admin/Routes/TaskMap";

const daylist = [
  "",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function nextWeekdayDate(date, weekday) {
  const day_in_week = daylist.indexOf(weekday);
  var ret = new Date(date || new Date());
  ret.setDate(ret.getDate() + ((day_in_week - 1 - ret.getDay() + 7) % 7) + 1);
  return ret;
}

function getFormattedDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month < 10 && day < 10) {
    return `0${month}/0${day}`;
  } else if (month < 10) {
    return `0${month}/${day}`;
  } else if (day < 10) {
    return `${month}/0${day}`;
  } else {
    return `${month}/${day}`;
  }
}

const RouteRow = ({ row, index, visibleColumns, runners, properties }) => {
  const weekday = row.original.weekday;

  const serviceDate = nextWeekdayDate(new Date(), weekday);
  const isoDate = serviceDate.toISOString().split("T");
  const dateString = isoDate[0].split("-");

  const formattedDate = getFormattedDate(serviceDate);

  const runnerProp = `${weekday.toLowerCase()}_runner`;
  const runnerId = row.original[runnerProp] && row.original[runnerProp][0];

  const [runner, setRunner] = useState(runners.find((r) => r.id === runnerId));
  const [expanded, setExpanded] = useState(false);
  const [fetching, setFetching] = useState(false);

  const { optimizeRoute, publishRoute } = useRoutes();

  const toast = useToast();

  const RouteRequest = useQuery(
    `route_${row.original.id}`,
    fetchRoute(row.original.id)
  );

  const route = RouteRequest.data || {};
  const routeId = route.id;
  const routeName = route.name;

  useEffect(() => {
    const weekday = row.original.weekday;
    const runnerProp = `${weekday.toLowerCase()}_runner`;
    const runnerId = route[runnerProp] && route[runnerProp][0];
    setRunner(runners.find((r) => r.id === runnerId));
    return () => { };
  }, [runnerId, route, runners]);

  const optimized =
    (RouteRequest.data &&
      RouteRequest.data[`${weekday.toLowerCase()}_route`]) ||
    {};

  const TasksRequest = useQuery(`tasks_${routeName}`, fetchTasks(routeName));

  const tasks = TasksRequest.data || [];

  const dayTasks =
    (tasks &&
      tasks.filter &&
      tasks.filter((t) => {
        if (!t) console.log(row);
        return t && t.weekday === weekday;
      })) ||
    [];

  // const OptimizedRequest = useQuery(
  //   `${routeId}-${weekday}-${runner && runner.id}`,
  //   optimizeRoute(route, dayTasks, weekday, RouteRequest.refetch, optimized),
  //   {
  //     enabled: dayTasks.length > 0,
  //   }
  // );

  const isLoading = RouteRequest.isLoading || TasksRequest.isLoading;
  // OptimizedRequest.isLoading;

  const handleUpdateRunner = (routeId, runnerId, weekday) => {
    setFetching(true);
    setRouteRunner(routeId, runnerId, weekday)
      .then(() => {
        const newRunner = runners.find((r) => r.id === runnerId);
        console.log(newRunner);
        setRunner(newRunner);
        setFetching(false);
        // OptimizedRequest.refetch();
        RouteRequest.refetch();
      })
      .catch(() => {
        setFetching(false);
      });
  };

  const handlePublishRoute = (
    route,
    // optimizedRoute,
    cellWeekday
  ) => () => {
    setFetching(true);

    publishRoute(
      route,
      dayTasks,
      cellWeekday,
      serviceDate,
      formattedDate,
      properties
    )
      .then(() => {
        setFetching(false);
        toast({
          title: "Route Published Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        setFetching(false);
        toast({
          title: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <Fragment key={index}>
      <Tr {...row.getRowProps()} key={index}>
        {row.cells.map((cell, index) => {
          // if (cell.column.id === "loading") {
          //   return (
          //     <Td
          //       {...cell.getCellProps()}
          //       fontSize={{ sm: "14px" }}
          //       key={index}
          //     >
          //       {isLoading && (
          //         <Spinner
          //           thickness="4px"
          //           speed="0.65s"
          //           emptyColor="gray.200"
          //           color="blue.500"
          //           size="md"
          //         />
          //       )}
          //     </Td>
          //   );
          // }
          if (cell.column.id === "date") {
            return (
              <Td
                {...cell.getCellProps()}
                fontSize={{ sm: "14px" }}
                key={index}
              >
                {formattedDate}
              </Td>
            );
          }
          if (cell.column.id === "stops") {
            return (
              <Td
                {...cell.getCellProps()}
                fontSize={{ sm: "14px" }}
                key={index}
              >
                {dayTasks.length || null}
              </Td>
            );
          }
          // if (cell.column.id === "time") {
          //   return (
          //     <Td
          //       {...cell.getCellProps()}
          //       fontSize={{ sm: "14px" }}
          //       key={index}
          //     >
          //       {dayTasks.length > 0 &&
          //         optimized.time &&
          //         secondsToTime(optimized.time)}
          //     </Td>
          //   );
          // }
          // if (cell.column.id === "distance") {
          //   return (
          //     <Td
          //       {...cell.getCellProps()}
          //       fontSize={{ sm: "14px" }}
          //       key={index}
          //     >
          //       {dayTasks.length > 0 && optimized.distance && (
          //         <span>{metersToMiles(optimized.distance)} miles</span>
          //       )}
          //     </Td>
          //   );
          // }
          if (cell.column.id === "runner") {
            const initialValue = runner
              ? { value: runner.id, label: runner.name }
              : { value: null, label: "" };
            return (
              <Td
                {...cell.getCellProps()}
                fontSize={{ sm: "14px" }}
                key={index}
              >
                <RunnerSearchSelector
                  isLoading={fetching}
                  isDisabled={fetching}
                  initialValue={initialValue}
                  runners={runners}
                  onChange={(runnerId) =>
                    handleUpdateRunner(routeId, parseInt(runnerId, 10), weekday)
                  }
                />
              </Td>
            );
          }
          if (cell.column.id === "actions") {
            const cellWeekday = row.original.weekday;
            // const optimizedRoute = OptimizedRequest.data;
            return (
              <Td
                {...cell.getCellProps()}
                fontSize={{ sm: "14px" }}
                key={index}
              >
                <Flex direction={"row"}>
                  {isLoading && (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="md"
                    />
                  )}
                  {!isLoading && dayTasks.length > 0 && (
                    <Button
                      isLoading={fetching}
                      onClick={handlePublishRoute(
                        route,
                        // optimizedRoute,
                        cellWeekday
                      )}
                    >
                      Publish
                    </Button>
                  )}
                </Flex>
              </Td>
            );
          }
          return (
            <Td {...cell.getCellProps()} fontSize={{ sm: "14px" }} key={index}>
              {cell.render("Cell")}
            </Td>
          );
        })}
      </Tr>
      {row.isExpanded ? (
        <tr>
          <td colSpan={visibleColumns.length}>
            {dayTasks.length > 0 && (
              <TaskMap route={route} tasks={dayTasks} optimized={null} />
            )}
          </td>
        </tr>
      ) : null}
    </Fragment>
  );
};

const RouteTable = ({ data, columns, runners, properties }) => {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    gotoPage,
    pageCount,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setPageSize,
    setGlobalFilter,
    state,
    visibleColumns,
  } = tableInstance;

  const createPages = (count) => {
    let arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <>
      <Flex
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex justify="space-between" align="center" w="100%" px="22px">
          <Stack
            direction={{ sm: "column", md: "row" }}
            spacing={{ sm: "4px", md: "12px" }}
            align="center"
            me="12px"
            my="24px"
            minW={{ sm: "100px", md: "200px" }}
          >
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              color="gray.500"
              size="sm"
              borderRadius="12px"
              maxW="75px"
              cursor="pointer"
            >
              <option>100</option>
              <option>100</option>
              <option>150</option>
              <option>200</option>
              <option>250</option>
            </Select>
            <Text fontSize="xs" color="gray.400" fontWeight="normal">
              entries per page
            </Text>
          </Stack>
          <Input
            type="text"
            placeholder="Search..."
            minW="75px"
            maxW="175px"
            fontSize="sm"
            _focus={{ borderColor: "qcmidnight.400" }}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </Flex>
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="0px"
                    key={index}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("Header")}
                      <Icon
                        w={{ sm: "10px", md: "14px" }}
                        h={{ sm: "10px", md: "14px" }}
                        color={columns.isSorted ? "gray.500" : "gray.400"}
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
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <RouteRow
                  row={row}
                  index={index}
                  visibleColumns={visibleColumns}
                  runners={runners}
                  properties={properties}
                />
              );
            })}
          </Tbody>
        </Table>
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
            {pageSize * (pageIndex + 1) <= data.length
              ? pageSize * (pageIndex + 1)
              : data.length}{" "}
            of {data.length} entries
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
              display={
                pageSize === 5 ? "none" : canPreviousPage ? "flex" : "none"
              }
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
                    key={index}
                  >
                    <Text
                      fontSize="xs"
                      color={pageNumber === pageIndex + 1 ? "#fff" : "gray.600"}
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
              display={pageSize === 5 ? "none" : canNextPage ? "flex" : "none"}
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
      </Flex>
    </>
  );
};

function RouteListTable() {
  const { weekday, route, optimizeRoute } = useRoutes();
  const PropertiesRequest = useQuery("properties", () => fetchProperties());

  const RouteRequest = useQuery("routes", () => fetchRoutes());
  const RunnerRequest = useQuery("runners", () => fetchRunners());
  const textColor = useColorModeValue("gray.700", "white");

  const routeData = RouteRequest.data || [];
  const runnerData = RunnerRequest.data || [];
  const properties = PropertiesRequest.data || [];

  const isLoading =
    PropertiesRequest.isLoading ||
    RouteRequest.isLoading ||
    RunnerRequest.isLoading;

  const data = useMemo(() => {
    if (RouteRequest.data) {
      return RouteRequest.data
        .reduce((acc, val) => {
          weekdayList.forEach((w) => {
            acc.push({
              ...val,
              weekday: w,
            });
          });
          return acc;
        }, [])
        .filter((r) => {
          if (weekday === "ALL") return true;
          return r.weekday === weekday;
        })
        .filter((r) => {
          if (!route) return true;
          if (route && route.name === "ALL") return true;
          return r.name === route.name;
        });
    }
  }, [routeData, route, weekday]);

  const columns = [
    {
      // Make an expander cell
      Header: () => null, // No header
      id: "expander", // It needs an ID
      Cell: ({ row }) => (
        // Use Cell to render an expander for each row.
        // We can use the getToggleRowExpandedProps prop-getter
        // to build the expander.
        <IconButton
          {...row.getToggleRowExpandedProps()}
          aria-label="Search database"
          icon={row.isExpanded ? <ArrowDownIcon /> : <ArrowForwardIcon />}
        />
      ),
    },
    // {
    //   Header: "ID",
    //   accessor: "id",
    //   Cell: ({ cell, row }) => (
    //     <NavLink to={`/admin/route/${cell.value}`}>{cell.value}</NavLink>
    //   ),
    // },
    {
      Header: "WEEKDAY",
      accessor: "weekday",
      filter: "includes",
    },
    {
      Header: "DATE",
      accessor: "date",
    },
    {
      Header: "NAME",
      accessor: "name",
    },
    // {
    //   Header: "ZONE",
    //   accessor: "zone_id",
    // },
    {
      Header: "STOPS",
      accessor: "stops",
    },
    {
      Header: "RUNNER",
      accessor: "runner",
    },
    // {
    //   Header: "DISTANCE",
    //   accessor: "distance",
    // },
    // {
    //   Header: "TIME",
    //   accessor: "time",
    // },
    {
      Header: "ACTIONS",
      accessor: "actions",
    },
    // {
    //   Header: "LOADING",
    //   id: "loading",
    // },
  ];

  if (isLoading) return <LoadingOverlay isLoading />;

  return (
    <RouteTable
      data={data}
      columns={columns}
      runners={runnerData}
      properties={properties}
    />
  );
}

export default RouteListTable;
