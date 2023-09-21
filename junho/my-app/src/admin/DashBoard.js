import React, { useEffect } from "react";
import { Layout, Typography, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import CTable from "../admin/cTable";
import { Url } from "../admin/url";
import { useRecoilState } from "recoil";
import { userDataState, carDataState, articleDataState, nCarDataState, userColumnsState, carColumnsState, articleColumnsState, workDataState } from "../admin/dataState";
export default function DashBoard() {

  const [userData, setUserData] = useRecoilState(userDataState);
  const [carData, setCarData] = useRecoilState(carDataState);
  const [articleData, setArticlData] = useRecoilState(articleDataState);
  const [nCarData, setNcarData] = useRecoilState(nCarDataState);
  const [userColumns, setUserColumns] = useRecoilState(userColumnsState);
  const [articleColumns, setArticleColumns] = useRecoilState(articleColumnsState);
  const [carColumns, setCarColums] = useRecoilState(carColumnsState);
  const [workData, setWorkData] = useRecoilState(workDataState);
  const { Title } = Typography;
  const { Content } = Layout;

  const navi = useNavigate();
  const pathNavi = (path) => {
    navi(path)
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch(`${Url}/user/info`)
        const rUserData = await userResponse.json();
        setUserData(rUserData.results);
        const carResponse = await fetch(`${Url}/car/registered`)
        const rCarData = await carResponse.json();
        setCarData(rCarData.results.rcars);
        setNcarData(rCarData.results.nrcars);
        const articleResponse = await fetch(`${Url}/complaint`)
        const rarticleData = await articleResponse.json();
        setArticlData(rarticleData.results);
        const workResponse = await fetch(`${Url}/work`)
        const rWorkData = await workResponse.json();
        setWorkData(rWorkData.results)

      }
      catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData()
  }, [])


  return (
    <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
      <Card style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Title level={5}>신규회원 5건 목록</Title>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}><Button type="primary" style={{ width: '161.84px' }} onClick={() => pathNavi('/userTable')}>회원 전체보기</Button></div>
      </Card>
      <Card style={{ marginTop: '24px', boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Title level={5}>최근 민원</Title>
        <CTable columns={articleColumns} data={articleData} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}><Button type="primary" style={{ width: '161.84px' }} onClick={() => pathNavi('/article')}>최근게시물 더보기</Button></div>
      </Card>
      <Card style={{ marginTop: '24px', boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}><Button type="primary" onClick={() => pathNavi('/parkInfo')}>주차등록 전체보기</Button></div>
      </Card>
    </Content>
  );
}
