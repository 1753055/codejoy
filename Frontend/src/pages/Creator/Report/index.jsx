import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { Table, Input } from 'antd';
import { useHistory, connect } from 'umi';
import '@/components/GlobalHeader/style.less';
import NoData from '@/components/NoData';

const { Search } = Input;
const Report = ({ reportList, dispatch, loading }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(reportList);
  }, [reportList]);

  const onSearch = (value) => {
    const searchList = [];
    reportList.forEach((report) => {
      if (report.ReportName.includes(value)) {
        searchList.push(report);
      }
    });
    setList(searchList);
  };

  const history = useHistory();
  const columns = [
    {
      title: 'Name',
      dataIndex: 'ReportName',
      key: 'ReportName',
    },
    {
      title: 'Percent Pass',
      dataIndex: 'PercentPass',
      key: 'PercentPass',
    },
  ];

  useEffect(() => {
    dispatch({ type: 'report/fetchReportList' });
  }, []);

  return (
    <div className={`${styles.container} custom`}>
      <Search
        placeholder="input search text"
        enterButton
        className={styles.searchBar}
        onSearch={onSearch}
      />
      <Table
        loading={loading}
        dataSource={list}
        columns={columns}
        locale={{ emptyText: NoData }}
        style={{ cursor: 'pointer' }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              console.log(record);
              history.push({
                pathname: '/creator/report/detail',
                query: {
                  id: record.ID,
                },
              });
            }, // click row
          };
        }}
      />
    </div>
  );
};

export default connect(({ report: { reportList }, loading }) => ({
  reportList,
  loading: loading.effects['report/fetchReportList'],
}))(Report);
