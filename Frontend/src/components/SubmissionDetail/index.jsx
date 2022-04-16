import React, { useEffect, useState } from 'react';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import AceEditor from 'react-ace';
import styles from './style.less';
import Language from '@/locales/index';
// import 'brace/mode/javascript';
// import 'brace/mode/c_cpp';
// import 'brace/mode/java';
import {
  PageHeader,
  Divider,
  Checkbox,
  Tabs,
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
} from 'antd';
import 'brace/theme/kuroir';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading';
import { u_atob } from '@/utils/string';
import moment from 'moment';
const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;
const SubmissionDetail = ({ dispatch, data, listQuestion, loading }) => {
  const [result, setResult] = useState([]);
  useEffect(() => {
    const tempResult = [];
    if (listQuestion[0].TestCase)
      listQuestion[0].TestCase.forEach((tc, i) => {
        let temp = {};
        temp.expected_output = JSON.stringify(tc.Output[0]);
        temp.stdin = JSON.parse(JSON.stringify(tc.Input[0]));
        temp.stdout = data.data[0].OutputTestcase[i];
        if (typeof temp.stdout !== 'string') {
          temp.compile_output = data.data[0].OutputTestcase[i].compile_output;
          temp.stdout = '';
        } else temp.compile_output = '';
        tempResult.push(temp);
      });
    else {
      console.log('multiplechoice');
    }
    setResult(tempResult);
  }, []);

  const editor = (value) => {
    return (
      <AceEditor
        className={styles.editor}
        // mode="c_cpp"
        fontSize={16}
        readOnly={true}
        theme="kuroir"
        value={value}
        minLines={1}
        maxLines={10}
        style={{ width: '100%' }}
        highlightGutterLine={false}
        highlightActiveLine={false}
        showPrintMargin={false}
      />
    );
  };

  const Testcases = (result) => {
    return (
      <Tabs tabPosition="top">
        {result.map((res, i) => {
          let title = 'Test Case ' + (i + 1);
          return (
            <TabPane
              tab={
                <span>
                  {res.expected_output === u_atob(res.stdout) ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  ) : (
                    <CloseCircleTwoTone twoToneColor="#eb2f96" />
                  )}
                  {title}
                </span>
              }
              key={i + 1}
            >
              {res.compile_output != '' && (
                <>
                  {<h3>{Language.sd_compiler}</h3>}
                  {editor(u_atob(res.compile_output))}
                </>
              )}
              {res.stdin != '' && (
                <>
                  <h3>Input</h3>
                  {editor(res.stdin)}
                </>
              )}
              {res.expected_output != '' && (
                <>
                  <h3>{Language.sd_exOutput}</h3>
                  {editor(res.expected_output)}
                </>
              )}
              {res.stdout != '' && (
                <>
                  <h3>{Language.sd_exOutput}</h3>
                  {editor(u_atob(res.stdout))}
                </>
              )}
            </TabPane>
          );
        })}
      </Tabs>
    );
  };

  return (
    <>
      {(
        <div>
          <PageHeader
            className="submission-page-header"
            onBack={() => {
              dispatch({
                type: 'practice/setCurrentSubmission',
                payload: null,
              });
            }}
            title={Language.sd_back}
          />
          <Typography.Text>
            {Language.sd_submitted}{' '}
            {moment(data.info.CreatedAt).locale('en').format('MMMM Do YYYY, h:mm:ss a')}
          </Typography.Text>
          <Row>
            <Col span={12}>
              <Tooltip placement="topLeft" title={Language.sd_calc}>
                <span>
                  <Statistic title={Language.sd_yourScore} value={data.info.Score} precision={0} />
                </span>
              </Tooltip>
            </Col>
            <Col span={12}>
              <Tooltip
                placement="topLeft"
                title={Language.sd_calc}
              >
                <span>
                  <Statistic title={Language.sd_correctPer} value={data.info.CorrectPercent} suffix="%" />
                </span>
              </Tooltip>
            </Col>
          </Row>
          <Divider></Divider>
          <Typography.Title level={3}>{Language.sd_submittedAns}</Typography.Title>
          {data.info.SubmissionType === 'Coding' ? (
            <div>
              <Divider orientation="left">{Language.sd_submittedAns}</Divider>
              {editor(u_atob(data.data[0].DescriptionCode))}
              <Divider orientation="left">Test Cases</Divider>
              {Testcases(result)}
            </div>
          ) : (
            <div>
              {listQuestion.map((item, i) => {
                let temp = [];
                  data.data[i]?.Choice.forEach(choice=> {
                    console.log(choice)
                    temp.push(item.Answer[choice]);
                  })
                // console.log(data);
                return (
                  <div key={i}>
                    <h3 style={data.data[i]?.status === 1 ? { color: 'green' } : { color: 'red' }}>
                      {Language.pages_test_testDetail_question} {i + 1}. {item.Description}
                    </h3>
                    <h4>
                      {Language.sd_yourAns}{' '}
                      <CheckboxGroup
                        style={{ display: 'flex', flexDirection: 'column' }}
                        onChange={() => console.log('')}
                        value={temp}
                        options={item.Answer}
                      ></CheckboxGroup>
                    </h4>
                    <Divider></Divider>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default connect(({ practice, loading }) => ({
  data: practice.currentSubmission,
  loading: loading.effects['practice/getSubmissionDetail'],
  listQuestion: practice.listDetail.listQuestion,
}))(SubmissionDetail);
