import React, { useState } from 'react';
import { Box, Button } from "@chakra-ui/react";
import ReactQuill from "react-quill";

const CustomToolbar = () => (
  <Box
    id="toolbar"
    borderTopStartRadius="15px"
    borderTopEndRadius="15px"
    borderBottom="0px solid transparent !important"
  >
    <select
      className="ql-header"
      defaultValue={""}
      onChange={(e) => e.persist()}
    >
      <option value="1"></option>
      <option value="2"></option>
      <option selected></option>
    </select>
    <Button
      display="flex !important"
      justifyContent="center !important"
      alignItems="center !important"
      me="5px !important"
      className="ql-bold"
    ></Button>
    <Button
      display="flex !important"
      justifyContent="center !important"
      alignItems="center !important"
      me="5px !important"
      className="ql-italic"
    ></Button>
    <Button
      display="flex !important"
      justifyContent="center !important"
      alignItems="center !important"
      me="5px !important"
      className="ql-underline"
    ></Button>
    <Button
      display="flex !important"
      justifyContent="center !important"
      alignItems="center !important"
      me="5px !important"
      className="ql-list"
      value="ordered"
    ></Button>
    <Button
      display="flex !important"
      justifyContent="center !important"
      alignItems="center !important"
      className="ql-list"
      value="bullet"
    ></Button>
  </Box>
);

const Editor = ({ value, onChange, placeholder }) => {
  const [state, setState] = useState({ editorHtml: value || "" });

  const handleChange = (html) => {
    setState({ editorHtml: html });
    if (onChange) onChange(html);
  }
  return (
    <div className="text-editor">
      <CustomToolbar />
      <ReactQuill
        onChange={handleChange}
        placeholder={placeholder}
        modules={Editor.modules}
      />
    </div>
  );
}

Editor.modules = {
  toolbar: [
    [{ size: [] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }, "link"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

Editor.modules = {
  toolbar: {
    container: "#toolbar",
  },
  clipboard: {
    matchVisual: false,
  },
};

Editor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
];

export default Editor;