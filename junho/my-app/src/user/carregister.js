import { useState } from "react";
import { ip_address } from './ipaddress';
import { Checkbox, Form, Input, Typography, Button } from "antd";
import Swal from "sweetalert2";

const { Title } = Typography;

export default function Carregister() {

  const styles = {
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
      marginTop: "150px"
    },
    carInput: {
      width: "350px",
      marginTop: "20px"
    },
    checkboxGrid: {
      display: "flex",
      gap: "42px",
      marginTop: "10px"
    },
    button: {
      marginTop: "40px"
    }
  };

  const [carNumber, setCarNumber] = useState("");
  const [guestCar, setGuestCar] = useState(0);
  const [electricCar, setElectricCar] = useState(0);
  const [disabledCar, setDisabledCar] = useState(0);

  const handleInputChange = (e) => {
    setCarNumber(e.target.value);
  };

  const handleCheckboxChange = (name, isChecked) => {
    switch (name) {
      case "external":
        setGuestCar(isChecked ? 1 : 0);
        break;
      case "electric":
        setElectricCar(isChecked ? 1 : 0);
        break;
      case "disabled":
        setDisabledCar(isChecked ? 1 : 0);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const payload = {
      car_number: carNumber,
      guest_car: guestCar,
      electric_car: electricCar,
      disabled_car: disabledCar
    };
  
    // Payload를 콘솔에 JSON 형식으로 출력
  
    try {
      const response = await fetch(`${ip_address}/car/regist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (data.status === 201) {
        Swal.fire("Success!", "차량 등록 성공", "success");
      } else {
        switch (data.status) {
          case 400:
            switch (data.error?.errorCode) {
              case "E411":
                Swal.fire("Error!", "이미 등록된 차량입니다.", "warning");
                break;
              case "E412":
                Swal.fire("Error!", "승인 대기 중인 차량입니다.", "warning");
                break;
              case "E404":
                Swal.fire("Error!", "세션 정보가 없습니다.", "warning");
                break;
              default:
                Swal.fire("Error!", data.error?.message || "알 수 없는 오류가 발생했습니다.", "error");
            }
            break;
          default:
            Swal.fire("Error!", "알 수 없는 오류가 발생했습니다.", "error");
        }
      }
    } catch (error) {
      Swal.fire("Oops...", "서버와의 통신에 문제가 발생했습니다.", "error");
    }
  };
  
  
  return (
    <>
    <div style={styles.container}>
      <Title level={2}>차량 등록 페이지</Title>

      <div style={styles.carInput}>
        <Form.Item label="차량번호">
          <Input onChange={handleInputChange} />
        </Form.Item>
      </div>

      <div style={styles.checkboxGrid}>
        <Checkbox
          onChange={(e) => handleCheckboxChange("external", e.target.checked)}
        >
          외부차량
        </Checkbox>
        <Checkbox
          onChange={(e) => handleCheckboxChange("electric", e.target.checked)}
        >
          전기차량
        </Checkbox>
        <Checkbox
          onChange={(e) => handleCheckboxChange("disabled", e.target.checked)}
        >
          장애차량
        </Checkbox>
      </div>

      <div style={styles.button}>
        <Button
          type="primary"
          onClick={handleSubmit}
          size={"large"}
          style={{ width: "200px" }}
        >
          제출
        </Button>
      </div>
    </div>
    </>
  );
}