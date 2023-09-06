import React, { useState, useEffect } from "react";
import { Table, Pagination, Input } from "antd";
import NavBar from "./navbar";

const NewsTable = () => {
  const [setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const columns = [
    { title: "제목", dataIndex: "title", key: "title" },
    { title: "설명", dataIndex: "description", key: "description" },
    { title: "날짜", dataIndex: "pubDate", key: "pubDate" },
    { title: "안내", dataIndex: "guid", key: "guid" }
  ];

  useEffect(() => {
    // Node.js 서버의 API 엔드포인트를 호출합니다.
    fetch("http://43.202.151.155:3002/api/news")
      .then((response) => response.json())
      .then((parsedData) => {
        setData(parsedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
    <NavBar />
    <div style={{ width: "100%" }}>
      <Input.Search
        placeholder="제목 또는 설명 검색"
        onSearch={(value) => setSearchText(value)}
        style={{ width: "100%", marginBottom: "20px" }}
      />
      <Table
        columns={columns}
        dataSource={data}
        rowKey="guid"
        pagination={false}
      />
      <Pagination
        current={page}
        total={data.length}
        onChange={(page) => setPage(page)}
        showSizeChanger={false}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </div>
    </>
  );
};

export default NewsTable;
