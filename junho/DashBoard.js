import React,{useEffect, useState} from "react";
import { Layout, Typography, Card, Button } from "antd";
import { Link, useNavigate} from "react-router-dom";
import CTable from "./cTable";
import { Url } from "./url";
import { useRecoilState } from "recoil";
import { userDataState, carDataState, articleDataState,nCarDataState} from "./dataState";
export default function DashBoard() {
  
  const [userData, setUserData] = useRecoilState(userDataState);
  const [carData, setCarData] = useRecoilState(carDataState);
  const [articleData, setArticlData] = useRecoilState(articleDataState);
  const [nCarData, setNcarData] = useRecoilState(nCarDataState);
  const { Title } = Typography;
  const { Content } = Layout;
  
  const navi = useNavigate();
  const pathNavi = (path)=>{
    navi(path)
  };
  
  const userColumns = [
    {
      title: "회원아이디",
      render: (text, carData) => `${carData.dong}동 ${carData.ho}호`,
    },
    {
      title: "이름",
      dataIndex: "username",
    },
    {
      title: "휴대폰번호",
      dataIndex: "phone1",
      render:(text) =>{
        const trnasformPhon1 = text.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        return trnasformPhon1
      }
    },
    {
      title: "전입일",
      dataIndex: "movein",
      render: (text) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return formattedDate;
    },
  }
  ];
  
  const articleColumns = [
    {
      title: "✨",
      dataIndex: "noti_category",
    },
    {
      title: "제목",
      dataIndex: "title",
    },
    {
      title: "내용",
      dataIndex: "summary",
    },
    {
      title: "작성일",
      dataIndex: "noti_w_date",
    },
  ];
  const carColumns = [
    {
      title: "차량번호",
      dataIndex: "car_number",
    },
    {
      title: "외부차량",
      dataIndex: "guest_car",
    },
    {
      title: "전기차",
      dataIndex: "electric_car",
    },
    {
      title: "장애차량",
      dataIndex: "disabled_car",
    },
  ];
  
  useEffect(()=>{ 
    async function fetchData(){
      try{
        const userResponse = await fetch(`${Url}/user/info`)
        const rUserData= await userResponse.json();
        console.log('rUserData:', rUserData);
        setUserData(rUserData.results);
        console.log(userData);
        const carResponse = await fetch(`${Url}/car/registered`)
        const rCarData = await carResponse.json();
        console.log('rCarData:', rCarData);
        setCarData(rCarData.results.rcars);
        setNcarData(rCarData.results.nrcars);
        
      }
      catch(error){
        console.error("Error fetching data:", error);
      }
    }
    fetchData()
  },[])
 
  
  return (
    <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
      <Card style={{boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}>
        <Title level={5}>신규회원가입 5건 목록</Title>
        <div
          style={{
            backgroundColor: "#eaeaea",
            padding: "10px 20px",
            lineHeight: "1.5em",
            marginBottom: "5px",
          }}
        >
          {`총 회원수 ${userData.length}명`}
        </div>
        <CTable columns={userColumns} data={userData} />
        <div style={{display:'flex', justifyContent:'flex-end',marginTop:'15px'}}><Button type="primary" style={{width:'161.84px'}} onClick={() => pathNavi('/userTable')}>회원 전체보기</Button></div>
      </Card>
      <Card style={{marginTop:'24px',boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}>
        <Title level={5}>최근게시물</Title>
        <CTable columns={articleColumns} data={articleData} />
        <div style={{display:'flex', justifyContent:'flex-end',marginTop:'15px'}}><Button type="primary" style={{width:'161.84px'}} onClick={()=>pathNavi('/article')}>최근게시물 더보기</Button></div>
      </Card>
      <Card style={{marginTop:'24px',boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}>
        <Title level={5}>최근 주차등록 내역</Title>
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
        <CTable columns={carColumns} data={carData} />
        <div style={{display:'flex', justifyContent:'flex-end',marginTop:'15px'}}><Button type="primary" onClick={()=>pathNavi('/parkInfo')}>주차등록 전체보기</Button></div>
      </Card>
    </Content>
  );
}
