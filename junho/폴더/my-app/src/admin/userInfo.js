import { Layout, Card,Typography} from "antd";
import Header from "./Header";
import AllTable from "./aTable";
import { useRecoilState } from "recoil";
import {userDataState, userColumnsState } from './dataState';

export default function UserInfo() {
  const [userData, setUserData] = useRecoilState(userDataState);
  const [userColumns, setUserColumns] = useRecoilState(userColumnsState);
  const {Content} = Layout;
  const { Title } = Typography;
  return (
    <>
      <Header />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <Card style={{boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}>
        <Title level={5}>회원 목록</Title>
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
          <AllTable columns={userColumns} data={userData}/>
        </Card>
      </Content>
    </>
  );
}
