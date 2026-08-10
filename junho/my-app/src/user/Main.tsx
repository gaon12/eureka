import { useEffect, useState } from "react";
import { Card, Layout, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import NavBar from "./navbar";
import { useNewsData } from "./useNewsData";
import { useNoticesData } from "./useNoticesData";
import type { NewsItem, NoticeItem, WeatherRow } from "../types/domain";

const { Title } = Typography;
const { Content } = Layout;

interface WeatherApiResponse {
  channel: {
    pubDate: string;
    item: {
      category: string;
      description: {
        body: {
          data: {
            wfKor: string;
            pop: string | number;
            tmn: string | number;
            tmx: string | number;
            ws: string | number;
          };
        };
      };
    };
  };
}

const isWeatherApiResponse = (value: unknown): value is WeatherApiResponse =>
  typeof value === "object" && value !== null && "channel" in value;

const weatherColumns: ColumnsType<WeatherRow> = [
  {
    title: "발표일시",
    dataIndex: "발표일시",
    key: "발표일시",
    align: "center",
  },
  { title: "지역", dataIndex: "지역", key: "지역", align: "center" },
  {
    title: "하늘상태",
    dataIndex: "하늘상태",
    key: "하늘상태",
    align: "center",
  },
  {
    title: "강수확률",
    dataIndex: "강수확률",
    key: "강수확률",
    align: "center",
  },
  {
    title: "최저기온",
    dataIndex: "최저기온",
    key: "최저기온",
    align: "center",
  },
  {
    title: "최고기온",
    dataIndex: "최고기온",
    key: "최고기온",
    align: "center",
  },
  { title: "풍속", dataIndex: "풍속", key: "풍속", align: "center" },
];

const newsColumns: ColumnsType<NewsItem> = [
  {
    title: "뉴스 제목",
    dataIndex: "title",
    key: "title",
    align: "center",
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
    align: "center",
    render: (text: string, record) => (
      <span key={record.pubDate}>{new Date(text).toLocaleDateString()}</span>
    ),
  },
];

const noticesColumns: ColumnsType<NoticeItem> = [
  {
    title: "No",
    dataIndex: "notice_id",
    key: "notice_id",
    align: "center",
  },
  {
    title: "제목",
    dataIndex: "title",
    key: "title",
    align: "center",
    render: (text: string, record) => (
      <Link to={`/noticeboard/${record.notice_id}`}>{text}</Link>
    ),
  },
  {
    title: "작성일",
    dataIndex: "noti_w_date",
    key: "noti_w_date",
    align: "center",
    render: (text: string, record) => (
      <span key={record.noti_w_date}>
        {new Date(text).toLocaleDateString()}
      </span>
    ),
  },
];

function Main() {
  const newsData = useNewsData();
  const noticesData = useNoticesData();
  const [weatherData, setWeatherData] = useState<WeatherRow[]>([]);

  useEffect(() => {
    fetch("https://apis.uiharu.dev/weather/result/3011059000.json")
      .then((response) => response.json() as Promise<unknown>)
      .then((data) => {
        if (!isWeatherApiResponse(data)) {
          setWeatherData([]);
          return;
        }

        const weatherDescription = data.channel.item.description.body.data;
        setWeatherData([
          {
            key: "1",
            발표일시: data.channel.pubDate
              .replace("(", "")
              .replace(")", "")
              .replace(":00", "시 정각"),
            지역: data.channel.item.category,
            하늘상태: weatherDescription.wfKor,
            강수확률: `${weatherDescription.pop}%`,
            최저기온: `${weatherDescription.tmn}°C`,
            최고기온: `${weatherDescription.tmx}°C`,
            풍속: `${Number(weatherDescription.ws).toFixed(1)}m/s`,
          },
        ]);
      })
      .catch((error) =>
        console.error("Error fetching the weather data", error),
      );
  }, []);

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
              {weatherData.length > 0 ? (
                <Table<WeatherRow>
                  dataSource={weatherData}
                  columns={weatherColumns}
                  pagination={false}
                />
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
              <Table<NewsItem>
                dataSource={newsData.slice(0, 5)}
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
                <Link to="/noticeboard">더보기</Link>
              </div>
              <Table<NoticeItem>
                dataSource={noticesData.slice(0, 5)}
                columns={noticesColumns}
                pagination={false}
                rowKey="notice_id"
              />
            </Card>
          </div>
        </Content>

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
