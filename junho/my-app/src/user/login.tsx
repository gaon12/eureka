import { useCallback, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { SetterOrUpdater } from "recoil";
import { Button, Col, Input, Row, Space, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Swal from "sweetalert2";
import { ip_address } from "./ipaddress";
import { fetchJson } from "../lib/http";
import type { AuthResponse } from "../types/api";
import type { UserRole } from "../types/domain";
import "../user/userstyles.css";

const { Title } = Typography;

interface LoginProps {
  setUserRole: SetterOrUpdater<UserRole>;
}

const getLoginErrorMessage = (data: AuthResponse): string => {
  switch (data.error?.errorCode) {
    case "E400":
      return "필수 항목 미입력";
    case "E401":
      return "아이디 or 비밀번호 오류";
    case "E402":
      return "비밀번호 불일치";
    case "E403":
      return "등록되지 않은 사용자";
    case "E406":
      return "이미 로그인 되어 있음";
    default:
      return typeof data.message === "string"
        ? data.message
        : "서버로부터 메시지를 받지 못했습니다.";
  }
};

export default function Login({ setUserRole }: LoginProps) {
  const [dong, setDong] = useState("");
  const [ho, setHo] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const loginDisabled = !dong || !ho || !password;

  const handleDongChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDong(event.target.value);
  };

  const handleHoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHo(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    if (loginDisabled) {
      Swal.fire("Oops...", "모든 칸을 입력해 주세요!", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await fetchJson<AuthResponse>(`${ip_address}/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          dong,
          ho,
          pw: password,
        }),
      });

      if (data.status === 200) {
        const role: Exclude<UserRole, ""> =
          data.role === "admin" ? "admin" : "user";
        setUserRole(role);
        navigate(role === "admin" ? "/admin" : "/main");
        return;
      }

      Swal.fire(
        "Message",
        getLoginErrorMessage(data),
        data.status === 400 ? "error" : "warning",
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "서버와의 통신 중 오류가 발생했습니다.", "warning");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    dong,
    ho,
    ip_address,
    isSubmitting,
    loginDisabled,
    navigate,
    password,
    setUserRole,
  ]);

  const inputStyle: CSSProperties = {
    width: "375px",
    height: "50px",
    marginTop: "16px",
  };

  return (
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
        className="responsive-input"
        style={inputStyle}
        placeholder="동을 입력하세요."
        value={dong}
        onChange={handleDongChange}
        onPressEnter={handleSubmit}
      />

      <Input
        className="responsive-input"
        style={inputStyle}
        placeholder="호를 입력하세요."
        value={ho}
        onChange={handleHoChange}
        onPressEnter={handleSubmit}
      />

      <Input.Password
        className="responsive-input"
        style={inputStyle}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChange={handlePasswordChange}
        onPressEnter={handleSubmit}
      />

      <Row gutter={[10, 16]} justify="center" style={{ marginTop: "20px" }}>
        <Col>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || loginDisabled}
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
                  "warning",
                )
              }
            >
              비밀번호 찾기
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
