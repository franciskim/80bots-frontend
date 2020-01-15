import React, { useEffect } from "react";
import { convertToRaw, ContentState, EditorState, Modifier } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const wrapperStyle = {
  marginTop: 10,
  height: "100%",
  border: "1px solid #c9c9c9",
  borderBottomWidth: "2px"
};
const editorStyle = {
  marginBottom: 30,
  padding: "5px 10px",
  height: 250,
  width: "100%"
};
const toolbarStyle = {
  background: "#fff",
  borderTop: "4px solid #333",
  borderBottom: "2px solid #c9c9c9"
};
const charactersStyle = {
  position: "absolute",
  bottom: 2,
  right: 2,
  padding: "2px 10px",
  border: "1px solid #E1E5EB",
  borderRight: "none",
  borderBottom: "none",
  color: "#c9c9c9"
};

export const SourceMode = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      sourse
    </button>
  );
};

class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charactersBody: 0,
      editorState: this.htmlToEditor(props.content),
      source: false
    };
  }

  getRawTextFromEditor = editorState => {
    const currentContent = convertToRaw(editorState.getCurrentContent());
    return currentContent.blocks[0].text;
  };

  onEditorStateChange = editorState => {
    this.setState({ editorState });
    let content;
    if (this.state.source) {
      this.getRawTextFromEditor(editorState);
    } else {
      content = this.editorToHtml(editorState);
    }
    this.props.onChange(content);
  };

  editorToHtml(editorState) {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }

  htmlToEditor(text) {
    const blocksFromHtml = htmlToDraft(text);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    return EditorState.createWithContent(contentState);
  }

  // toggleSourceCode = () => {
  //   const { editorState, source } = this.state;
  //   if (source) {
  //     const rawContent = this.getRawTextFromEditor(editorState);
  //     this.setState({ editorState: this.htmlToEditor(rawContent) });
  //     this.props.onChange(rawContent);
  //   } else {
  //     const currentEditorHtml = this.editorToHtml(editorState);
  //     const clearEditorState = this.htmlToEditor('');
  //     this.setState({ editorState: clearEditorState }, () => {

  //       const contentState = Modifier.replaceText(
  //         clearEditorState.getCurrentContent(),
  //         clearEditorState.getSelection(),
  //         currentEditorHtml,
  //       );
  //       const newContent = EditorState.push(this.state.editorState, contentState, 'insert-characters');

  //       this.setState({ editorState: newContent });
  //       this.props.onChange(currentEditorHtml);
  //     });
  //   }
  //   this.setState({ source: !source });
  // }

  render() {
    return (
      <>
        <Editor
          editorState={this.state.editorState}
          toolbarClassName="toolbar"
          wrapperClassName="wrapper"
          editorClassName="editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{ emoji: { inDropdown: false } }}
          // toolbarCustomButtons={[<SourceMode onClick={this.toggleSourceCode} key/>]}
          wrapperStyle={wrapperStyle}
          editorStyle={editorStyle}
          toolbarStyle={toolbarStyle}
        />

        <span style={charactersStyle}>{this.state.charactersBody}</span>
      </>
    );
  }
}

export default RichEditor;
