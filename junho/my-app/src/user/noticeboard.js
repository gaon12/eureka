import React, { useState, useEffect } from "react";
import { Typography, Table, Card, Pagination } from "antd";
import { useNoticesData } from "./useNoticesData"; // 커스텀 훅 가져오기
import NavBar from "./navbar";

const columns = [
  {
    title: "No",
    dataIndex: "notice_id", // API 응답에 따라 적절한 키를 지정해야 합니다.
    key: "notice_id",
  },
  {
    title: "제목",
    dataIndex: "title", // API 응답에 따라 적절한 키를 지정해야 합니다.
    key: "title",
  },
  {
    title: "작성자",
    dataIndex: "author", // API 응답에 따라 적절한 키를 지정해야 합니다.
    key: "author",
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

const Noticeboard = () => {
  const [page, setPage] = useState(1);
  const noticesData = useNoticesData(); // 공지사항 데이터 가져오기
  const itemsPerPage = 10;
  const totalPages = Math.ceil(noticesData.length / itemsPerPage);

  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    setCurrentData(noticesData.slice(startIdx, endIdx));
  }, [page, noticesData]);

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
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.08)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Table
            dataSource={currentData}
            columns={columns}
            pagination={false}
          />
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              current={page}
              total={totalPages * itemsPerPage}
              onChange={(page) => setPage(page)}
              showSizeChanger={false}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default Noticeboard;
