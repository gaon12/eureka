import React, { useState, useEffect } from "react";
import { ip_address } from "../user/ipaddress";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Button, Drawer, Modal } from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import Carregister from "../user/carregister.js";
import { useRecoilState } from "recoil";
import { userRoleState } from "../admin/dataState";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useRecoilState(userRoleState)
  const showModal = () => {
    setIsModalOpen(true);
  };
  const navigate = useNavigate();
  const logout = () => {
    setUserRole(""); // 상태를 비웁니다
    navigate("/login"); // 로그인 페이지로 리디렉션합니다
  };

  const handleClick = async () => {
    try {
      const response = await fetch(`${ip_address}/user/signout`, {
        method: 'GET', // GET 방식으로 변경
        credentials: 'include' // 쿠키를 포함시키기 위한 설정
      });

      if (response.ok) {
        const data = await response.json();
        const status = data.status;

        switch (status) {
          case 200:
            logout();
            break;

          case 400:
            Swal.fire("오류", data.error.message, "error"); // 서버 에러 메시지
            break;

          case 500:
        
            Swal.fire("오류", data.error.message, "error"); // 서버 에러 메시지
            break;

          default:
           
            Swal.fire("오류", "알 수 없는 오류가 발생했습니다.", "error");
            break;
        }
      }
    } catch (error) {
      Swal.fire("오류", "데이터를 가져오는 중 오류가 발생했습니다.", "error");
    }
  };
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const items = [
  {
    key:'2',
    label:'Logout',
    onClick:handleClick
  },
  ]
const itemsProps ={
  items,
};
  const HorizontalMenu = ({ mode }) => (
    <Menu mode={mode}>
      <Menu.Item key="home">
        <Link to="/" style={{ textDecoration: "none" }}>
          Home
        </Link>
      </Menu.Item>
      <Menu.Item key="carManagement" onClick={showModal}>
        차량등록
      </Menu.Item>
      <Menu.SubMenu key="community" title="커뮤니티">
        <Menu.Item key="announcement">
          <Link to="/noticeboard" style={{ textDecoration: "none" }}>
            공지사항
          </Link>
        </Menu.Item>
        <Menu.Item key="complaint">
          <Link to="/complaintwrite" style={{ textDecoration: "none" }}>
            민원
          </Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="convenience" title="편의기능">
        <Menu.Item key="news"><Link to="/news" style={{ textDecoration: "none" }}>
        최신뉴스
        </Link>
        </Menu.Item>
        <Menu.Item key="disasterMsg">
        <Link to="/calamity" style={{ textDecoration: "none" }}>
        재난문자
        </Link>
        </Menu.Item>
        <Menu.Item key="publicTransport">
          <Link to="/trash" style={{ textDecoration: "none" }}>
            주변 쓰레기통 정보
          </Link>
        </Menu.Item>
        <Menu.Item key="TreatArea">
          <Link to="/hospitals" style={{ textDecoration: "none" }}>
            병의원
          </Link>
        </Menu.Item>
        <Menu.Item key="medical">
          <Link to="/medicine" style={{ textDecoration: "none" }}>
            약국
          </Link>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "3px solid #f0f0f0",
        }}
      >
        <Link
          to="/"
          style={{
            padding: "0 16px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1890ff",
            textDecoration: "none",
          }}
        >
          Eureka
        </Link>
        {!isMobile && <HorizontalMenu mode={"horizontal"} />}
        <div>
          {isMobile && (
            <Button
              icon={<MenuOutlined />}
              onClick={() => setVisible(true)}
              style={{ border: "none" }}
            />
          )}
          <Dropdown
            menu={itemsProps}
            trigger={isMobile ? ["click"] : ["hover"]}
          >
            <Button type="text" icon={<UserOutlined />} />
          </Dropdown>
        </div>
        <Drawer
          title="Menu"
          placement="right"
          closable={false}
          onClose={() => setVisible(false)}
          open={visible}
          bodyStyle={{ padding: 0 }}
          width="80%"
        >
          <HorizontalMenu mode={"inline"} />
        </Drawer>
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Carregister />
        </Modal>
      </div>
    </>
  );
};

export default Navbar;