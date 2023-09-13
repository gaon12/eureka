import React, { useState } from "react";
import { Table, Typography, Divider, Card, Pagination } from "antd";
import { useNewsData } from "./useNewsData"; // 훅 가져오기
import NavBar from "../user/navbar";

const { Title } = Typography;

function News() {
  const newsData = useNewsData(10); // 훅을 사용하여 뉴스 데이터 가져오기
  const [currentPage, setCurrentPage] = useState(1);

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

  const pageSize = 10;
  const totalItems = newsData.length;

  return (
    <>
    <NavBar />
    <div>
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
          dataSource={newsData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          columns={newsColumns}
          pagination={false}
          rowClassName="newsRow"
          rowKey="link"
        />
      </Card>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Pagination 
          current={currentPage}
          onChange={setCurrentPage}
          total={totalItems} 
          pageSize={pageSize} 
          showSizeChanger={false} 
        />
      </div>
    </div>
    </>
  );
}

export default News;
