import React from 'react';
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const wrapperStyle = {
  marginTop: 10,
  height: '100%',
  border: '1px solid #c9c9c9',
  borderBottomWidth: '2px'
};
const editorStyle = {
  marginBottom: 30,
  padding: '5px 10px',
  height: 250,
  width: '100%'
};
const toolbarStyle = {
  background: '#fff',
  borderTop: '4px solid #333',
  borderBottom: '2px solid #c9c9c9',
};
const charactersStyle = {
  position: 'absolute',
  bottom: 2,
  right: 2,
  padding: '2px 10px',
  border: '1px solid #E1E5EB',
  borderRight: 'none',
  borderBottom: 'none',
  color: '#c9c9c9',
};

class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charactersBody: 0,
      editorState: this.fromResult(props.content)
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({editorState});
    const { onChange } = this.props;
    const content = this.toResult(editorState);
    onChange(content);
  };

  toResult(editorState) {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }

  fromResult(text) {
    const blocksFromHtml = htmlToDraft(text);
    const {contentBlocks, entityMap} = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    return EditorState.createWithContent(contentState);
  }

  submit() {
    const { onChange } = this.props;
    const { editorState } = this.state;
    const content = this.toResult(editorState);
    onChange(content);
  }

  render() {
    return (
      <>
        <Editor
          editorState={this.state.editorState}
          toolbarClassName="toolbar"
          wrapperClassName="wrapper"
          editorClassName="editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{emoji: {inDropdown: false}}}
          wrapperStyle={wrapperStyle}
          editorStyle={editorStyle}
          toolbarStyle={toolbarStyle}
        />

        <span style={charactersStyle}>
          {this.state.charactersBody}
        </span>
      </>
    );
  }
}

export default RichEditor;