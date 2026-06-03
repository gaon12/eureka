import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import type { RuleObject } from "antd/es/form";
import type { Dayjs } from "dayjs";
import { ip_address } from "./ipaddress";
import Swal from "sweetalert2";
import "../user/userstyles.css";

interface RegisterFormData {
  dong: string;
  ho: string;
  username: string;
  pw1: string;
  pw2: string;
  phone1: string;
  phone2: string;
  movein: string;
}

interface SignupResponse {
  status: number;
  message?: string;
}

const initialFormData: RegisterFormData = {
  dong: "",
  ho: "",
  username: "",
  pw1: "",
  pw2: "",
  phone1: "",
  phone2: "",
  movein: "",
};

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Unknown error";

export default function RegisterPage() {
  const [form] = Form.useForm<RegisterFormData>();
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const navigate = useNavigate();

  const updateFormValue = (name: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof Pick<RegisterFormData, "dong" | "ho">;
    const { value } = event.target;

    if (/^[0-9]*$/.test(value)) {
      updateFormValue(name, value);
      return;
    }

    Swal.fire({
      icon: "error",
      title: "입력 오류",
      text: `'${name}' 입력이 잘못되었습니다. 입력값은 숫자여야 합니다.`,
      background: "#f3f3f3",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "확인",
    });
    form.setFieldsValue({ [name]: "" });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof RegisterFormData;
    updateFormValue(name, event.target.value);
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof Pick<RegisterFormData, "phone1" | "phone2">;
    const reVal = event.target.value
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
      .replace(/(-{1,2})$/g, "");
    updateFormValue(name, reVal);
    form.setFieldsValue({ [name]: reVal });
  };

  const handleSubmit = async () => {
    try {
      const formattedData = {
        ...formData,
        movein: formData.movein.replace(/-/g, ""),
        phone1: formData.phone1.replace(/-/g, ""),
        phone2: formData.phone2.replace(/-/g, ""),
      };

      const response = await fetch(`${ip_address}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formattedData),
      });

      const data = (await response.json()) as SignupResponse;

      switch (data.status) {
        case 201:
          Swal.fire("Success", data.message ?? "회원가입 성공", "success");
          navigate("/");
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
      Swal.fire("Error", getErrorMessage(error), "error");
    }
  };

  const validatepw1 = (_rule: RuleObject, value?: string): Promise<void> => {
    if (value && (value.length < 8 || !/[a-z]/.test(value) || !/[0-9]/.test(value))) {
      return Promise.reject(
        new Error("비밀번호는 영어 소문자와 숫자를 포함한 8자리 이상이어야 합니다."),
      );
    }
    return Promise.resolve();
  };

  const validatepw2 = (_rule: RuleObject, value?: string): Promise<void> => {
    if (value && value !== formData.pw1) {
      return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
    }
    return Promise.resolve();
  };

  return (
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
            <Input placeholder="이름" name="username" onChange={handleChange} autoComplete="off" />
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
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              inputReadOnly
              onChange={(_date: Dayjs | null, dateString: string | string[]) => {
                updateFormValue("movein", Array.isArray(dateString) ? dateString[0] ?? "" : dateString);
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
            <Input.Password placeholder="비밀번호" name="pw1" onChange={handleChange} />
          </Form.Item>

          <Form.Item
            name="pw2"
            rules={[
              { required: true, message: "비밀번호 확인을 입력해주세요." },
              { validator: validatepw2 },
            ]}
          >
            <Input.Password placeholder="비밀번호 확인" name="pw2" onChange={handleChange} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-submit-btn">
              가입
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
