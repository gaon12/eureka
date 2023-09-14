import React, { useState, useEffect } from "react";
import { Typography, Card } from "antd";
import NavBar from "./navbar";

import { useParams } from "react-router-dom";
const { Title, Text } = Typography;

function NoticePage(props) {
  const { noticesData } = props;
  const [noticeData, setNoticeData] = useState(null);

  let notice_id = useParams();
  useEffect(() => {
    const dataId = parseInt(notice_id.notice_id);
    setNoticeData(noticesData[dataId]);
    console.log(notice_id);
    console.log(noticeData);
  }, [notice_id]);

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
                width: "100%",
                padding: "16px",
                border: "1px solid #ccc",
                whiteSpace: "pre-wrap",
                backgroundColor: "#fff", // 하얀색 배경 추가
              }}
              dangerouslySetInnerHTML={{ __html: noticeData.content2 }}
            />
            
            <Title level={3} style={{ marginBottom: "6px", color: "#003366" }}>
              요약 내용
            </Title>
            <div
              style={{ borderRadius: "8px", width: "100%", padding: "16px", border: "1px solid #ccc", whiteSpace: "pre-wrap", backgroundColor: "#fff" }}
              dangerouslySetInnerHTML={{ __html: noticeData.summary }}
            />
          </Card>
        )}
      </div>
    </>
  );
}

export default NoticePage;
