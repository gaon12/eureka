import { Layout, Card,Typography} from "antd";
import Header from "./Header";
import AllTable from "./aTable";
import { useRecoilState } from "recoil";
import {carDataState, carColumnsState } from './dataState';
export default function ParkInfo() {
  const { Content } = Layout;
  const [carData, setCarData] = useRecoilState(carDataState);
  const [carColumns, setCarColums] = useRecoilState(carColumnsState);
  const { Title } = Typography;
  return (
    
      <>
      <Header />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <Card style={{boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}>
        <Title level={5}>주차등록 내역</Title>
        <div
          style={{
            backgroundColor: "#eaeaea",
            padding: "10px 20px",
            lineHeight: "1.5em",
            marginBottom: "5px",
          }}
        >
          {`총 주차등록 ${carData.length}건`}
        </div>
          <AllTable columns={carColumns} data={carData}/>
        </Card>
      </Content>
    </>
  
  );
}
