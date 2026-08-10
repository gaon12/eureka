import { Button, Card, Layout, Typography } from "antd";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { workColumnsStata, workDataState } from "./dataState";
import AllTable from "../admin/aTable";
import Header from "./Header";

export default function Work() {
  const navigate = useNavigate();
  const { Content } = Layout;
  const { Title } = Typography;

  const [workData] = useRecoilState(workDataState);
  const [workColumns] = useRecoilState(workColumnsStata);

  return (
    <>
      <Header />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <Card style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
          <Title level={5}>업무일지</Title>
          <AllTable columns={workColumns} data={workData} />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "15px",
            }}
          >
            <Button type="primary" onClick={() => navigate("/WorkWrite")}>
              업무일지작성
            </Button>
          </div>
        </Card>
      </Content>
    </>
  );
}
