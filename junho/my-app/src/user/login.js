import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ip_address } from "./ipaddress";
import { Input, Typography, Button, Row, Col, Space } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Swal from "sweetalert2";
import "../user/userstyles.css";

const { Title } = Typography;

export default function Login(props) {
  const { setUserRole } = props;
  const [dong, setDong] = useState("");
  const [ho, setHo] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const loginDisabled = !dong || !ho || !password;

  const handleDongChange = (e) => {
    const { value } = e.target;
    setDong(value);
  };

  const handleHoChange = async (e) => {
    const { value } = e.target;
    setHo(value);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    if (!dong || !ho || !password) {
      Swal.fire("Oops...", "모든 칸을 입력해 주세요!", "warning");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${ip_address}/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          dong: dong,
          ho: ho,
          pw: password,
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        const role = data.role === "admin" ? "admin" : "user";
        setUserRole(role);
        navigate(role === "admin" ? "/admin" : "/main");
      } else {
        switch (data.status) {
          case 400:
            switch (data.error.errorCode) {
              case "E400":
                Swal.fire("Message", "필수 항목 미입력", "error");
                break;
              case "E401":
                Swal.fire("Message", "아이디 or 비밀번호 오류", "error");
                break;
              case "E402":
                Swal.fire("Message", "비밀번호 불일치", "error");
                break;
              case "E403":
                Swal.fire("Message", "등록되지 않은 사용자", "error");
                break;
              case "E406":
                Swal.fire("Message", "이미 로그인 되어 있음", "error");
                break;
              default:
                Swal.fire(
                  "Message",
                  data.message || "서버로부터 메시지를 받지 못했습니다.",
                  "error"
                );
            }
            break;
          default:
            Swal.fire(
              "Oops...",
              data.message || "서버로부터 메시지를 받지 못했습니다.",
              "warning"
            );
        }
      }
    } catch (error) {
      Swal.fire("Error", "서버와의 통신 중 오류가 발생했습니다.", "warning");
      console.error(error);
    } finally {
      setIsSubmitting(false); // 요청이 완료된 후에 isSubmitting 상태를 false로 변경
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);

  const inputStyle = {
    width: "375px", // 기본 PC 크기
    height: "50px",
    marginTop: "16px",
  };

  return (
    <>
      <div
        className="App"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Title level={2} style={{ marginTop: "105px" }}>
          로그인
        </Title>

        <Input
          className="responsive-input" // 클래스 이름 추가
          style={inputStyle}
          placeholder="동을 입력하세요."
          value={dong}
          onChange={handleDongChange}
        />

        <Input
          className="responsive-input" // 클래스 이름 추가
          style={inputStyle}
          placeholder="호를 입력하세요."
          value={ho}
          onChange={handleHoChange}
        />

        <Input.Password
          className="responsive-input" // 클래스 이름 추가
          style={inputStyle}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={handlePasswordChange}
        />

        <Row gutter={[10, 16]} justify="center" style={{ marginTop: "20px" }}>
          <Col>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || loginDisabled} // 로그인 비활성화 상태 추가
            >
              로그인
            </Button>
          </Col>
        </Row>

        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <Col>
            <Space>
              <Button type="primary" ghost>
                <Link to="/sign" style={{ textDecoration: "none" }}>
                  회원가입
                </Link>
              </Button>
              <Button
                type="primary"
                ghost
                onClick={() =>
                  Swal.fire(
                    "비밀번호 찾기",
                    "관리사무소에 직접 방문을 하세요!!!",
                    "warning"
                  )
                }
              >
                비밀번호 찾기
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
    </>
  );
}
