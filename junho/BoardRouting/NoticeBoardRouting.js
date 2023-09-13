/*
/noticeboard/{notice_id} 로 오는 것을 처리함.
*/

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Card, Typography, Layout, Breadcrumb } from "antd";
import axios from "axios";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function NoticeList() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios
      .get("https://test.com/notice")
      .then((response) => {
        setNotices(response.data.results);
      })
      .catch((error) => {
        console.error("There was an error fetching the notices!", error);
      });
  }, []);

  return (
    <Layout>
      <Header style={{ backgroundColor: "#fff" }}>
        <Title level={2}>공지사항</Title>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>공지사항</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          {notices.map((notice) => (
            <Link
              key={notice.notice_id}
              to={`/noticeboard/${notice.notice_id}`}
            >
              <Card title={notice.title} style={{ margin: "10px" }}>
                <p>{notice.summary}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Content>
    </Layout>
  );
}

function NoticeDetail({ match }) {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    axios
      .get(`https://test.com/noticeboard/${match.params.notice_id}`)
      .then((response) => {
        setNotice(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the notice!", error);
      });
  }, [match.params.notice_id]);

  if (!notice) {
    return null;
  }

  return (
    <Layout>
      <Header style={{ backgroundColor: "#fff" }}>
        <Title level={2}>{notice.title}</Title>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/">공지사항</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>세부사항</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          <Paragraph>분류: {notice.noti_category}</Paragraph>
          <Paragraph>작성일: {notice.noti_w_date}</Paragraph>
          <Paragraph>내용: {notice.content}</Paragraph>
          <Paragraph>요약: {notice.summary || "없음"}</Paragraph>
          <Paragraph>작성자: {notice.noti_w_id}</Paragraph>
        </div>
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Route path="/" exact component={NoticeList} />
      <Route path="/noticeboard/:notice_id" component={NoticeDetail} />
    </Router>
  );
}

export default App;
