import { useMemo } from "react";
import { Card, Typography } from "antd";
import { useParams } from "react-router-dom";
import NavBar from "./navbar";
import { sanitizeHtml } from "../utils/sanitizeHtml";
import type { NoticeItem } from "../types/domain";

const { Title, Text } = Typography;

interface NoticePageProps {
  noticesData: NoticeItem[];
}

interface RenderNotice extends NoticeItem {
  summary: string;
}

const cleanHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.body.querySelectorAll("p").forEach((paragraph) => {
    if (/^(\s|<br>|&nbsp;)*$/.test(paragraph.innerHTML)) {
      paragraph.remove();
    }
  });

  return sanitizeHtml(doc.body.innerHTML);
};

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

function NoticePage({ noticesData }: NoticePageProps) {
  const { notice_id } = useParams<{ notice_id: string }>();

  const noticeData = useMemo<RenderNotice | null>(() => {
    const dataId = Number(notice_id);
    const currentNoticeData = noticesData.find((notice) => notice.notice_id === dataId);

    if (!currentNoticeData) {
      return null;
    }

    return {
      ...currentNoticeData,
      content: cleanHTML(currentNoticeData.content),
      summary: cleanHTML(currentNoticeData.summary ?? "요약 내용 없음"),
      noti_category: getCategoryName(currentNoticeData.noti_category),
    };
  }, [notice_id, noticesData]);

  return (
    <>
      <NavBar />
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f0f2f5",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {noticeData ? (
          <Card
            style={{
              borderRadius: "15px",
              overflow: "",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Title level={2} style={{ marginBottom: "16px", color: "#003366" }}>
              {noticeData.title}
            </Title>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <Text strong>분류: {noticeData.noti_category}</Text>
              <Text type="secondary">
                작성일: {new Date(noticeData.noti_w_date).toLocaleDateString()}
              </Text>
            </div>

            <Title level={3} style={{ marginBottom: "16px", color: "#003366" }}>
              내용
            </Title>
            <div
              style={{
                marginBottom: "5px",
                borderRadius: "8px",
                width: "95%",
                padding: "16px",
                border: "1px solid #ccc",
                whiteSpace: "pre-wrap",
                backgroundColor: "#fff",
              }}
              dangerouslySetInnerHTML={{ __html: noticeData.content }}
            />

            <Title level={3} style={{ marginBottom: "6px", color: "#003366" }}>
              요약 내용
            </Title>
            <div
              style={{
                borderRadius: "8px",
                width: "95%",
                padding: "16px",
                border: "1px solid #ccc",
                whiteSpace: "pre-wrap",
                backgroundColor: "#fff",
              }}
              dangerouslySetInnerHTML={{ __html: noticeData.summary }}
            />
          </Card>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", fontSize: "18px" }}>데이터가 없음</div>
        )}
      </div>
    </>
  );
}

export default NoticePage;
