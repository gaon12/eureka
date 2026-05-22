import React, { useMemo } from "react";
import { Typography, Card } from "antd";
import NavBar from "./navbar";
import { useParams } from "react-router-dom";
import { sanitizeHtml } from "../utils/sanitizeHtml";

const { Title, Text } = Typography;

function NoticePage(props) {
  const { noticesData } = props;
  const { notice_id } = useParams();

  const cleanHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizeHtml(html), "text/html");

    doc.body.querySelectorAll("p").forEach((p) => {
      if (/^(\s|<br>|&nbsp;)*$/.test(p.innerHTML)) {
        p.remove();
      }
    });

    return doc.body.innerHTML;
  };

  const getCategoryName = (categoryNumber) => {
    switch (parseInt(categoryNumber, 10)) {
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

  const noticeData = useMemo(() => {
    const dataId = parseInt(notice_id, 10);
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
        {noticeData && (
          <Card
            style={{
              borderRadius: "15px",
              overflow: "hidden",
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
              <Text type="secondary">작성일: {new Date(noticeData.noti_w_date).toLocaleDateString()}</Text>
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
        )}
        {!noticeData && (
          <div style={{ padding: "20px", textAlign: "center", fontSize: "18px" }}>
            데이터가 없습니다.
          </div>
        )}
      </div>
    </>
  );
}

export default NoticePage;
