import React from "react";

import {
  Flex,
  Text,
  Box,
  Select,
  Stack,
  Spinner,
  IconButton,
  Icon,
  Input,
  Button
} from "@chakra-ui/react";

import { FiList, FiCreditCard, FiDownload, FiUploadCloud, FiMap, FiRefreshCw } from "react-icons/fi";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import { useColorPalette } from '@app/theme';
import { useContainer } from "./SchemaTableProvider";
import Selector from "../components/Selectors/Selector";
import PickFileButton from '../components/Buttons/PickFileButton';

export interface TableToolbarProps {
  title?: string;
  hidePaging?: boolean;
  hideSearch?: boolean;
  hideImport?: boolean;
  hideExport?: boolean;
  hideCardView?: boolean;
  hideListView?: boolean;
  hideMapView?: boolean;
  hideAddButton?: boolean;
  pageSizes?: number[];
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  title,
  hidePaging,
  hideSearch,
  hideImport,
  hideExport,
  hideCardView,
  hideListView,
  hideMapView,
  hideAddButton,
  pageSizes
}) => {
  const { textColor, bgColor, inputBgColor } = useColorPalette();
  const {
    objectClass,
    schemaOptions,
    handleSchemaChange,
    pagination,
    refetch,
    FormDialogState,
    setViewType,
    importLoading,
    exportLoading,
    handleImport,
    handleExport,
    OptionsDialogState,
    selectedSchema,
  } = useContainer();

  const { pageSize, setPageSize } = pagination;

  const splitTitleCase = (str: string) => {
    const t = str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).split(' ');
    if (t.length > 2 && t[1].length === 1) {
      return t[2];
    }
    return t.join(' ');
  }

  return (
    <Box bg={bgColor} px={4}>
      <Flex
        h={{ sm: 'auto', md: 16 }}
        alignItems={"center"}
        justifyContent={"space-between"}
        position="relative"
        zIndex={1000}
        direction={{ sm: 'column', md: 'row' }}
      >
        <Flex direction={'row'} alignItems={"center"}>
          <Text color={textColor} fontWeight="bold" fontSize="lg" mr="1.5rem">
            {title || splitTitleCase(objectClass)}
          </Text>
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
                onChange={(event) => setPageSize(Number(event.target.value))}
                color="gray.500"
                size="sm"
                borderRadius="12px"
                maxW="75px"
                cursor="pointer"
                backgroundColor={inputBgColor}
                color={textColor}
              >
                {pageSizes.map((size) => (<option key={size}>{size}</option>))}
              </Select>
            </>)
            }
            <IconButton
              aria-label='Open Table Options'
              icon={<SettingsIcon />}
              onClick={OptionsDialogState.onOpen} />
          </Stack>
        </Flex>
        <Box position={'relative'} zIndex={1}>
          <Flex alignItems={"center"}>
            <IconButton
              size={"md"}
              icon={<Icon as={FiRefreshCw} />}
              onClick={() => refetch()}
              aria-label={"Refresh"}
              mx={'0.5rem'}
            />
            {!hideSearch && <Input
              type="text"
              placeholder="Search..."
              minW="75px"
              maxW="175px"
              fontSize="sm"
              _focus={{ borderColor: "qcmidnight.400" }}
              backgroundColor={inputBgColor}
              color={textColor}
              onChange={(e) => console.log(e.target.value)}
              mx={'0.5rem'}
            />}
            {!hideImport && <PickFileButton
              icon={(importLoading) ? <Spinner /> : <Icon as={FiUploadCloud} />}
              type={'csv'}
              onChange={handleImport}
            />}
            {!hideExport && <IconButton
              size={"md"}
              icon={(exportLoading) ? <Spinner /> : <Icon as={FiDownload} />}
              onClick={() => handleExport()}
              aria-label={"Export Data"}
              mx={'0.5rem'}
            />}
            {!hideCardView && <IconButton
              size={"md"}
              icon={<Icon as={FiCreditCard} />}
              onClick={() => setViewType("list")}
              aria-label={"View List"}
              mx={'0.5rem'}
            />}
            {!hideListView && <IconButton
              size={"md"}
              icon={<Icon as={FiList} />}
              onClick={() => setViewType("table")}
              aria-label={"View Table"}
              mx={'0.5rem'}
            />}
            {!hideMapView && <IconButton
              size={"md"}
              icon={<Icon as={FiMap} />}
              onClick={() => setViewType("map")}
              aria-label={"View Map"}
              mx={'0.5rem'}
            />}
            {!hideAddButton && <Button
              disabled={FormDialogState.isOpen}
              variant={"solid"}
              colorScheme={"teal"}
              size={"sm"}
              mx={'0.5rem'}
              leftIcon={<AddIcon />}
              onClick={FormDialogState.onOpen}
            >
              {`Add ${objectClass}`}
            </Button>}
          </Flex>
        </Box>
      </Flex>
      {!objectClass && (
        <Selector
          style={{ width: '250px' }}
          label="Schema"
          options={schemaOptions}
          initialValue={selectedSchema}
          onSelect={handleSchemaChange}
        />
      )}
    </Box>
  )
}

export default TableToolbar;