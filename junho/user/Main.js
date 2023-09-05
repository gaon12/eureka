import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseString } from "xml2js";
import { Table, Typography, Divider, Card, Layout, Button } from "antd";
import NavBar from "./navbar";

const { Title } = Typography;
const { Content } = Layout;

function Main() {
  const [newsData, setNewsData] = useState([]);
  const [noticesData, setNoticesData] = useState([]); // 공지사항 데이터를 저장할 상태 추가

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const response = await axios.get(
          "https://apis.uiharu.dev/fixcors/api.php?url=https://www.korea.kr/rss/policy.xml"
        );
        parseString(response.data, (err, result) => {
          const newsArray = result.rss.channel[0].item
            .slice(0, 5)
            .map((newsItem) => ({
              title: newsItem.title[0],
              link: newsItem.link[0],
              pubDate: newsItem.pubDate[0],
            }));
          setNewsData(newsArray);
        });
      } catch (error) {
        console.error("Error fetching RSS feed", error);
      }
    };

    const fetchNotices = async () => {
      try {
        const response = await axios.get("/notice"); // 공지사항 API 엔드포인트로 요청
        setNoticesData(response.data.results); // 결과를 상태에 저장
      } catch (error) {
        console.error("Error fetching notices", error);
      }
    };

    fetchRSS();
    fetchNotices(); // 공지사항 가져오기 함수 호출
  }, []);

  const newsColumns = [
    {
      title: "뉴스 제목",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
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
      render: (text, record) => (
        <span key={record.pubDate}>{new Date(text).toLocaleDateString()}</span>
      ),
    },
  ];

  const noticesColumns = [
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a
          href={`/noticeboard/${record.notice_id}`} // 링크 설정
          target="_blank"
          rel="noopener noreferrer"
          key={record.notice_id}
        >
          {text}
        </a>
      ),
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

  return (
    <>
      <NavBar />
      <Layout style={{ padding: 0, margin: 0 }}>
        <Content>
          <div className="responsive-container">
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
              <Table
                dataSource={newsData}
                columns={newsColumns}
                pagination={false}
                rowClassName="newsRow"
                rowKey="link"
              />
            </Card>

            <Card style={{ border: "none", marginTop: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Title level={2}>공지사항</Title>
              </div>
              <Divider />
              <Table
                dataSource={noticesData} // 공지사항 데이터 사용
                columns={noticesColumns} // 공지사항 칼럼 사용
                pagination={false}
                rowClassName="newsRow"
                rowKey="notice_id"
              />
            </Card>
          </div>
        </Content>

        <style>{`
          // 여기에 필요한 글로벌 스타일을 추가하세요
        `}</style>
      </Layout>
    </>
  );
}

export default Main;
