import { Layout } from "antd";
import DashBoard from "./DashBoard";
import Header from "./Header";


export default function Admin() {
  
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header/>
      <DashBoard />
    </Layout>
  );
}
