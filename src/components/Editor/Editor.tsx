import React, { useState, useEffect } from 'react';
import { Box, Button } from "@chakra-ui/react";
import ReactQuill from "react-quill";

const Editor = ({ id, value, onChange, placeholder, height }) => {
  const [state, setState] = useState(value || "");

  const handleChange = (html) => {
    setState(html);
    if (onChange) onChange(html);
  }

  useEffect(() => {
    if (value !== state) {
      setState(value);
    }
    return () => { }
  }, [value]);

  console.log(id);

  return (
    <div className="text-editor" style={{ width: '100%' }}>
      <Box
        id={`toolbar-${id}`}
        className={'technicalSupport'}
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
      <ReactQuill
        id={id}
        onChange={handleChange}
        placeholder={placeholder}
        defaultValue={state}
        theme="snow"
        modules={{
          toolbar: {
            container: `#toolbar-${id}`,
          }
        }}
        style={{ height: height || 200 }}
      />
    </div>
  );
}

// Editor.modules = {
//   toolbar: [
//     ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
//     ['blockquote', 'code-block'],

//     [{ 'header': 1 }, { 'header': 2 }],               // custom button values
//     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//     [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
//     [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
//     [{ 'direction': 'rtl' }],                         // text direction

//     [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
//     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

//     [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
//     [{ 'font': [] }],
//     [{ 'align': [] }],

//     ['clean']                                         // remove formatting button
//   ],
//   clipboard: {
//     matchVisual: false,
//   },
// };

// Editor.modules = {
//   toolbar: {
//     container: "#toolbar",
//   },
//   clipboard: {
//     matchVisual: false,
//   },
// };

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