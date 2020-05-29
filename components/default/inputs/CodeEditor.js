import React from "react";
import PropTypes from "prop-types";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-language_tools";

import { Label, Wrap } from "./Input";

export const CodeEditor = ({ styles, label, value, onChange, ...props }) => {

  return (
    <Wrap styles={styles && styles.container}>
      {label && <Label styles={styles && styles.label}>{label}</Label>}
      <AceEditor
        mode="javascript"
        theme="monokai"
        value={value}
        onChange={(value) => {
          onChange(value);
        }}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        enableSnippets={false}
        width="100%"
        fontSize={'1rem'}
        setOptions={{ useWorker: false }}
      />
    </Wrap>
  );
}

CodeEditor.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};