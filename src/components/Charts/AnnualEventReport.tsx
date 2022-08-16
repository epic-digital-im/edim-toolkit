import React from 'react';
import { useMemo } from 'react';

import {
  Box,
  Stat,
  StatLabel,
  Flex,
  Text,
  Heading
} from "@chakra-ui/react";

import {
  pieChartOptionsCharts1,
} from "../../variables/charts";

const chartPalette = [
  "#2852DC",
  "#7CA0FF",
  "#3AA3B6",
  "#83CBD7",
  "#485B75",
  "#ACBCCF",
]

import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import CardHeader from "../Card/CardHeader";
import { ParseCollectionLiveQuery } from "../../hoc/ParseLiveQuery";
import { ClassNames } from "@app/shared/types";
import { Event } from "@app/shared/parse-types";

const quarters = [
  {
    label: 'Q1',
    months: [
      {
        number: 10,
        label: 'October',
        bgColor: '#F7F8FA',
      },
      {
        number: 11,
        label: 'November',
        bgColor: '#FFFFFF',
      },
      {
        number: 12,
        label: 'December',
        bgColor: '#F7F8FA',
      }
    ],
  },
  {
    label: 'Q2',
    months: [
      {
        number: 1,
        label: 'January',
        bgColor: '#FFFFFF',
      },
      {
        number: 2,
        label: 'February',
        bgColor: '#F7F8FA',
      },
      {
        number: 3,
        label: 'March',
        bgColor: '#FFFFFF',
      }
    ],
  },
  {
    label: 'Q3',
    months: [
      {
        number: 4,
        label: 'April',
        bgColor: '#F7F8FA',
      },
      {
        number: 5,
        label: 'May',
        bgColor: '#FFFFFF',
      },
      {
        number: 6,
        label: 'June',
        bgColor: '#F7F8FA',
      }
    ],
  },
  {
    label: 'Q4',
    months: [
      {
        number: 7,
        label: 'July',
        bgColor: '#FFFFFF',
      },
      {
        number: 8,
        label: 'August',
        bgColor: '#F7F8FA',
      },
      {
        number: 9,
        label: 'September',
        bgColor: '#FFFFFF',
      }
    ],
  },
]

const categories = [
  'EpicDM Hosted Event',
  'Key Industry Event',
  'Other',
]

interface AnnualEventReportProps {
  startDate: Date;
  endDate: Date;
}

const AnnualEventReport: React.FC<AnnualEventReportProps> = ({ startDate, endDate }) => {
  return (
    <ParseCollectionLiveQuery
      objectClass={ClassNames.Event}
      include={['category']}
      filter={[
        {
          method: 'greaterThanOrEqualTo',
          value: startDate,
          prop: 'start'
        },
        {
          method: 'lessThanOrEqualTo',
          value: endDate,
          prop: 'end'
        }
      ]}>
      {({ data, isLoading, isError }) => {

        // const chartData = useMemo(() => {
        //   const categoryMap: { [key: string]: number } = {};
        //   const categoryColorMap: { [key: string]: string } = {};

        //   data?.forEach((val) => {
        //     const category = val.get('category');
        //     const categoryValue = category?.get('value');
        //     const categoryColor = category?.get('color');
        //     if (categoryValue) {
        //       categoryMap[categoryValue] = categoryMap[categoryValue] || 0;
        //       categoryMap[categoryValue]++;
        //       categoryColorMap[categoryValue] = categoryColor;
        //     }
        //   });

        //   const chartData = Object.values(categoryMap);
        //   const labels = Object.keys(categoryMap);
        //   const colors = Object.values(categoryColorMap);
        //   return {
        //     data: chartData,
        //     labels,
        //     colors,
        //   }
        // }, [data]);

        const getEventsByMonthAndCategory = (month: number, category: string) => {
          return data?.filter((event: Event) => {
            const categoryAttribute = event.get('category')
            const categoryValue = categoryAttribute?.get('value');
            if (categoryValue === category) {
              const start = event.get('start');
              const startMonth = start?.getMonth()
              if (startMonth && startMonth + 1 === month) {
                return true;
              }
            }
            return false;
          }).map((event: Event) => {
            const startDate = event.get('start');
            const startString = `${startDate?.getMonth() + 1}/${startDate?.getDate()}`;
            const endDate = event.get('end');
            const endString = ` - ${endDate?.getMonth() + 1}/${endDate?.getDate()}`;
            return {
              name: event.get('name'),
              start: startDate ? startString : '',
              end: endDate ? endString : '',
              bgColor: event.get('category')?.get('color'),
            }
          });
        }

        if (isLoading) return null;

        return (
          <Card px="0px" pb="0px">
            <CardHeader px={6} pb={6}>
              <Heading fontSize={'xl'}>
                {`Experiment Marketing Event Calendar`}
              </Heading>
            </CardHeader>
            <CardBody justifyContent={'center'}>
              <Flex direction={'column'} width={'100%'}>
                <Flex direction={'row'} width={'100%'}>
                  {quarters.map((quarter) => {
                    return (
                      <Flex key={quarter.label} width={'25%'} direction={'column'}>
                        <Flex
                          bgColor={"#0C2742"}
                          borderBottom={`1px solid white`}
                          borderRight={'1px solid white'}
                          alignContent={'center'}
                          alignItems={'center'}
                          justifyContent={'center'}>
                          <Text color={'white'} textAlign={'center'} py={3}>
                            {quarter.label}
                          </Text>
                        </Flex>
                        <Flex direction={'row'}>
                          {quarter.months.map((month) => {
                            return (
                              <Flex bgColor={month.bgColor} width={'33.33%'} direction={'column'}>
                                <Flex
                                  width={'100%'}
                                  key={`${quarter.label}_${month.number}`}
                                  bgColor={'#ACBBCF'}
                                  alignContent={'center'}
                                  alignItems={'center'}
                                  borderBottom={`1px solid white`}
                                  borderRight={'1px solid white'}
                                  justifyContent={'center'}>
                                  <Text textAlign={'center'} py={2}>
                                    {month.label}
                                  </Text>
                                </Flex>
                              </Flex>
                            )
                          })}
                        </Flex>
                        {/* <Flex direction={'row'}>
                        {quarter.months.map((month) => {
                          return (
                            <Flex bgColor={month.bgColor} width={'33.33%'} direction={'column'}>
                              <Flex direction={'column'}>
                                {getEventsByMonthAndCategory(month.number, 'Key Industry Event').map((event) => {
                                  return (
                                    <Flex
                                      width={'100%'}
                                      key={`${quarter.label}_${event.name}`}
                                      bgColor={'#336CE3'}
                                      alignContent={'center'}
                                      alignItems={'center'}
                                      justifyContent={'center'}>
                                      <Text textAlign={'center'} py={2}>
                                        {event.name}
                                      </Text>
                                    </Flex>
                                  )
                                })}
                              </Flex>
                            </Flex>
                          )
                        })}
                      </Flex> */}

                        {/* <Flex direction={'row'}>
                        {quarter.months.map((month) => {
                          return (
                            <Flex bgColor={month.bgColor} width={'33.33%'} direction={'column'}>
                              <Flex direction={'column'}>
                                {getEventsByMonthAndCategory(month.number, 'Other').map((event) => {
                                  return (
                                    <Flex
                                      width={'100%'}
                                      key={`${quarter.label}_${event.name}`}
                                      bgColor={'#5D6E88'}
                                      alignContent={'center'}
                                      alignItems={'center'}
                                      justifyContent={'center'}>
                                      <Text textAlign={'center'} py={2}>
                                        {event.name}
                                      </Text>
                                    </Flex>
                                  )
                                })}
                              </Flex>
                            </Flex>
                          )
                        })}
                      </Flex> */}

                      </Flex>
                    )
                  })}
                </Flex>
                {categories.map((category: string, index: number) => {
                  return (
                    <Flex direction={'row'} key={`${category}_${index}`} mb={2}>
                      {quarters.map((quarter) => {
                        return (
                          <Flex
                            key={quarter.label}
                            width={'25%'}
                            direction={'column'}
                          >
                            <Flex direction={'row'} height={'100%'}>
                              {quarter.months.map((month) => {
                                return (
                                  <Flex bgColor={month.bgColor} width={'33.33%'} height={'100%'} direction={'column'}>
                                    <Flex direction={'column'}>
                                      {getEventsByMonthAndCategory(month.number, category).map((event) => {
                                        return (
                                          <Flex
                                            width={'100%'}
                                            key={event.id}
                                            bgColor={event.bgColor}
                                            borderBottom={`1px solid white`}
                                            // borderLeft={'1px solid white'}
                                            borderRight={'1px solid white'}
                                            alignContent={'center'}
                                            alignItems={'center'}
                                            justifyContent={'center'}>
                                            <Text fontSize={'xs'} textAlign={'center'} py={2} color={'white'}>
                                              {event.name}<br />
                                              {event.start}{event.end}
                                            </Text>
                                          </Flex>
                                        )
                                      })}
                                    </Flex>
                                  </Flex>
                                )
                              })}
                            </Flex>
                          </Flex>
                        )
                      })}
                    </Flex>
                  )
                })}
              </Flex>
            </CardBody>
          </Card>
        )
      }}
    </ParseCollectionLiveQuery >
  )
}

export default AnnualEventReport;
