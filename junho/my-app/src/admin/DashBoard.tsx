import { useEffect } from "react";
import { Button, Card, Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import CTable from "../admin/cTable";
import { Url } from "../admin/url";
import {
  articleColumnsState,
  articleDataState,
  carColumnsState,
  carDataState,
  nCarDataState,
  userColumnsState,
  userDataState,
  workDataState,
} from "../admin/dataState";
import { fetchJson, hasResults } from "../lib/http";
import type { ApiEnvelope, CarDashboardResults } from "../types/api";
import type { ComplaintArticle, UserInfo, WorkLog } from "../types/domain";

const { Title } = Typography;
const { Content } = Layout;

export default function DashBoard() {
  const [userData, setUserData] = useRecoilState(userDataState);
  const [carData, setCarData] = useRecoilState(carDataState);
  const [articleData, setArticleData] = useRecoilState(articleDataState);
  const [, setNcarData] = useRecoilState(nCarDataState);
  const [userColumns] = useRecoilState(userColumnsState);
  const [articleColumns] = useRecoilState(articleColumnsState);
  const [carColumns] = useRecoilState(carColumnsState);
  const [, setWorkData] = useRecoilState(workDataState);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      try {
        const [users, cars, complaints, works] = await Promise.all([
          fetchJson<ApiEnvelope<UserInfo[]>>(`${Url}/user/info`, {
            credentials: "include",
          }),
          fetchJson<ApiEnvelope<CarDashboardResults>>(`${Url}/car/registered`, {
            credentials: "include",
          }),
          fetchJson<ApiEnvelope<ComplaintArticle[]>>(`${Url}/complaint`, {
            credentials: "include",
          }),
          fetchJson<ApiEnvelope<WorkLog[]>>(`${Url}/work`, {
            credentials: "include",
          }),
        ]);

        if (cancelled) {
          return;
        }

        if (hasResults(users)) {
          setUserData(users.results);
        }

        if (hasResults(cars)) {
          setCarData(cars.results.rcars);
          setNcarData(cars.results.nrcars);
        }

        if (hasResults(complaints)) {
          setArticleData(complaints.results);
        }

        if (hasResults(works)) {
          setWorkData(works.results);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [setArticleData, setCarData, setNcarData, setUserData, setWorkData]);

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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "15px",
          }}
        >
          <Button
            type="primary"
            style={{ width: "161.84px" }}
            onClick={() => navigate("/userTable")}
          >
            회원 전체보기
          </Button>
        </div>
      </Card>
      <Card
        style={{ marginTop: "24px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
      >
        <Title level={5}>최근 민원</Title>
        <CTable columns={articleColumns} data={articleData} />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "15px",
          }}
        >
          <Button
            type="primary"
            style={{ width: "161.84px" }}
            onClick={() => navigate("/article")}
          >
            최근게시물 더보기
          </Button>
        </div>
      </Card>
      <Card
        style={{ marginTop: "24px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
      >
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "15px",
          }}
        >
          <Button type="primary" onClick={() => navigate("/parkInfo")}>
            주차등록 전체보기
          </Button>
        </div>
      </Card>
    </Content>
  );
}
