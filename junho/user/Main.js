import React from "react";
import {
  Table,
  Typography,
  Divider,
  Card,
  Layout
} from "antd";
import NavBar from "./navbar";

const { Title } = Typography;
const { Content } = Layout;

function createNotice(name) {
  return { name };
}

function createNews(title) {
  return { title };
}

const rows = [
  createNotice("공지사항1"),
  createNotice("공지사항2"),
  createNotice("공지사항3"),
  createNotice("공지사항4"),
  createNotice("공지사항5")
].slice(0, 6);

const news = [
  createNews("뉴스1"),
  createNews("뉴스2"),
  createNews("뉴스3"),
  createNews("뉴스4"),
  createNews("뉴스5")
].slice(0, 6);

function Main() {
  const noticeColumns = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
  ];

  const newsColumns = [
    {
      title: "뉴스 제목",
      dataIndex: "title",
      key: "title",
      render: (text) => <span>{text}</span>,
    },
  ];

  return (
    <>
      <NavBar />
      <Layout style={{ padding: 0, margin: 0 }}>
        <Content>
          <div className="responsive-container">
            <Card style={{ marginBottom: "20px", border: "none" }}>
              <Title level={2}>공지사항</Title>
              <Divider />
              <Table
                dataSource={rows}
                columns={noticeColumns}
                pagination={false}
                rowClassName="noticeRow"
              />
            </Card>

            <Card style={{ border: "none" }}>
              <Title level={2}>최신뉴스</Title>
              <Divider />
              <Table
                dataSource={news}
                columns={newsColumns}
                pagination={false}
                rowClassName="newsRow"
              />
            </Card>
          </div>
        </Content>

        <style jsx global>{`
          
        `}</style>
      </Layout>
    </>
  );
}

export default Main;
