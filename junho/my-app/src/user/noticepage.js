import React, { useState, useEffect } from "react";
import { Typography, Card } from "antd";
import NavBar from "./navbar";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

function NoticePage(props) {
  const { noticesData } = props;
  const [noticeData, setNoticeData] = useState(null);

  let notice_id = useParams();

  const cleanHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.body.querySelectorAll("p").forEach((p) => {
      if (/^(\s|<br>|&nbsp;)*$/.test(p.innerHTML)) {
        p.remove();
      }
    });

    doc.body.querySelectorAll("img").forEach((img) => {
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

  useEffect(() => {
    const dataId = parseInt(notice_id.notice_id, 10);
    let currentNoticeData = noticesData.find((notice) => notice.notice_id === dataId);
    
    if (currentNoticeData) {
      let updatedNoticeData = {
        ...currentNoticeData, 
        content: cleanHTML(currentNoticeData.content),
        summary: cleanHTML(currentNoticeData.summary === null ? "요약 내용 없음" : currentNoticeData.summary),
        noti_category: getCategoryName(currentNoticeData.noti_category),
      };
      setNoticeData(updatedNoticeData);
    } else {
      setNoticeData(null);
    }
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
              dangerouslySetInnerHTML={{ __html: noticeData.content}}
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
          <div
            style={{ padding: "20px", textAlign: "center", fontSize: "18px" }}
          >
            데이터가 없음
          </div>
        )}
      </div>
    </>
  );
}

export default NoticePage;