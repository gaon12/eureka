import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  BellOutlined,
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  SnippetsOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Button, Modal, List } from "antd";
import { useRecoilState } from "recoil";
import { nCarDataState } from "./dataState";
import Swal from "sweetalert2";
import { Url } from "../admin/url";
import { userRoleState } from "../admin/dataState";

function Header() {
  const { Header } = Layout;
  const [btnPressed, setBtnPressed] = useState([false, false, false]);
  const [modalOpen, setModalOpen] = useState(false);
  const [carData, setCarData] = useRecoilState(nCarDataState);
  const [blinking, setBlinking] = useState(false); // 점멸 여부 상태
  const [userRole, setUserRole] = useRecoilState(userRoleState);
  const navigate = useNavigate();

  const go = useNavigate();
  const goNavi = (path) => {
    go(path);
  };

  const logout = () => {
    setUserRole(""); // 상태를 비웁니다
    navigate("/login"); // 로그인 페이지로 리디렉션합니다
  };

  const handleClick = async () => {
    try {
      const response = await fetch(`${Url}/user/signout`, {
        method: "GET", // GET 방식으로 변경
        credentials: "include", // 쿠키를 포함시키기 위한 설정
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

  const handelApprove = async (index) => {
    try {
      const approveCar = carData[index];
      const response = await fetch(`${Url}/car/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ car_number: approveCar.car_number }),
      });

      if (response.ok) {
        // 데이터 삭제 후 업데이트
        const updatedData = carData.filter((item, idx) => idx !== index);
        setCarData(updatedData);
      }
    } catch (error) {
      console.error("Error approving car:", error);
    }
  };
  const handleDeny = async (index) => {
    try {
      const denyCar = carData[index];
      const response = await fetch(`${Url}/car/deny`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ car_number: denyCar.car_number }),
      });
      if (response.ok) {
        const updatedData = carData.filter((item, idx) => idx !== index);
        setCarData(updatedData);
      }
    } catch (error) {
      console.error("Error approving car:", error);
    }
  };
  const handlePress = (index) => {
    const newPressedButtons = [...btnPressed];
    newPressedButtons[index] = true;
    setBtnPressed(newPressedButtons);
    if (index === 0) {
      goNavi("/admin");
    } else if (index === 1) {
      goNavi("/Notice");
    } else if (index === 2) {
      goNavi("/work");
    } else if (index === 3) {
      setModalOpen(true);
    } else if (index === 4) {
      goNavi("/searchCar");
    } 
    setTimeout(() => {
      const resetPressedButtons = [...newPressedButtons];
      resetPressedButtons[index] = false;
      setBtnPressed(resetPressedButtons);
    }, 300);
  };

  const handleOk = () => {
    setModalOpen(false);
  };

  const toggleBlinking = () => {
    setBlinking((prevBlinking) => !prevBlinking);
  };

  const pressedStyle = {
    transform: "scale(1.1)",
    transition: "transform 0.3s ease-in-out",
  };
  // 1초마다 점멸 상태를 변경

  useEffect(() => {
    if (carData.length > 0) {
      const interval = setInterval(toggleBlinking, 500);
      return () => clearInterval(interval);
    }
  }, [carData]);

  return (
    <Header style={{ display: "flex", position: "sticky", zIndex: 1, top: 0 }}>
      <div
        style={{
          width: "220px",
          height: "50px",
          color: "#fff",
          fontSize: "20px",
        }}
      >
        ADMINISTRATOR
      </div>
      <ul style={{ display: "flex", marginLeft: "auto" }}>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<HomeOutlined style={{ fontSize: "18px" }} />}
            style={{
              color: "#fff",
              padding: "4px 0px",
              ...(btnPressed[0] ? pressedStyle : {}),
            }}
            onClick={() => handlePress(0)}
          ></Button>
        </li>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<EditOutlined style={{ fontSize: "18px" }} />}
            style={{
              color: "#fff",
              padding: "4px 15px",
              ...(btnPressed[1] ? pressedStyle : {}),
            }}
            onClick={() => handlePress(1)}
          >
            <div
              style={{
                position: "absolute",
                top: "3px",
                left: "30px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "none",
              }}
            ></div>
          </Button>
        </li>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<SnippetsOutlined style={{ fontSize: "18px" }} />}
            style={{
              color: "#fff",
              padding: "4px 0px",
              ...(btnPressed[2] ? pressedStyle : {}),
            }}
            onClick={() => handlePress(2)}
          ></Button>
        </li>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: "18px" }} />}
            style={{
              color: "#fff",
              padding: "4px 15px",
              ...(btnPressed[3] ? pressedStyle : {}),
            }}
            onClick={() => handlePress(3)}
          >
            {" "}
            {carData.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  left: "27px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: blinking ? "red" : "transparent",
                }}
              ></div>
            )}
          </Button>
        </li>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<SearchOutlined style={{ fontSize: "18px" }} />}
            style={{
              color: "#fff",
              padding: "4px 0px",
              ...(btnPressed[4] ? pressedStyle : {}),
            }}
            onClick={() => handlePress(4)}
          ></Button>
        </li>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<LogoutOutlined style={{ fontSize: "18px" }} />}
            style={{
              color: "#fff",
              padding: "4px 15px",
              ...(btnPressed[5] ? pressedStyle : {}),
            }}
            onClick={handleClick}
          >
            {carData.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: "2px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                }}
              ></div>
            )}
          </Button>
        </li>
      </ul>
      <Modal
        open={modalOpen}
        onOk={handleOk}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <List
          bordered
          dataSource={carData.slice(Math.max(carData.length - 5, 0))}
          renderItem={(item, i) => (
            <List.Item style={{ display: "flex" }}>
              <List.Item.Meta
                title={"차량등록요청"}
                description={` 차량번호: ${item.car_number},외부차량: ${
                  item.disabled_car ? "T" : "F"
                }, 전기차: ${item.electric_car ? "T" : "F"}, 장애차량: ${
                  item.disabled_car ? "T" : "F"
                }`}
              />
              <Button
                index={i}
                icon={<CheckOutlined style={{ color: "#52C41A" }} />}
                onClick={() => handelApprove(i)}
              ></Button>
              <Button
                index={i}
                icon={<CloseOutlined style={{ color: "#F5222D" }} />}
                onClick={() => handleDeny(i)}
              ></Button>
            </List.Item>
          )}
        />
      </Modal>
    </Header>
  );
}

export default Header;
