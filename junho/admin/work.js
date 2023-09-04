import { Layout, Typography, Card, Button } from "antd";
import { useRecoilState } from "recoil";
import { workDataState } from "./dataState";
import AllTable from "../admin/aTable";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";

export default function Work() {
  
  const navi = useNavigate();
  const pathNavi = (path)=>{
    navi(path)
  };

  const { Content } = Layout;
  const { Title } = Typography;
  const workColumns = [
    {
      title: "작성자",
      dataIndex: "w_w_id",
    },
    {
      title: "업무 일지 내용",
      dataIndex: "w_content",
      
    },
    {
      title: "업무 시작 일시",
      dataIndex: "w_start",
      render: (text) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return formattedDate;
      },
    },
    {
      title: "업무 종료 일시",
      dataIndex: "w_end",
      render: (text) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return formattedDate;
      },
    },
    {
      title: "작성일",
      dataIndex: "w_w_datetime",
      render: (text) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return formattedDate;
      },
    },
  ];
  const [workData, setWorkData] = useRecoilState(workDataState);
  return (
    <>
    <Header/>
    <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
      
      <Card style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Title level={5}>업무일지</Title>
        <AllTable columns={workColumns} data={workData} />
        <div style={{display:'flex', justifyContent:'flex-end',marginTop:'15px'}}><Button type="primary" onClick={()=>pathNavi('/workWrite')}>업무일지작성</Button></div>
      </Card>
    </Content>
    </>
    
  );
}
