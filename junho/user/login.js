import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ip_address } from "./ipaddress";
import { Input, Typography, Button, Row, Col, Space, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Swal from "sweetalert2";
import "./styles.css";

const { Title } = Typography;

export default function Login(props) {
  const { userRole, setUserRole } = props;
  const [dong, setDong] = useState("");
  const [ho, setHo] = useState("");
  const [password, setPassword] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const goMain = () => {
    navigate(userRole === "admin" ? "/admin" : userRole ==='user' ? "/main": {});
  };

  const handleDongChange = (e) => {
    const { value } = e.target;
    if (/^[0-9]*$/.test(value)) {
      setDong(value);
    } else {
      Swal.fire(
        "Oops...",
        "'동' 입력이 잘못되었습니다. 입력값은 숫자여야 합니다.",
        "error"
      );
    }
    if (/(--|;|'|"|=|OR|AND)/i.test(value)) {
      Swal.fire(
        "Security Alert...",
        "SQL 인젝션 공격을 시도하는 입력이 감지되었습니다.",
        "error"
      );
    }
  };

  const handleHoChange = (e) => {
    const { value } = e.target;
    if (/^[0-9]*$/.test(value)) {
      setHo(value);
    } else {
      Swal.fire(
        "Oops...",
        "'호'수 입력이 잘못되었습니다. 입력값은 숫자여야 합니다.",
        "error"
      );
    }
    if (/(--|;|'|"|=|OR|AND)/i.test(value)) {
      Swal.fire(
        "Security Alert...",
        "SQL 인젝션 공격을 시도하는 입력이 감지되었습니다.",
        "error"
      );
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
        body: JSON.stringify({
          dong: dong,
          ho: ho,
          pw: password,
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        setUserRole('admin');
        goMain();
      } else {
        switch(data.status) {
          case 400:
            switch(data.error.errorCode) {
              case 'E400':
                Swal.fire("Message", "필수 항목 미입력", "error");
                break;
              case 'E401':
                Swal.fire("Message", "아이디 or 비밀번호 오류", "error");
                break;
              case 'E402':
                Swal.fire("Message", "비밀번호 불일치", "error");
                break;
              case 'E403':
                Swal.fire("Message", "등록되지 않은 사용자", "error");
                break;
              default:
                Swal.fire("Message", data.message || "서버로부터 메시지를 받지 못했습니다.", "warning");
            }
            break;
          default:
            Swal.fire("Oops...", data.message || "서버로부터 메시지를 받지 못했습니다.", "error");
        }
      }

    } catch (error) {
      Swal.fire("Error", "서버와의 통신 중 오류가 발생했습니다.", "warning");
      console.error(error);
    }

    setIsSubmitting(false);
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

  useEffect(() => {
    if (ho === "0000") {
      setAdminMode(true);
    } else {
      setAdminMode(false);
    }
  }, [ho]);

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

        {adminMode && (
          <Checkbox style={{ marginTop: "16px" }} checked={adminMode} disabled>
            관리자체크
          </Checkbox>
        )}

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
            <Button type="primary" onClick={handleSubmit}>
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
              <Button type="primary" ghost>
                비밀번호 찾기
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
    </>
  );
}
