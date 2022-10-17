import Parse from 'parse/dist/parse.min.js';
import React, { useEffect, useRef } from 'react';
import { useField } from "formik";
import { useColorPalette } from "@app/theme";

import {
  Input,
  Flex,
  CloseButton,
  FormControl,
  FormLabel,
  Text,
  Button,
  Box,
  Spinner,
  useToast,
} from "@chakra-ui/react";

import {
  InfoIcon
} from "@chakra-ui/icons";

import { useQuery } from '@tanstack/react-query';

interface FileUplaodInputProps {
  onChange: (files: Parse.File[]) => void;
  initialValue?: Parse.File[];
}

export const FileInput: React.FC<FileUplaodInputProps> = ({ onChange, ...props }) => {
  return (
    <Input {...props} type="file" multiple={true} onChange={onChange} />
  )
}

const elipses = (str: string, length: number) => {
  if (!str) return '';
  if (str.length > length) {
    return str.substring(0, length) + '...';
  }
  return str;
}

export const resizeImage = (image: Image, max: number, quality: number) => {
  return new Promise(async function (resolve, reject) {
    const FR = new FileReader();
    FR.onload = function (evt) {
      const data = evt.target.result;
      const bytes = new Uint8Array(data);
      resolve(bytes);
    };
    FR.onerror = function (evt) {
      reject(evt);
    };
    FR.readAsArrayBuffer(image);
  });
};

interface FileUploaderProps {
  name: string;
  file: File;
  onLoad: (file: Parse.File) => void;
  onDelete: (data: { file: File, upload: Parse.File }) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ name, file, onLoad, onDelete }) => {
  const toast = useToast();
  const [field, meta, helpers] = useField(name);

  const handleLoad = async () => {
    try {
      const upload = new Parse.File(file.name, file);
      await upload.save();
      helpers.setValue(upload);
      return upload;
    } catch (err) {
      toast({
        title: 'Error Uploading File',
        description: err?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw new Error(err);
    }
  };

  const UploadRequest = useQuery<Parse.File>(
    ['upload', { nameName: file.name, name }],
    () => handleLoad(),
    {
      enabled: Boolean(file),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 0,
    }
  );

  const upload = UploadRequest.data;
  const bgImage = (upload) ? upload.url() : 'null';

  const handleRemove = () => {
    helpers.setValue(null);
    UploadRequest.remove();
    onDelete({
      upload,
      file,
    });
  }

  return (
    <Flex direction={'column'} alignItems={'center'} m={2}>
      <Flex
        position="relative"
        width={100}
        height={100}
        alignItems={'center'}
        justifyContent={'center'}
        backgroundColor={'gray.200'}
        borderRadius={'25px'}
        backgroundImage={bgImage}
        backgroundSize="cover"
        backgroundPosition="center"
        mr={2}
      >
        {UploadRequest.isLoading && <Spinner />}
        {UploadRequest.isError && (
          <Flex direction={'column'} alignItems={'center'} justifyContent={'center'}>
            <InfoIcon color={'red'} />
            <Text color={'red'} size={'sm'}>Upload Error</Text>
          </Flex>
        )}
        <Box position={"absolute"} top={0} right={0}>
          <CloseButton onClick={handleRemove} />
        </Box>
      </Flex>
      <Text
        width={'100%'}
        overflow={'hidden'}
        whiteSpace={'nowrap'}
        textAlign={'center'}
        fontSize={'sm'}
      >
        {elipses(file.name, 10)}
      </Text>
    </Flex>
  )
}

export const FileInputField = ({ name, label, initialValue, ...props }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { textColor } = useColorPalette();
  const [files, setFiles] = React.useState<File[]>([]);

  const handleChange = (event) => {
    const newFiles = event.target.files;
    const f = [...files];
    for (let i = 0; i < newFiles.length; i++) {
      if (!files.find((file) => file.name === newFiles[i].name)) {
        f.push(newFiles[i]);
      } else {
        console.warn('Duplicate file name', newFiles[i].name);
      }
    }
    setFiles(f);
  }

  const handleBrowse = () => {
    inputRef.current.click();
  }

  const handleDelete = (data: { upload: Parse.File, file: File }) => {
    const { file } = data;
    const newFiles = files.filter(p => p.name !== file.name);
    setFiles(newFiles);
  }

  const handleLoad = (file: Parse.File) => {
    // helpers.setValue([...uploads, file]);
  }

  return (
    <FormControl>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize="xs">
        {label}
      </FormLabel>
      <Flex direction={'row'} wrap={'wrap'} py={3}>
        {files.map((file: File, i) => (
          <FileUploader
            name={`upload_${i}`}
            key={i}
            file={file}
            onLoad={handleLoad}
            onDelete={handleDelete}
          />
        ))}
        <Box position={'relative'}>
          <Button onClick={handleBrowse}>Browse</Button>
          <input
            ref={inputRef}
            onChange={handleChange}
            type="file"
            {...props}
            style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0 }}
          />
        </Box>
      </Flex>
    </FormControl>
  )
}

export default FileInput;