import React, { useState, useEffect } from "react";
import { ip_address } from "./ipaddress";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Button, Drawer, Modal } from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import Carregister from "./carregister.js";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  function fetchDataWithAxios() {
    axios
      .get(`${ip_address}/user/signout`)
      .then((response) => {
        const status = response.data.status;

        switch (status) {
          case 200:
            console.log("성공");
            window.location.href = "/"; // 200 메시지가 뜨면 '/'로 이동
            break;
          case 400:
            console.log("정보 없음");
            Swal.fire("오류", response.data.message, "error"); // 서버에서 반환하는 메시지를 사용
            break;
          case 500:
            console.log("서버 오류");
            Swal.fire("오류", response.data.message, "error"); // 서버에서 반환하는 메시지를 사용
            break;
          default:
            console.log("알 수 없는 상태 코드:", status);
            Swal.fire("오류", "알 수 없는 오류가 발생했습니다.", "error");
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error.message);
        Swal.fire("오류", "데이터를 가져오는 중 오류가 발생했습니다.", "error");
      });
  }

  function handleClick(event) {
    event.preventDefault();
    fetchDataWithAxios();
  }

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

  const profileMenu = (
    <Menu>
      <Menu.Item key="0">
        <a href="#" style={{ textDecoration: "none" }}>
          Profile
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="#" style={{ textDecoration: "none" }}>
          Settings
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        <a onClick={handleClick} style={{ textDecoration: "none" }}>
          Logout
        </a>
      </Menu.Item>
    </Menu>
  );

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
        <Menu.Item key="">
          <Link to="/vote" style={{ textDecoration: "none" }}>
            투표
          </Link>
        </Menu.Item>
        <Menu.Item key="complaint">
          <Link to="/noticeboardwrite" style={{ textDecoration: "none" }}>
            민원
          </Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="convenience" title="편의기능">
        <Menu.Item key="news">최신뉴스</Menu.Item>
        <Menu.Item key="disasterMsg">재난 문자</Menu.Item>
        <Menu.Item key="publicTransport">
        <Link to="/trash" style={{ textDecoration: "none" }}>
          주변 쓰레기통 정보
          </Link>
          </Menu.Item>
        <Menu.Item key="hospitalPharmacy">주변 병의원/약국정보</Menu.Item>
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
            overlay={profileMenu}
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
          visible={visible}
          bodyStyle={{ padding: 0 }}
          width="80%"
        >
          <HorizontalMenu mode={"inline"} />
        </Drawer>
        <Modal
          visible={isModalOpen}
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
