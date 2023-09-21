import React, { useEffect, useState } from "react";
import { Typography, Table, Card, Layout } from "antd";
import { Link } from "react-router-dom";
import NavBar from "./navbar";
import { useNewsData } from "./useNewsData"; // 뉴스 데이터를 가져오는 훅
import { useNoticesData } from "./useNoticesData"; // 공지사항 데이터를 가져오는 훅

const { Title } = Typography;
const { Content } = Layout;

function Main() {
  const newsData = useNewsData(); // 모든 뉴스 데이터 가져오기
  const noticesData = useNoticesData(); // 모든 공지사항 데이터 가져오기

  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetch("https://apis.uiharu.dev/weather/result/3011059000.json")
      .then((response) => response.json())
      .then((data) => {
        const weatherDescription = data.channel.item.description.body.data;
        const formattedData = [
          {
            key: "1",
            발표일시: data.channel.pubDate.replace("(","").replace(")","").replace(":00","시 정각"),
            지역: data.channel.item.category,
            하늘상태: weatherDescription.wfKor,
            강수확률: `${weatherDescription.pop}%`,
            최저기온: `${weatherDescription.tmn}°C`,
            최고기온: `${weatherDescription.tmx}°C`,
            풍속: `${parseFloat(weatherDescription.ws).toFixed(1)}m/s`,
          },
        ];
        setWeatherData(formattedData);
      })
      .catch((error) => console.error("Error fetching the weather data", error));
  }, []);

  const columns = [
    {
      title: "발표일시",
      dataIndex: "발표일시",
      key: "발표일시",
      align: 'center'
    },
    {
      title: "지역",
      dataIndex: "지역",
      key: "지역",
      align: 'center'
    },
    {
      title: "하늘상태",
      dataIndex: "하늘상태",
      key: "하늘상태",
      align: 'center'
    },
    {
      title: "강수확률",
      dataIndex: "강수확률",
      key: "강수확률",
      align: 'center'
    },
    {
      title: "최저기온",
      dataIndex: "최저기온",
      key: "최저기온",
      align: 'center'
    },
    {
      title: "최고기온",
      dataIndex: "최고기온",
      key: "최고기온",
      align: 'center'
    },
    {
      title: "풍속",
      dataIndex: "풍속",
      key: "풍속",
      align: 'center'
    },
  ];

  const newsColumns = [
    {
      title: "뉴스 제목",
      dataIndex: "title",
      key: "title",
      align: 'center',  // 여기를 추가했습니다
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
      align: 'center',  // 여기를 추가했습니다
      render: (text, record) => (
        <span key={record.pubDate}>{new Date(text).toLocaleDateString()}</span>
      ),
    },
  ];
  
  const noticesColumns = [
    {
      title: "No",
      dataIndex: "notice_id",
      key: "notice_id",
      align: 'center',  // 여기를 추가했습니다
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      align: 'center',
      render: (text, record) => (
        <Link to={`/noticeboard/${record.notice_id}`}>{text}</Link> 
      ),
    },
    {
      title: "작성일",
      dataIndex: "noti_w_date",
      key: "noti_w_date",
      align: 'center',  // 여기를 추가했습니다
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
                <Title level={2}>오늘의 날씨</Title>
              </div>
              {weatherData ? (
                <Table dataSource={weatherData} columns={columns} pagination={false} />
              ) : (
                <div>Loading...</div>
              )}
            </Card>
            
            <Card style={{ border: "none", marginTop: 20 }}>
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
              <Table
                dataSource={newsData.slice(0, 5)} // 처음 5개의 뉴스 항목만 표시
                columns={newsColumns}
                pagination={false}
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
                <Link to="/noticeboard"
                >
                  더보기
                </Link>
              </div>
              <Table
                dataSource={noticesData.slice(0, 5)} // 처음 5개의 공지사항 항목만 표시
                columns={noticesColumns}
                pagination={false}
                rowKey="notice_id" // API 응답에 따라 적절한 키를 지정해야 합니다.
              />
            </Card>
          </div>
        </Content>

        {/* 스타일을 여기에 추가하세요 */}
        <style>{`
          .responsive-container {
            padding: 24px;
            background: #f4f4f4;
            min-height: 100vh;
          }
          .ant-table {
            background: #fff;
          }
        `}</style>
      </Layout>
    </>
  );
}

export default Main;
