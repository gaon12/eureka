import { Layout,Card,Typography } from "antd";
import Header from "./Header";
import AllTable from "./aTable";
import { useRecoilState } from "recoil";
import {articleDataState, articleColumnsState } from './dataState';

export default function Article() {
  const { Content } = Layout;
  const [articleData, setArticlData] = useRecoilState(articleDataState);
  const [articleColumns, setArticleColumns] = useRecoilState(articleColumnsState);
  const { Title } = Typography;
  return (
    <>
      <Header />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <Card style={{boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}>
          <Title level={5}>민원 내역</Title>
          <div
          style={{
            backgroundColor: "#eaeaea",
            padding: "10px 20px",
            lineHeight: "1.5em",
            marginBottom: "5px",
          }}
        >
          {`총  ${articleData.length}건`}
        </div>
          <AllTable columns={articleColumns} data={articleData}/>
        </Card>
      </Content>
    </>
  );
}
