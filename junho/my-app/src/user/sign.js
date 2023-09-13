import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Row, Col, DatePicker } from "antd";
import { ip_address } from './ipaddress';
import Swal from "sweetalert2";
import "./styles.css";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    dong: "",
    ho: "",
    username: "",
    pw1: "",
    pw2: "",
    phone1: "",
    phone2: "",
    movein: "",
  });
  console.log("Rendering RegisterPage with formData:", formData);
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };

  const handleNumericChange = (e) => {
    const { value, name } = e.target;
    if (/^[0-9]*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    } else {
      Swal.fire({
        icon: "error",
        title: "입력 오류",
        text: `'${name}' 입력이 잘못되었습니다. 입력값은 숫자여야 합니다.`,
        background: "#f3f3f3",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
      form.setFieldsValue({ [name]: "" });
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };
  const handlePhoneChange = (e) => {
    const { value, name } = e.target;
    const reVal = value
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
      .replace(/(\-{1,2})$/g, "");
    setFormData((prev) => ({ ...prev, [name]: reVal }));
    form.setFieldsValue({ [name]: reVal });
  };

  const handleSubmit = async () => {
    try {
      const formattedData = {
        ...formData,
        movein: formData.movein?.replace(/-/g, ""),
        phone1: formData.phone1?.replace(/-/g, ""),
        phone2: formData.phone2?.replace(/-/g, ""),
      };

      const response = await fetch(`${ip_address}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      switch (data.status) {
        case 201:
          Swal.fire("Success", data.message, "success");
          goHome(); // 성공적으로 회원가입이 되었을 때만 홈으로 이동
          break;
        case 400:
          if (data.message === "비밀번호 재확인 필요") {
            Swal.fire("Error", data.message, "error");
          } else if (data.message === "필수 항목 입력 필요") {
            Swal.fire("Error", data.message, "question");
          }
          break;
        case 409:
          Swal.fire("Error", "이미 존재하는 회원", "info");
          break;
        default:
          Swal.fire("Error", "Unknown error", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Unknown error", "error");
    }
  };

  const validatepw1 = (rule, value) => {
    if (
      value &&
      (value.length < 8 || !/[a-z]/.test(value) || !/[0-9]/.test(value))
    ) {
      return Promise.reject(
        new Error(
          "비밀번호는 영어 소문자와 숫자를 포함한 8자리 이상이어야 합니다."
        )
      );
    }
    return Promise.resolve();
  };

  const validatepw2 = (rule, value) => {
    if (value && value !== formData.pw1) {
      return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
    }
    return Promise.resolve();
  };

  return (
    <>
    <Row justify="center" className="register-container">
      <Col xs={24} md={12}>
        <h1 className="register-title">회원가입</h1>
        <Form onFinish={handleSubmit} form={form} className="register-form">
          <Form.Item name="dong">
            <Input
              placeholder="동"
              name="dong"
              value={formData.dong}
              maxLength={4}
              onChange={handleNumericChange}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item name="ho">
            <Input
              placeholder="호"
              autoComplete="off"
              name="ho"
              value={formData.ho}
              maxLength={4}
              onChange={handleNumericChange}
            />
          </Form.Item>

          <Form.Item name="username">
            <Input
              placeholder="이름"
              name="username"
              onChange={handleChange}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item name="phone1">
            <Input
              placeholder="전화번호"
              autoComplete="off"
              name="phone1"
              maxLength={13}
              value={formData.phone1}
              onChange={handlePhoneChange}
            />
          </Form.Item>

          <Form.Item name="phone2">
            <Input
              placeholder="예비 전화번호"
              name="phone2"
              maxLength={13}
              autoComplete="off"
              onChange={handlePhoneChange}
              onBlur={() => {
                if (!formData.phone2) {
                  Swal.fire({
                    icon: "warning",
                    title: "알림",
                    text: "예비 전화번호를 입력하지 않았습니다. 계속 진행하시겠습니까?",
                    showCancelButton: true,
                    confirmButtonText: "계속 진행",
                  });
                }
              }}
            />
          </Form.Item>

          <Form.Item name="movein">
            <DatePicker
              placeholder="전입일"
              name="movein"
              type="date"
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              inputReadOnly
              onChange={(date, dateString) => {
                setFormData((prev) => ({ ...prev, movein: dateString }));
              }}
            />
          </Form.Item>

          <Form.Item
            name="pw1"
            rules={[
              { required: true, message: "비밀번호를 입력해주세요." },
              { validator: validatepw1 },
            ]}
          >
            <Input.Password
              placeholder="비밀번호"
              name="pw1"
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item
            name="pw2"
            rules={[
              { required: true, message: "비밀번호 확인을 입력해주세요." },
              { validator: validatepw2 },
            ]}
          >
            <Input.Password
              placeholder="비밀번호 확인"
              name="pw2"
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-submit-btn"
            >
              가입
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
    </>
  );
}
