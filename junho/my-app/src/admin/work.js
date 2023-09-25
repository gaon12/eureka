import { Layout, Typography, Card, Button } from "antd";
import { useRecoilState } from "recoil";
import { workDataState,workColumnsStata } from "./dataState";
import AllTable from "../admin/aTable";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useEffect } from "react";

export default function Work() {
  
  const navi = useNavigate();
  const pathNavi = (path)=>{
    navi(path)
  };

  const { Content } = Layout;
  const { Title } = Typography;
  
  const [workData, setWorkData] = useRecoilState(workDataState);
  const [workColumns, setWorkColumns] = useRecoilState(workColumnsStata);
  useEffect(()=>{
    
  },[workData])
  return (
    <>
    <Header/>
    <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
      
      <Card style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Title level={5}>업무일지</Title>
        <AllTable columns={workColumns} data={workData} />
        <div style={{display:'flex', justifyContent:'flex-end',marginTop:'15px'}}><Button type="primary" onClick={()=>pathNavi('/WorkWrite')}>업무일지작성</Button></div>
      </Card>
    </Content>
    </>
    
  );
}