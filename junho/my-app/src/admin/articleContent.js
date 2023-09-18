import Header from "../admin/Header";
import { Layout, Typography, Card, Divider } from "antd";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { articleDataState } from "./dataState";

export default function ArticleContent() {
  const { Title } = Typography;
  const { Content } = Layout;

  // work_id를 문자열로 추출
  let article_id = useParams();

  const [articleData, setArticleData] = useRecoilState(articleDataState);

  // work_id를 문자열에서 숫자로 변환

  const dataId = parseInt(article_id.article_id);

  const data = articleData[dataId];
  const createdDate = new Date(data.created_datetime);
  const writeDate = createdDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <Card
          style={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title>{data.title}</Title>
          <Divider />
          <Title
            level={3}
            style={{
              marginBottom: "16px",
              color: "#003366",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center", // 추가: 내용을 세로 중앙 정렬
                marginBottom: "16px",
                color: "#003366",
              }}
            >
              <div>내용</div>
              <div>작성일: {writeDate}</div>
            </div>
          </Title>
          <div
            style={{
              marginBottom: "5px",
              borderRadius: "8px",
              padding: "16px",
              height: "350px",
              border: "1px solid #ccc",
              whiteSpace: "pre-wrap",
              backgroundColor: "#fff",
            }}
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </Card>
      </Content>
    </>
  );
}
