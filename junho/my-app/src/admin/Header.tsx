import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
  SearchOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { Button, Layout, List, Modal } from "antd";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { nCarDataState, userRoleState } from "./dataState";
import { Url } from "../admin/url";
import type { ApiEnvelope } from "../types/api";
import type { PendingCarInfo } from "../types/domain";

const { Header: AntHeader } = Layout;

const pressedStyle: CSSProperties = {
  transform: "scale(1.1)",
  transition: "transform 0.3s ease-in-out",
};

const iconButtonStyle: CSSProperties = {
  color: "#fff",
  padding: "4px 15px",
};

const navTargets = ["/admin", "/Notice", "/work", "", "/searchCar"] as const;

function Header() {
  const [btnPressed, setBtnPressed] = useState<boolean[]>(() => Array(6).fill(false));
  const [modalOpen, setModalOpen] = useState(false);
  const [carData, setCarData] = useRecoilState(nCarDataState);
  const [blinking, setBlinking] = useState(false);
  const [, setUserRole] = useRecoilState(userRoleState);
  const navigate = useNavigate();

  const recentCars = useMemo(
    () => carData.slice(Math.max(carData.length - 5, 0)),
    [carData],
  );

  const logout = () => {
    setUserRole("");
    navigate("/login");
  };

  const handleClick = async () => {
    try {
      const response = await fetch(`${Url}/user/signout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        Swal.fire("오류", "로그아웃 중 오류가 발생했습니다.", "error");
        return;
      }

      const data = (await response.json()) as ApiEnvelope<never>;

      if (data.status === 200) {
        logout();
        return;
      }

      Swal.fire("오류", data.error?.message ?? "알 수 없는 오류가 발생했습니다.", "error");
    } catch (error) {
      console.error(error);
      Swal.fire("오류", "데이터를 가져오는 중 오류가 발생했습니다.", "error");
    }
  };

  const removePendingCar = (target: PendingCarInfo) => {
    setCarData((current) => current.filter((item) => item.car_number !== target.car_number));
  };

  const handelApprove = async (target: PendingCarInfo) => {
    try {
      const response = await fetch(`${Url}/car/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ car_number: target.car_number }),
      });

      if (response.ok) {
        removePendingCar(target);
      }
    } catch (error) {
      console.error("Error approving car:", error);
    }
  };

  const handleDeny = async (target: PendingCarInfo) => {
    try {
      const response = await fetch(`${Url}/car/deny`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ car_number: target.car_number }),
      });

      if (response.ok) {
        removePendingCar(target);
      }
    } catch (error) {
      console.error("Error denying car:", error);
    }
  };

  const handlePress = (index: number) => {
    setBtnPressed((current) => current.map((pressed, idx) => (idx === index ? true : pressed)));

    if (index === 3) {
      setModalOpen(true);
    } else {
      const target = navTargets[index];
      if (target) {
        navigate(target);
      }
    }

    window.setTimeout(() => {
      setBtnPressed((current) => current.map((pressed, idx) => (idx === index ? false : pressed)));
    }, 300);
  };

  useEffect(() => {
    if (carData.length === 0) {
      setBlinking(false);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setBlinking((prevBlinking) => !prevBlinking);
    }, 500);

    return () => window.clearInterval(interval);
  }, [carData.length]);

  return (
    <AntHeader style={{ display: "flex", position: "sticky", zIndex: 1, top: 0 }}>
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
            style={{ color: "#fff", padding: "4px 0px", ...(btnPressed[0] ? pressedStyle : {}) }}
            onClick={() => handlePress(0)}
          />
        </li>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<EditOutlined style={{ fontSize: "18px" }} />}
            style={{ ...iconButtonStyle, ...(btnPressed[1] ? pressedStyle : {}) }}
            onClick={() => handlePress(1)}
          />
        </li>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<SnippetsOutlined style={{ fontSize: "18px" }} />}
            style={{ color: "#fff", padding: "4px 0px", ...(btnPressed[2] ? pressedStyle : {}) }}
            onClick={() => handlePress(2)}
          />
        </li>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: "18px" }} />}
            style={{ ...iconButtonStyle, ...(btnPressed[3] ? pressedStyle : {}) }}
            onClick={() => handlePress(3)}
          >
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
              />
            )}
          </Button>
        </li>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<SearchOutlined style={{ fontSize: "18px" }} />}
            style={{ color: "#fff", padding: "4px 0px", ...(btnPressed[4] ? pressedStyle : {}) }}
            onClick={() => handlePress(4)}
          />
        </li>
        <li style={{ color: "#fff" }}>
          <Button
            type="text"
            icon={<LogoutOutlined style={{ fontSize: "18px" }} />}
            style={iconButtonStyle}
            onClick={handleClick}
          />
        </li>
      </ul>
      <Modal
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <List<PendingCarInfo>
          bordered
          dataSource={recentCars}
          renderItem={(item) => (
            <List.Item style={{ display: "flex" }}>
              <List.Item.Meta
                title="차량등록요청"
                description={`차량번호: ${item.car_number}, 외부차량: ${
                  item.guest_car ? "T" : "F"
                }, 전기차: ${item.electric_car ? "T" : "F"}, 장애차량: ${
                  item.disabled_car ? "T" : "F"
                }`}
              />
              <Button
                icon={<CheckOutlined style={{ color: "#52C41A" }} />}
                onClick={() => handelApprove(item)}
              />
              <Button
                icon={<CloseOutlined style={{ color: "#F5222D" }} />}
                onClick={() => handleDeny(item)}
              />
            </List.Item>
          )}
        />
      </Modal>
    </AntHeader>
  );
}

export default Header;
