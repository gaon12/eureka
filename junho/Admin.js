import { Layout } from "antd";
import DashBoard from "./DashBoard";

export default function Admin() {
  const { Footer } = Layout;
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DashBoard />
      <Footer />
    </Layout>
  );
}
