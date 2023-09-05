import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseString } from "xml2js";
import { Table, Typography, Divider, Card, Layout, Button } from "antd";
import NavBar from "./navbar";

const { Title } = Typography;
const { Content } = Layout;

function createNotice(name) {
  return { name };
}

function Main() {
  const [newsData, setNewsData] = useState([]);

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
              pubDate: newsItem.pubDate[0]
            }));
          setNewsData(newsArray);
        });
      } catch (error) {
        console.error("Error fetching RSS feed", error);
      }
    };
    fetchRSS();
  }, []);

  const rows = [
    createNotice("공지사항1"),
    createNotice("공지사항2"),
    createNotice("공지사항3"),
    createNotice("공지사항4"),
    createNotice("공지사항5")
  ].slice(0, 6);

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
      )
    },
    {
      title: "날짜",
      dataIndex: "pubDate",
      key: "pubDate",
      render: (text, record) => (
        <span key={record.pubDate}>{new Date(text).toLocaleDateString()}</span>
      )
    }
  ];

  return (
    <>
      <Layout style={{ padding: 0, margin: 0 }}>
        <Content>
          <div className="responsive-container">
            <Card style={{ border: "none" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Title level={2}>최신뉴스</Title>
                <a
                  href="https://www.korea.kr/main.do"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  더보기(제공: 대한민국 정책브리핑)
                </a>
              </div>
              <Divider />
              <Table
                dataSource={newsData}
                columns={newsColumns}
                pagination={false}
                rowClassName="newsRow"
                rowKey={(record) => record.link}
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
