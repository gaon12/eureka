import Header from "./Header";
import { Layout, Typography, Card, Divider } from "antd";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { articleDataState } from "./dataState";
import "../admin/adminstyles.css";
import { sanitizeHtml } from "../utils/sanitizeHtml";

export default function ArticleContent() {
  const { Title } = Typography;
  const { Content } = Layout;

  const { article_id } = useParams<{ article_id: string }>();

  const [articleData] = useRecoilState(articleDataState);

  const dataId = Number(article_id);

  // find 메서드를 사용하여 ID를 기반으로 데이터를 찾습니다.
const data = articleData.find((article) => article.complaint_id === dataId);

// 데이터가 없는 경우에 대한 처리를 추가합니다.
if (!data) {
  return <div>Data not found</div>;
}


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
                alignItems: "center", 
                marginBottom: "16px",
                color: "#003366",
              }}
            >
              <div>내용</div>
              <div>작성일: {writeDate}</div>
            </div>
          </Title>
          <div
            className="content-container"
            style={{
              marginBottom: "5px",
              borderRadius: "8px",
              padding: "16px",
              height: "100%",
              border: "1px solid #ccc",
              whiteSpace: "pre-wrap",
              backgroundColor: "#fff"
            }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.content2) }}
          />
        </Card>
      </Content>
    </>
  );
}

