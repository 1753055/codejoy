import React, { Component } from 'react';
import styles from './style.less';
import AceEditor from 'react-ace';
import 'brace/ext/searchbox';
import Language from '@/locales/index';
import Expand from 'react-expand-animated';
// import 'ace-builds/src-min-noconflict/ext-options';
// import 'ace-builds/src-min-noconflict/ext-keybinding_menu';
// import 'ace-builds/src-min-noconflict/ext-prompt';
// import 'ace-builds/src-min-noconflict/ext-statusbar';
// import 'ace-builds/src-min-noconflict/ext-settings_menu';

import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/mode/java';
import 'brace/theme/monokai';
import 'brace/theme/tomorrow';
import 'brace/snippets/c_cpp';
import 'brace/snippets/java';
import 'brace/snippets/javascript';
import 'brace/ext/language_tools';
// import "ace-builds/src-noconflict/snippets/c_cpp"
// import "ace-builds/src-noconflict/snippets/java"
// import "ace-builds/src-noconflict/snippets/javascript"
// import 'ace-builds/src-min-noconflict/ext-language_tools';

import { Button, Checkbox, Input, notification, Select, Space, Tooltip} from 'antd';
import { connect } from 'dva';
import { u_btoa } from '@/utils/string';
import '../Coding/style.less';
import { QuestionCircleOutlined, CaretRightOutlined, SearchOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

// const IconFont = createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_2449607_3tn2o8mjobx.js',
// });
const { TextArea } = Input;

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    let temp = 'c_cpp';
    if (this.props.practice.listDetail.generalInformation.PracticeSet === 'Java') temp = 'java';
    if (this.props.practice.listDetail.generalInformation.PracticeSet === 'JavaScript')
      temp = 'javascript';
    this.state = {
      customVal: '',
      isSubmitBatch: false,
      showCustom: false,
      mode: temp,
      theme: 'tomorrow',
      tabSize: 2,
      fontSize: 16,
    };
    this.editorRef = React.createRef();
  }

  handleCheckBoxChange = () => {
    this.setState({
      showCustom: !this.state.showCustom,
    });
  };
  handleCodeEditorChange = (val) => {
    this.props.handleEditorValue(val)
  };
  handleCustomValChange = (e) => {
    this.setState({
      customVal: e.target.value,
    });
  };
  handleSendCode = (input, expected_output) =>
    new Promise((resolve, reject) => {
      let code = this.props.editorValue;
      let lang_id = 54; //54 C++ 71 python
      if (this.state.mode === 'java') lang_id = 62;
      if (this.state.mode === 'javascript') lang_id = 63;
      if (this.state.customInput == false) input = input;
      else if (this.state.customVal == '') input = input;
      else input = this.state.customVal;
      code = code.replace(/(^")|("$)/g, '');
      code = u_btoa(code);

      const data = {
        source_code: code,
        language_id: lang_id,
        stdin: u_btoa(input),
        expected_output: u_btoa(expected_output),
      };

      this.props.dispatch({
        type: 'judge/sendCode',
        payload: data,
      });
      resolve();
    });
  handleRun = () => {
    console.log(this.props.editorValue, this.editorRef)
    if (this.props.editorValue === "") {
      notification.error({
        message: 'Hey Listen!',
        description: 'Edit the code before run',
        className: 'code-notification',
        type: 'error',
      });
      return;
    }

    this.handleSendCode(this.props.testCases[0].Input[0], this.props.testCases[0].Output[0]);
  };
  handleSubmit = () => {
    if (this.props.editorValue == '') {
      notification.open({
        message: 'Hey Listen!',
        description: 'Edit the code before run',
        className: 'code-notification',
        type: 'error',
      });
      return;
    }
    this.setState({
      isSubmitBatch: true,
    });
    let batch_Submission = [];

    let code = this.props.editorValue;
    let lang_id = 54; //54 C++ 71 python
    if (this.state.mode === 'java') lang_id = 62;
    if (this.state.mode === 'javascript') lang_id = 63;
    code = code.replace(/(^")|("$)/g, '');
    code = u_btoa(code);
    for (var tc of this.props.testCases) {
      // console.log(tc.Input[0])
      var input = tc.Input[0];
      var expected_output = tc.Output[0];
      let data = {
        source_code: code,
        language_id: lang_id,
        stdin: u_btoa(input),
        expected_output: u_btoa(expected_output),
      };
      batch_Submission.push(data);
    }
    const batch = {
      submissions: batch_Submission,
      pid: this.props.practice.listDetail.generalInformation.PracticeID,
    };

    this.props.dispatch({
      type: 'judge/sendCodeBatch',
      payload: batch,
    });
  };
  handleThemeChange = (value) => {
    this.setState({
      theme: value,
    });
  };
  handleTabSizeChange = (value) => {
    this.setState({
      tabSize: value,
    });
  };
  handleFontSizeChange = (value) => {
    this.setState({
      fontSize: value,
    });
  };
  handleSearch = (value) => {
    const editor = this.editorRef.current.editor;
    // editor.find(value, {
    //   backwards: false,
    //   wrap: true,
    //   caseSensitive: false,
    //   wholeWord: false,
    //   regExp: true
    // });

    editor.execCommand('find');
  };

  render() {
    return (
      <div className={styles.container}>
        <Space className={styles.header}>
          <Select
            className={styles.selectBtn}
            defaultValue="tomorrow"
            onChange={(value) => this.handleThemeChange(value)}
          >
            <Select.Option value="monokai">Dark</Select.Option>
            <Option value="tomorrow">Light</Option>
          </Select>
          <Select
            className={styles.selectBtn}
            defaultValue={2}
            onChange={(value) => this.handleTabSizeChange(value)}
          >
            <Select.Option value={2}>Tab size: 2</Select.Option>
            <Select.Option value={4}>Tab size: 4</Select.Option>
          </Select>
          <Select
            defaultValue={16}
            className={styles.selectBtn}
            onChange={(value) => this.handleFontSizeChange(value)}
          >
            <Select.Option value={12}>12</Select.Option>
            <Select.Option value={14}>14</Select.Option>
            <Select.Option value={16}>16</Select.Option>
            <Select.Option value={18}>18</Select.Option>
          </Select>
          <Button icon={<SearchOutlined />} onClick={() => this.handleSearch()}>
            Find
          </Button>

          <Tooltip title={Language.help}>
            <a
              style={{
                color: 'inherit',
              }}
              target="_blank"
              href="https://github.com/1753003/DATN_He-Thong-Danh-gia-ky-nang-Lap-trinh-SV"
              rel="noopener noreferrer"
              className={styles.action}
            >
              <QuestionCircleOutlined />
            </a>
          </Tooltip>
          {<Tooltip placement={this.props.fullscreen?"left":"top"} className={styles.fullscreenBtn} title={this.props.fullscreen?"Exit Full Screen":"Fullscreen Mode"}
          >
          <Button style={{    top: "6px",
            right: "0",
            marginRight: "30px"}} type="primary" icon={this.props.fullscreen?<FullscreenExitOutlined/>: <FullscreenOutlined/>}
          onClick={()=>{this.props.handleFullscreen()}}
          />
          </Tooltip>}
        </Space>
        <AceEditor
          ref={this.editorRef}
          tabSize={this.state.tabSize}
          style={{ whiteSpace: 'pre-wrap', border: 'solid #dcdcdc 1px' }}
          width="100%"
          height={this.props.fullscreen?"560px":"386px"}
          showPrintMargin={false}
          showGutter
          value={this.props.editorValue}
          mode={this.state.mode}
          theme={this.state.theme}
          fontSize={this.state.fontSize}
          editorProps={{ $blockScrolling: true, $blockSelectEnabled: false }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
          onChange={this.handleCodeEditorChange.bind(this)}
        />

        <div className={styles.footer}>
          <Space className={styles.footer}>
            <Button
              disabled={this.props.loading}
              size="large"
              className={styles.runBtn}
              type="primary"
              onClick={this.handleRun.bind(this)}
            >
              <CaretRightOutlined style={{ fontSize: '18px' }} />
              Run Code
            </Button>
            <Button
            disabled={this.props.loading}
              size="large"
              className={styles.submitBtn}
              type="primary"
              onClick={this.handleSubmit.bind(this)}
            >
              Submit
            </Button>
            <Checkbox
            disabled={this.props.loading}
            onChange={this.handleCheckBoxChange.bind(this)}>Custom Input</Checkbox>
          </Space>
          <Expand
            open={this.state.showCustom}
            duration={500}
            transitions = {["height", "opacity", "background"]}
          >
              <TextArea
                className={styles.customInput}
                allowClear
                onChange={this.handleCustomValChange.bind(this)}
                placeholder="Put your custom input here."
                // autoSize={{ minRows: 3 }}
                row={4}
              />
          </Expand>
        </div>
      </div>
    );
  }
}

export default connect(({ practice, judge, loading }) => ({
  practice,
  judge,
  loading: loading.effects['judge/sendCode'] || loading.effects['judge/sendCodeBatch'],
  testCases: practice.listDetail?.listQuestion[0].TestCase,
}))(CodeEditor);
