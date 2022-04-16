import React from 'react';
import { connect } from 'umi';
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import { Button, Space } from 'antd';
import firebase from '@/utils/firebase';
import Language from '@/locales/index';
import './reply.less'
const ReplyEditor = ({ type, id, pid, dispatch, handleDiscard }) => {
  const [value, setValue] = useState('');
  const handleReply = () => {
    if(value === ""){
      return
    }
    let cmt = {
      author: localStorage.getItem('currentUser'),
      avatarURL: '',
      time: firebase.firestore.Timestamp.fromDate(new Date()),
      vote: 0,
      content: value,
    };
    let parentId = '';
    if (typeof pid !== 'undefined') {
      parentId = pid;
    }
    let postId = id;
    dispatch({
      type: 'discussion/postComment',
      payload: { cmt, parentId, postId, type:type },
    });
    if (handleDiscard) handleDiscard();
  };
  return (
    <div>
      <MDEditor
        style={{ width: '100%' }}
        value={value}
        onChange={setValue}
        highlightEnable={true}
      />
      <span>
        <Space style={{ marginTop: '6px' }}>
          <Button type="primary" onClick={(value) => handleReply(value)}>
            {Language.postReply}
          </Button>
          <Button
            className="discard-button"
            danger
            // disabled={value === ''}
            onClick={() => {
              setValue('');
              if (handleDiscard) handleDiscard();
            }}
          >
            {Language.discard}
          </Button>
        </Space>
      </span>
    </div>
  );
};

export default connect(({}) => ({}))(ReplyEditor);
