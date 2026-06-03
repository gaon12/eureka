import { useMemo, useState } from "react";
import { Card, Pagination, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import NavBar from "./navbar";
import type { NoticeItem } from "../types/domain";

interface NoticeboardProps {
  noticesData: NoticeItem[];
}

interface NoticeListRow extends NoticeItem {
  noti_category: string;
}

const ITEMS_PER_PAGE = 10;

const getCategoryName = (categoryNumber: number | string): string => {
  switch (Number(categoryNumber)) {
    case 1:
      return "공지사항";
    case 2:
      return "이벤트";
    case 3:
      return "업데이트";
    default:
      return "기타";
  }
};

const columns: ColumnsType<NoticeListRow> = [
  {
    title: "No",
    dataIndex: "notice_id",
    key: "notice_id",
  },
  {
    title: "제목",
    dataIndex: "title",
    key: "title",
    render: (text: string, record) => (
      <Link to={`/noticeboard/${record.notice_id}`}>{text}</Link>
    ),
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
    render: (text: string) => <span>{new Date(text).toLocaleDateString()}</span>,
  },
];

const Noticeboard = ({ noticesData }: NoticeboardProps) => {
  const [page, setPage] = useState(1);

  const currentData = useMemo(() => {
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    return noticesData
      .map((notice): NoticeListRow => ({
        ...notice,
        noti_category: getCategoryName(notice.noti_category),
      }))
      .slice(startIdx, startIdx + ITEMS_PER_PAGE);
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
          <Table<NoticeListRow>
            dataSource={currentData}
            columns={columns}
            pagination={false}
            rowKey="notice_id"
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
              total={noticesData.length}
              onChange={setPage}
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
