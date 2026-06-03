import { Layout } from "antd";
import DashBoard from "./DashBoard";
import Header from "./Header";


export default function Admin() {
  const { Footer } = Layout;
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header/>
      <DashBoard />
      <Footer />
    </Layout>
  );
}
