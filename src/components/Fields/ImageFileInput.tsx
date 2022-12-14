import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { useField } from "formik";

import {
  Box,
  FormLabel,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

const NonPreviewDefaultComponent = ({ title = "No Preview", size = null, type = null }) => (
  <div style={{
    backgroundColor: '#FFFFFF',
    height: '30vmin',
    width: '30vmin',
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    boxShadow: "rgba(0, 0, 0, 0.188235) 0px 10px 30px, rgba(0, 0, 0, 0.227451) 0px 6px 10px",
    overflow: 'hidden'
  }}
  >
    <div style={{ margin: 5 }}>
      <p style={{ margin: 0, fontWeight: '500' }}>{title.split('.')[0]}</p>
      <p style={{ margin: 0 }}>{size + " kb"}</p>
      <p style={{ margin: 0 }}>{type !== "" ? type.split('/')[1] : title.split('.')[1]}</p>
    </div>
  </div>
);

function handleFiles(e) {
  var ctx = document.getElementById('canvas').getContext('2d');
  var reader = new FileReader();
  var file = e.target.files[0];
  // load to image to get it's width/height
  var img = new Image();
  img.onload = function () {
    // setup scaled dimensions
    var scaled = getScaledDim(img, ctx.canvas.dataMaxWidth, ctx.canvas.dataMaxHeight);
    // scale canvas to image
    ctx.canvas.width = scaled.width;
    ctx.canvas.height = scaled.height;
    // draw image
    ctx.drawImage(img, 0, 0
      , ctx.canvas.width, ctx.canvas.height
    );
  }
  // this is to setup loading the image
  reader.onloadend = function () {
    img.src = reader.result;
  }
  // this is to read the file
  reader.readAsDataURL(file);
}

// returns scaled dimensions object
function getScaledDim(img, maxWidth, maxHeight) {
  var scaled = {
    ratio: img.width / img.height,
    width: img.width,
    height: img.height
  }
  if (scaled.width > maxWidth) {
    scaled.width = maxWidth;
    scaled.height = scaled.width / scaled.ratio;
  }
  if (scaled.height > maxHeight) {
    scaled.height = maxHeight;
    scaled.width = scaled.height / scaled.ratio;
  }
  return scaled;
}

function imageToDataUri(base64, width, height) {

  const img = new Image();
  img.src = base64;

  // create an off-screen canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // set its dimension to target size
  canvas.width = width;
  canvas.height = height;

  // draw source image into the off-screen canvas:
  ctx?.drawImage(img, 0, 0, width, height);

  // encode image to data-uri with base64 version of compressed image
  return canvas.toDataURL('image/jpeg', 0.7);
}

class FileInputBase64PreviewComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image_objs_array: []
    }
  }

  simulateClickOnInput() {
    let clickEvent = new MouseEvent("click", {
      "view": window,
      "bubbles": true,
      "cancelable": false
    });
    this.fileInput.dispatchEvent(clickEvent);
  }

  handleFileChange(e) {
    let inp_files = e.target.files;
    let op_all_files = [];
    for (let i = 0; i < inp_files.length; i++) {
      let to_file = inp_files[i];
      let reader_obj = new FileReader();
      reader_obj.readAsDataURL(to_file);
      reader_obj.onload = () => {
        let to_file_obj = {
          name: to_file.name,
          type: to_file.type,
          size: Math.round(to_file.size / 1000),
          base64: reader_obj.result,
          file: to_file
        };
        op_all_files.push(to_file_obj);
        if (op_all_files.length === inp_files.length) {
          if (this.props.multiple) {
            this.setState({ image_objs_array: op_all_files });
            this.props.callbackFunction(op_all_files);
          }
          else {
            this.setState({ image_objs_array: op_all_files });
            this.props.callbackFunction(op_all_files[0]);
          }
        }
      }
    }
  }

  render() {
    return (
      <div style={this.props.parentStyle}>
        {/* <label htmlFor={this.props.inputId} style={this.props.labelStyle}>{this.props.labelText}</label> */}
        {this.props.imagePreview && ((this.state.image_objs_array.length !== 0) || (this.props.defaultFiles.length !== 0)) &&
          <div style={this.props.imageContainerStyle} >
            {this.state.image_objs_array.length !== 0 && this.state.image_objs_array.map((img_obj) => {
              if (img_obj.type.split("/")[0] === "image") {
                return (
                  <img alt={img_obj.name} src={img_obj.base64} key={img_obj.name} style={this.props.imageStyle} />
                );
              }
              else {
                return cloneElement(this.props.nonPreviewComponent, { type: img_obj.type, size: img_obj.size, title: img_obj.name, key: img_obj.name });
              }
            })}
            {this.state.image_objs_array.length === 0 && this.props.defaultFiles.map((img_url, index) => {
              return (
                <img alt={"Preview " + index} src={img_url} key={index} style={this.props.imageStyle} />
              );
            })}
          </div>
        }
        <input
          name={this.props.inputName}
          id={this.props.inputId}
          type="file"
          onChange={this.handleFileChange.bind(this)}
          multiple={this.props.multiple}
          accept={this.props.accept}
          ref={(thisInput) => { this.fileInput = thisInput; }}
          style={{ display: "none" }}
        />
        {this.props.textBoxVisible &&
          cloneElement(this.props.textFieldComponent,
            this.props.useTapEventPlugin ?
              {
                onTouchTap: () => { this.simulateClickOnInput(); },
                value: this.state.image_objs_array.length === 1 ?
                  this.state.image_objs_array[0].name
                  :
                  this.state.image_objs_array.length > 1 ?
                    this.state.image_objs_array.length + " files selected"
                    :
                    this.props.defaultFiles.length === 0 ?
                      "No files selected"
                      :
                      "Leave empty to keep previous selection"
              }
              :
              {
                onClick: () => { this.simulateClickOnInput(); },
                value: this.state.image_objs_array.length === 1 ?
                  this.state.image_objs_array[0].name
                  :
                  this.state.image_objs_array.length > 1 ?
                    this.state.image_objs_array.length + " files selected"
                    :
                    this.props.defaultFiles.length === 0 ?
                      "No files selected"
                      :
                      "Leave empty to keep previous selection"
              }
          )
        }
        {cloneElement(this.props.buttonComponent,
          this.props.useTapEventPlugin ? { onTouchTap: () => { this.simulateClickOnInput(); } } : { onClick: () => { this.simulateClickOnInput(); } }
        )}
      </div>
    );
  }

}

FileInputBase64PreviewComponent.defaultProps = {
  callbackFunction: () => { },
  labelText: "File Upload",
  useTapEventPlugin: false,
  multiple: true,
  imagePreview: true,
  textBoxVisible: false,
  accept: "*",
  imageContainerStyle: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap"
  },
  imageStyle: {
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    width: "auto",
    height: "30vmin",
    boxShadow: "rgba(0, 0, 0, 0.188235) 0px 10px 30px, rgba(0, 0, 0, 0.227451) 0px 6px 10px" //zDepth 3
  },
  labelStyle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.298039)',
    display: 'block'
  },
  parentStyle: {
    marginTop: 14
  },
  buttonComponent: <button type="button">Attach</button>,
  nonPreviewComponent: <NonPreviewDefaultComponent />,
  textFieldComponent: <input type="text" />,
  defaultFiles: []
}

FileInputBase64PreviewComponent.propTypes = {
  inputName: PropTypes.string,
  inputId: PropTypes.string,
  callbackFunction: PropTypes.func,
  labelText: PropTypes.string,
  useTapEventPlugin: PropTypes.bool,
  multiple: PropTypes.bool,
  imagePreview: PropTypes.bool,
  textBoxVisible: PropTypes.bool,
  accept: PropTypes.string,
  imageContainerStyle: PropTypes.object,
  imageStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  parentStyle: PropTypes.object,
  buttonComponent: PropTypes.element,
  nonPreviewComponent: PropTypes.element,
  textFieldComponent: PropTypes.element,
  defaultFiles: PropTypes.array
}

const ImageFileInputField = ({ label, ...props }: any) => {
  const [field, meta, helpers] = useField(props);
  const textColor = useColorModeValue("gray.700", "white");

  const handleInputChange = (value: any[]) => {
    helpers.setValue(value);
  }
  return (
    <Box position={'relative'} mb={'36px'}>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <FileInputBase64PreviewComponent
        callbackFunction={handleInputChange}
        useTapEventPlugin={false}
        multiple={true}
        imagePreview={true}
        textBoxVisible={false}
        accept={"image/*"}
        imageContainerStyle={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          flexWrap: "wrap"
        }}
        imageStyle={{
          marginTop: 5,
          marginBottom: 5,
          marginRight: 5,
          width: "auto",
          height: "150px",
          boxShadow: "rgba(0, 0, 0, 0.188235) 0px 10px 30px, rgba(0, 0, 0, 0.227451) 0px 6px 10px" //zDepth 3
        }}
        labelStyle={{
          fontSize: 16,
          color: 'rgba(0, 0, 0, 0.298039)',
          display: 'block'
        }}
        parentStyle={{
          marginTop: 14
        }}
        buttonComponent={<Button type="button">Browse</Button>}
        nonPreviewComponent={<NonPreviewDefaultComponent />}
        textFieldComponent={<input type="text" {...field} />}
        defaultFiles={[]}
      // borderColor={meta.touched && meta.error ? "red.500" : "gray.300"}
      // placeholder={label}
      // borderRadius="15px"
      // fontSize="sm"
      // size="lg"
      // {...props}
      />
      {meta.touched && meta.error ? (
        <FormLabel
          width={'100%'}
          textAlign={"center"}
          color={"red"}
          fontSize="xs"
          fontWeight="normal"
        >
          {meta.error}
        </FormLabel>
      ) : null}
    </Box>
  );
};

export default ImageFileInputField;