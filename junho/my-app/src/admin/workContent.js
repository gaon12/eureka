import Header from "./Header";
import { Layout, Typography, Card, Divider } from "antd";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { workDataState } from "./dataState";
import "../admin/adminstyles.css";

export default function WorkContent() {
  const { Title } = Typography;
  const { Content } = Layout;

  let work_id = useParams(); // useParams에서 w_l_id를 직접 추출합니다.

  const [workData, setWorkData] = useRecoilState(workDataState);

  const dataId = parseInt(work_id.work_id);

  // find 메서드를 사용하여 ID를 기반으로 데이터를 찾습니다.
  const data = workData.find((work) => work.w_l_id === dataId);
  // 데이터가 없는 경우에 대한 처리를 추가합니다.
  if (!data) {
    console.log('Data not found', dataId, workData);
    return <div>Data not found</div>;
  }

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
            업무 시작 일시 : {data.w_start} 업무 종료 일시 :{data.w_end}
          </Title>
          <Divider />
          <Title level={3} style={{ marginBottom: "16px", color: "#003366" }}>
            내용
          </Title>
          <div
            className="content-workcontainer"
            style={{
              marginBottom: "5px",
              borderRadius: "8px",
              padding: "16px",
              height: "100%",
              border: "1px solid #ccc",
              whiteSpace: "pre-wrap",
              backgroundColor: "#fff",
            }}
            dangerouslySetInnerHTML={{ __html: data.w_content2 }}
          />
        </Card>
      </Content>
    </>
  );
}
