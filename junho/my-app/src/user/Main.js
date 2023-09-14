import React from "react";
import { Typography, Table, Card, Layout } from "antd";
import { Link } from "react-router-dom";
import NavBar from "./navbar";
import { useNewsData } from "./useNewsData"; // 뉴스 데이터를 가져오는 훅
import { useNoticesData } from "./useNoticesData"; // 공지사항 데이터를 가져오는 훅

const { Title } = Typography;
const { Content } = Layout;

function Main() {
  const newsData = useNewsData(); // 모든 뉴스 데이터 가져오기
  const noticesData = useNoticesData(); // 모든 공지사항 데이터 가져오기

  const newsColumns = [
    {
      title: "뉴스 제목",
      dataIndex: "title",
      key: "title",
      align: 'left',  // 여기를 추가했습니다
      render: (text, record) => (
        <a
          href={record.link}
          target="_blank"
          rel="noopener noreferrer"
          key={record.link}
        >
          {text}
        </a>
      ),
    },
    {
      title: "날짜",
      dataIndex: "pubDate",
      key: "pubDate",
      align: 'left',  // 여기를 추가했습니다
      render: (text, record) => (
        <span key={record.pubDate}>{new Date(text).toLocaleDateString()}</span>
      ),
    },
  ];
  
  const noticesColumns = [
    {
      title: "No",
      dataIndex: "notice_id",
      key: "notice_id",
      align: 'left',  // 여기를 추가했습니다
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      align: 'left',  // 여기를 추가했습니다
      render: (text, record, index) => (
        <Link to={`/noticeboard/${index}`}>{text}</Link>
      ),
    },
    {
      title: "작성일",
      dataIndex: "noti_w_date",
      key: "noti_w_date",
      align: 'left',  // 여기를 추가했습니다
      render: (text, record) => (
        <span key={record.noti_w_date}>{new Date(text).toLocaleDateString()}</span>
      ),
    },
  ];
  

  return (
    <>
      <NavBar />
      <Layout style={{ padding: 0, margin: 0 }}>
        <Content>
          <div className="responsive-container">
            <Card style={{ border: "none" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Title level={2}>최신뉴스</Title>
                <a
                  href="https://www.korea.kr/main.do"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  더보기
                </a>
              </div>
              <Table
                dataSource={newsData.slice(0, 5)} // 처음 5개의 뉴스 항목만 표시
                columns={newsColumns}
                pagination={false}
                rowKey="link"
              />
            </Card>

            <Card style={{ border: "none", marginTop: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Title level={2}>공지사항</Title>
              </div>
              <Table
                dataSource={noticesData.slice(0, 5)} // 처음 5개의 공지사항 항목만 표시
                columns={noticesColumns}
                pagination={false}
                rowKey="notice_id" // API 응답에 따라 적절한 키를 지정해야 합니다.
              />
            </Card>
          </div>
        </Content>

        {/* 스타일을 여기에 추가하세요 */}
        <style>{`
          .responsive-container {
            padding: 24px;
            background: #f4f4f4;
            min-height: 100vh;
          }
          .ant-table {
            background: #fff;
          }
        `}</style>
      </Layout>
    </>
  );
}

export default Main;
