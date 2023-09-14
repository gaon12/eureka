import React, { useState, useEffect } from "react";
import { Typography, Table, Card, Pagination } from "antd";
import { Link } from "react-router-dom"; // 이 부분을 추가하세요
import NavBar from "./navbar";

const columns = [
  {
    title: "No",
    dataIndex: "notice_id",
    key: "notice_id",
  },
  {
    title: "제목",
    dataIndex: "title",
    key: "title",
    render: (text, record,index) => (
      <Link to={`/noticeboard/${index}`}>{text}</Link>
    ), // 여기서 각 제목을 Link 컴포넌트로 래핑하였습니다.
  },
  {
    title: "카테고리",
    dataIndex: "noti_category",
    key: "noti_category",
  },
  {
    title: "작성일",
    dataIndex: "noti_w_date",
    key: "noti_w_date",
    render: (text, record) => (
      <span key={record.noti_w_date}>{new Date(text).toLocaleDateString()}</span>
    ),
  },
];

const Noticeboard = (props) => {
  const {noticesData} = props
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(noticesData.length / itemsPerPage);
  
  
  const [currentData, setCurrentData] = useState([]);
  
  useEffect(() => {
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    console.log(noticesData)
    setCurrentData(noticesData.slice(startIdx, endIdx));
  }, [page, noticesData]);

  return (
    <>
      <NavBar />
      <div style={{ padding: "24px", background: "#f4f4f4", minHeight: "100vh" }}>
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
          <Table dataSource={currentData} columns={columns} pagination={false} />
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
