import { useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import Swal from "sweetalert2";
import { ip_address } from "./ipaddress";
import type { BinaryFlag } from "../types/domain";

const { Title } = Typography;

type CarOptionName = "external" | "electric" | "disabled";

interface RegisterCarPayload {
  car_number: string;
  guest_car: BinaryFlag;
  electric_car: BinaryFlag;
  disabled_car: BinaryFlag;
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "5px",
    maxWidth: "700px",
    margin: "20px auto",
    height: "400px",
    marginTop: "150px",
  },
  carInput: {
    width: "350px",
    marginTop: "20px",
  },
  checkboxGrid: {
    display: "flex",
    gap: "42px",
    marginTop: "10px",
  },
  button: {
    marginTop: "40px",
  },
};

export default function Carregister() {
  const [carNumber, setCarNumber] = useState("");
  const [guestCar, setGuestCar] = useState<BinaryFlag>(0);
  const [electricCar, setElectricCar] = useState<BinaryFlag>(0);
  const [disabledCar, setDisabledCar] = useState<BinaryFlag>(0);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCarNumber(event.target.value);
  };

  const handleCheckboxChange = (name: CarOptionName, isChecked: boolean) => {
    const value: BinaryFlag = isChecked ? 1 : 0;

    switch (name) {
      case "external":
        setGuestCar(value);
        break;
      case "electric":
        setElectricCar(value);
        break;
      case "disabled":
        setDisabledCar(value);
        break;
    }
  };

  const handleSubmit = async () => {
    const payload: RegisterCarPayload = {
      car_number: carNumber,
      guest_car: guestCar,
      electric_car: electricCar,
      disabled_car: disabledCar,
    };

    try {
      const response = await fetch(`${ip_address}/car/regist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        status: number;
        message?: string;
      };

      switch (data.status) {
        case 201:
          Swal.fire("Success", "차량 등록 신청 성공", "success");
          break;
        case 400:
          Swal.fire("Error", data.message ?? "차량 등록 신청 실패", "error");
          break;
        default:
          Swal.fire("Error", "알 수 없는 오류가 발생했습니다.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const checkboxHandler =
    (name: CarOptionName) =>
    (event: CheckboxChangeEvent): void => {
      handleCheckboxChange(name, event.target.checked);
    };

  return (
    <div style={styles.container}>
      <Title level={3}>차량등록</Title>
      <Form layout="vertical">
        <Input
          style={styles.carInput}
          placeholder="차량번호"
          value={carNumber}
          onChange={handleInputChange}
        />
        <div style={styles.checkboxGrid}>
          <Checkbox
            checked={guestCar === 1}
            onChange={checkboxHandler("external")}
          >
            외부차량
          </Checkbox>
          <Checkbox
            checked={electricCar === 1}
            onChange={checkboxHandler("electric")}
          >
            전기차량
          </Checkbox>
          <Checkbox
            checked={disabledCar === 1}
            onChange={checkboxHandler("disabled")}
          >
            장애차량
          </Checkbox>
        </div>
        <Button type="primary" style={styles.button} onClick={handleSubmit}>
          신청
        </Button>
      </Form>
    </div>
  );
}
