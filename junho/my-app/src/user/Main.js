import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Typography, Divider, Card, Layout } from "antd";
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
      render: (text, record) => (
        <span key={record.pubDate}>{new Date(text).toLocaleDateString()}</span>
      ),
    },
  ];

  const noticesColumns = [
    {
      title: "제목",
      dataIndex: "title", // API 응답에 따라 적절한 키를 지정해야 합니다.
      key: "title",
      render: (text, record) => (
        <a
          href={`/noticeboard/${record.notice_id}`} // 링크 설정
          target="_blank"
          rel="noopener noreferrer"
          key={record.notice_id}
        >
          {text}
        </a>
      ),
    },
    {
      title: "작성일",
      dataIndex: "noti_w_date", // API 응답에 따라 적절한 키를 지정해야 합니다.
      key: "noti_w_date",
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
              <Divider />
              <Table
                dataSource={newsData.slice(0, 5)} // 처음 5개의 뉴스 항목만 표시
                columns={newsColumns}
                pagination={false}
                rowClassName="newsRow"
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
              <Divider />
              <Table
                dataSource={noticesData.slice(0, 5)} // 처음 5개의 공지사항 항목만 표시
                columns={noticesColumns}
                pagination={false}
                rowClassName="newsRow"
                rowKey="notice_id" // API 응답에 따라 적절한 키를 지정해야 합니다.
              />
            </Card>
          </div>
        </Content>

        <style>{`
          // 여기에 필요한 글로벌 스타일을 추가하세요
        `}</style>
      </Layout>
    </>
  );
}

export default Main;
