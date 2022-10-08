import React, { useEffect, useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  ModalProps,
  Spinner,
} from "@chakra-ui/react";

import {
  FilterTable
} from '@epicdm/toolkit';

export interface ExportDataProps {
  objectClass: string;
  props: any;
  handleDataImport: (data: any) => Promise<{ complete: [], errors: [] }>;
}

const delay = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

interface DataImportModalProps extends ModalProps {
  title?: string;
  data: any[];
  importData: ExportDataProps;
}

interface ImportComponentProps {
  shouldImport: boolean;
  handleDataImport: (data: any[]) => Promise<{ complete: [], errors: [] }>;
}

const ImportComponent = ({ shouldImport, handleDataImport }: ImportComponentProps) => (props: any) => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState();
  const [result, setResult] = useState<{ complete: [], errors: [] }>({ complete: [], errors: [] });
  const { row, cell, index } = props;
  const data = row.original;
  const cellProps = cell.getCellProps()

  useEffect(() => {
    if (shouldImport && importing === false) {
      setImporting(true);
      console.log({ shouldImport, importing });
      handleDataImport([data]).then((result) => {
        setResult(result);
      }).catch((error) => setError(error));
    }
  }, [shouldImport, importing]);

  if (error) {
    return <span>{`Error - ${error.message}`}</span>
  }

  if (result) {
    if (result.complete?.length > 0) {
      return <span>{`Imported - ${result.complete[0].objectId}`}</span>
    }
    if (result.errors?.length > 0) {
      return <span>{`Error - ${result.errors[0].error}`}</span>
    }
  }
  if (importing) {
    return (<Spinner />);
  }
  return null;
};

const DataImportModal = ({
  isOpen,
  onClose,
  title,
  data,
  importData,
}: DataImportModalProps) => {

  const [shouldImport, setShouldImport] = useState(false);
  const { objectClass, handleDataImport, props } = importData;

  const columns: { Header: string, accessor: string, width: number, Cell: any } = (data && data.length > 0) ? Object.keys(data[0]).map((key: string) => ({
    Header: key,
    accessor: key,
    width: (key === 'address') ? 300 : 200,
  })) : [];

  columns.unshift({
    Header: 'Import',
    accessor: 'import',
    width: 250,
    Cell: ImportComponent({
      shouldImport,
      handleDataImport,
    }),
  });

  const handleImport = () => {
    setShouldImport(true);
  }

  return (
    <Modal onClose={onClose} size={'full'} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody height={'800px'}>
          <Button
            colorScheme="blue"
            onClick={handleImport}
          >
            Start Import
          </Button>
          <FilterTable
            initialState={{
              pageSize: data?.length || 25,
              pageIndex: 0,
            }}
            columnsData={columns}
            tableData={data}
            fullHeight
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DataImportModal;
