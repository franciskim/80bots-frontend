import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import beautify from 'js-beautify'
import dynamic from 'next/dynamic'
import { Button, FormGroup } from 'reactstrap'

const AceEditor = dynamic(
  async () => {
    const reactAce = await import('react-ace')

    // prevent warning in console about misspelled props name.
    await import('ace-builds/src-min-noconflict/ext-language_tools')
    // import your theme/mode here. <AceEditor mode="javascript" theme="solarized_dark" />
    await import('ace-builds/src-min-noconflict/mode-javascript')
    await import('ace-builds/src-noconflict/theme-tomorrow_night_eighties')

    // as @Holgrabus commented you can paste these file into your /public folder.
    // You will have to set basePath and setModuleUrl accordingly.
    let ace = require('ace-builds/src-min-noconflict/ace')
    ace.config.set(
      'basePath',
      'https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/'
    )
    ace.config.setModuleUrl(
      'ace/mode/javascript_worker',
      'https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-javascript.js'
    )

    return reactAce
  },
  {
    ssr: false, // react-ace doesn't support server side rendering as it uses the window object.
  }
)

const beautifyJavaScript = (value) => {
  return beautify.js_beautify(value, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 5,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'collapse',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: 40,
    indent_inner_html: false,
    comma_first: false,
    e4x: true,
    indent_empty_lines: false,
  })
}

// const Editor = (props) => {
//   if (typeof window !== 'undefined') {
//     const Ace = require('react-ace').default
//     require('brace/mode/javascript')
//     require('brace/theme/github')

//     return <Ace {...props} />
//   }

//   return null
// }

export const CodeEditor = ({ value, onChange, ...props }) => {
  const execFunc = useCallback(() => {
    // todo: beautify using shortcut
  }, [value])

  const handleBeautify = (code) => {
    const result = beautifyJavaScript(code)
    onChange(result)
  }

  return (
    <>
      <FormGroup>
        <AceEditor
          mode="javascript"
          theme="tomorrow_night_eighties"
          value={value}
          onChange={(value) => {
            onChange(value)
          }}
          commands={[
            {
              name: 'beautifyJavaScript',
              bindKey: { win: 'Ctrl-Alt-h', mac: 'Command-Alt-h' },
              exec: execFunc,
            },
          ]}
          name="BOT_EDITOR"
          editorProps={{ $blockScrolling: true }}
          enableBasicAutocompletion={false}
          enableLiveAutocompletion={false}
          enableSnippets={false}
          width="100%"
          fontSize={'1rem'}
          setOptions={{ useWorker: false }}
        />
      </FormGroup>
      <FormGroup>
        <Button color="primary" onClick={() => handleBeautify(value)}>
          Beautify
        </Button>
      </FormGroup>
    </>
  )
}

CodeEditor.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
}
