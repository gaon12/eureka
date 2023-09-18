import Header from "../admin/Header";
import { Layout, Typography, Card, Divider } from "antd";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { workDataState } from "./dataState";
import { useState, useEffect } from "react";

export default function WorkContent() {
  const { Title } = Typography;
  const { Content } = Layout;

  // work_id를 문자열로 추출
  let work_id = useParams();

  const [workData, setWorkData] = useRecoilState(workDataState);
  
  // work_id를 문자열에서 숫자로 변환


    const dataId = parseInt(work_id.work_id);
  
   const data = workData[dataId];

  
  return (
    <>
      <Header />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <Card
          style={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title>
            업무 시작 일시 : {data.w_start} 업무 종료 일시 :
            {data.w_end}
          </Title>
          <Divider />
          <Title level={3} style={{ marginBottom: "16px", color: "#003366" }}>
            내용
          </Title>
          <div
            style={{
              marginBottom: "5px",
              borderRadius: "8px",
              padding:'16px',
              height: '350px',
              border: "1px solid #ccc",
              whiteSpace: "pre-wrap",
              backgroundColor: "#fff",
              
            }}
            dangerouslySetInnerHTML={{ __html: data.w_content }}
          />
        </Card>
      </Content>
    </>
  );
}
