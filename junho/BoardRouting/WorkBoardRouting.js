/*
/workboard/{w_l_id} 로 오는 것을 처리함.
*/

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Card, Typography, Layout, Breadcrumb } from 'antd';
import axios from 'axios';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function WorkList() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    axios.get('https://test.com/work')
      .then(response => {
        setWorks(response.data.results);
      })
      .catch(error => {
        console.error('There was an error fetching the work logs!', error);
      });
  }, []);

  return (
    <Layout>
      <Header style={{ backgroundColor: '#fff' }}>
        <Title level={2}>업무 일지</Title>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>업무 일지</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          {works.map(work => (
            <Link key={work.w_l_id} to={`/workboard/${work.w_l_id}`}>
              <Card title={`업무 일지 ${work.w_l_id}`} style={{ margin: '10px' }}>
                <p>{work.w_content}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Content>
    </Layout>
  );
}

function WorkDetail({ match }) {
  const [work, setWork] = useState(null);

  useEffect(() => {
    axios.get(`https://test.com/workboard/${match.params.w_l_id}`)
      .then(response => {
        setWork(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the work log!', error);
      });
  }, [match.params.w_l_id]);

  if (!work) {
    return null;
  }

  return (
    <Layout>
      <Header style={{ backgroundColor: '#fff' }}>
        <Title level={2}>업무 일지 {work.w_l_id}</Title>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/work">업무 일지</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>세부사항</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Paragraph>업무 내용: {work.w_content}</Paragraph>
          <Paragraph>시작 시간: {new Date(work.w_start).toLocaleString()}</Paragraph>
          <Paragraph>종료 시간: {new Date(work.w_end).toLocaleString()}</Paragraph>
          <Paragraph>작성 시간: {new Date(work.w_w_datetime).toLocaleString()}</Paragraph>
        </div>
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Route path="/work" exact component={WorkList} />
      <Route path="/workboard/:w_l_id" component={WorkDetail} />
    </Router>
  );
}

export default App;
