/*
 * @Author: hwf - 1798274010@qq.com
 * @Date: 2020-07-31 15:35:04
 * @Last Modified by: hwf
 * @Last Modified time: 2020-08-03 08:55:34
 */
import React, { Component } from 'react';
// import LzEditor from 'react-lz-editor';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';

export class MakeDowns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
        {/* <textarea
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            /> */}
      </div>
    );
  }
}

export default MakeDowns;
