import React, { useState, useEffect } from 'react';
import styles from './index.less';
import Summary from './Contents/Summary';
import Users from './Contents/Users';
import Questions from './Contents/Questions';
import { connect } from 'umi';
import { Menu } from 'antd';
import PageLoading from '@/components/PageLoading';

const ReportDetail = ({ summaryReport, location, dispatch, loading, summaryUser }) => {
  useEffect(() => {
    if (location.query?.id) {
      const payload = {
        id: location.query.id,
      };
      dispatch({ type: 'report/getSummaryReportById', payload });
      dispatch({ type: 'report/getSummaryUserById', payload });
    }
  }, [location]);
  const [menuKey, setMenuKey] = useState('summary');
  return loading ? (
    <PageLoading />
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Report</h2>
          <h1>{summaryReport?.ReportName}</h1>
          <Menu
            mode="horizontal"
            className={styles.menu}
            onSelect={(info) => {
              setMenuKey(info.key);
            }}
            selectedKeys={menuKey}
          >
            <Menu.Item key="summary" style={{ color: menuKey === 'summary' ? '#00F3FA' : 'white' }}>
              Summary
            </Menu.Item>
            <Menu.Item key="users" style={{ color: menuKey === 'users' ? '#00F3FA' : 'white' }}>
              Users
            </Menu.Item>
          </Menu>
        </div>
      </div>
      <div className={styles.body}>
        <RenderBody
          menuKey={menuKey}
          summaryReport={summaryReport}
          summaryUser={summaryUser}
          location={location}
        />
      </div>
    </div>
  );
};

const RenderBody = ({ menuKey, summaryReport, summaryUser, location }) => {
  switch (menuKey) {
    case 'summary':
      return <Summary summaryReport={summaryReport} summaryUser={summaryUser} />;
    case 'users':
      return <Users summaryUser={summaryUser} reportID={location.query?.id} />;
    default:
      return <Summary summaryReport={summaryReport} summaryUser={summaryUser} />;
  }
};

export default connect(({ report: { summaryReport, summaryUser }, loading }) => ({
  summaryReport,
  summaryUser,
  loading: loading.effects['report/getSummaryReportById'],
}))(ReportDetail);
