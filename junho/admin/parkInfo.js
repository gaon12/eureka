import { Layout } from "antd";
import Header from "./Header";
export default function ParkInfo() {
  const { Content } = Layout;
  return (
    <>
      <Header />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <div>주차등록!</div>
      </Content>
    </>
  );
}