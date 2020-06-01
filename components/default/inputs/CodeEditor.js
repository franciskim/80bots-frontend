import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";
import AceEditor from "react-ace";
import beautify from 'js-beautify';

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-language_tools";

import { Label, Wrap } from "./Input";

const beautifyJavaScript = (value) => {
  return beautify.js_beautify(value, {
    indent_size: 2,
    indent_char: " ",
    max_preserve_newlines: 5,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "normal",
    brace_style: "expand",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: 40,
    indent_inner_html: false,
    comma_first: true,
    e4x: true,
    indent_empty_lines: false
  });
}

export const CodeEditor = ({ styles, label, value, onChange, ...props }) => {

  const execFunc = useCallback(() => {
    // todo: beautify using shortcut
  }, [value]);

  const handleBeautify = (code) => {
    const result = beautifyJavaScript(code);
    onChange(result)
  }

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
        commands={[{
          name: 'beautifyJavaScript',
          bindKey: {win: 'Ctrl-Alt-h', mac: 'Command-Alt-h'},
          exec: execFunc
        }]}
        name="BOT_EDITOR"
        editorProps={{ $blockScrolling: true }}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        enableSnippets={false}
        width="100%"
        fontSize={'1rem'}
        setOptions={{ useWorker: false }}
      />
      <button onClick={() => handleBeautify(value)}>Beautify</button>
    </Wrap>
  );
}

CodeEditor.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};