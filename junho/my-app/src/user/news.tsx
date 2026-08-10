import { useMemo, useState } from "react";
import { Card, Divider, Pagination, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNewsData } from "./useNewsData";
import NavBar from "../user/navbar";
import type { NewsItem } from "../types/domain";

const { Title } = Typography;
const PAGE_SIZE = 10;

const newsColumns: ColumnsType<NewsItem> = [
  {
    title: "뉴스 제목",
    dataIndex: "title",
    key: "title",
    render: (text: string, record) => (
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
    render: (text: string, record) => (
      <span key={record.pubDate}>{new Date(text).toLocaleDateString()}</span>
    ),
  },
];

function News() {
  const newsData = useNewsData();
  const [currentPage, setCurrentPage] = useState(1);

  const currentData = useMemo(
    () =>
      newsData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, newsData],
  );

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
          <Table<NewsItem>
            dataSource={currentData}
            columns={newsColumns}
            pagination={false}
            rowClassName="newsRow"
            rowKey="link"
          />
        </Card>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Pagination
            current={currentPage}
            onChange={setCurrentPage}
            total={newsData.length}
            pageSize={PAGE_SIZE}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
}

export default News;
