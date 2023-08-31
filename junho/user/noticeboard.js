import React, { useState } from "react";
import { Typography, Table, Card, Pagination } from "antd";
import NavBar from "./navbar";

// 예시 데이터
const data = [
  { key: 1, title: "첫번째 공지", author: "관리자", date: "2023-07-31" },
  { key: 2, title: "두번째 공지", author: "관리자", date: "2023-07-31" },
  // ... 기타 데이터를 추가하실 수 있습니다
];

const columns = [
  {
    title: "No",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "제목",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "작성자",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "작성일",
    dataIndex: "date",
    key: "date",
  },
];

const Noticeboard = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / 10); // 10개의 항목을 표시할 경우. data의 길이에 따라 총 페이지를 계산합니다.
  return (
    <>
      <NavBar />
      <div
        style={{ padding: "24px", background: "#f4f4f4", minHeight: "100vh" }}
      >
        <Typography.Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "#4a4a4a",
          }}
        >
          공지사항
        </Typography.Title>

        <Card
          bordered
          style={{
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.08)", // 그림자 효과 추가
            display: "flex", // Flexbox 설정
            flexDirection: "column", // 세로 방향으로 항목 정렬
          }}
        >
          <Table
            dataSource={data}
            columns={columns}
            pagination={false} // 내장된 페이징 기능을 꺼둡니다.
          // ... (기존의 Table 설정)
          />
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                marginTop: "15px",
                width: "100%",  // 이 부분을 추가했습니다.
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination
                current={page}
                total={totalPages * 10}
                onChange={(page) => setPage(page)}
                showSizeChanger={false}
                style={{ marginTop: "20px", textAlign: "center" }}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Noticeboard;
