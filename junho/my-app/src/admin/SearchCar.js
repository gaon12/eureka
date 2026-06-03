import React, { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Layout, Spin } from "antd";
import { Card, Upload, Modal } from "antd";
import Header from "./Header";
import Swal from 'sweetalert2';
import { PREDICT_API_URL } from "../config/api";

export default function SearchCar() {
  const { Content } = Layout;
  const { Dragger } = Upload;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && isModalVisible) {
        setIsModalVisible(false);
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [isModalVisible]);

  const handleOk = () => {
    setIsModalVisible(false);
    setFileList([]);
  };

  const handleFileUpload = async (options) => {
    const { file } = options;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(PREDICT_API_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCarData(data);
        setIsModalVisible(true);
      } else {
        console.error("Response not okay");
        Swal.fire({
          icon: 'error',
          title: '업로드 실패',
          text: '파일 업로드에 실패했습니다. 다시 시도해 주세요.',
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: 'error',
        title: '오류 발생',
        text: '파일 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: "image/png,image/jpeg",
    customRequest: handleFileUpload,
    fileList,
    beforeUpload: (file) => {
      const isImage = ["image/png", "image/jpeg"].includes(file.type);
      if (!isImage) {
        Swal.fire({
          icon: 'warning',
          title: '지원하지 않는 파일',
          text: 'PNG 또는 JPG 이미지만 업로드할 수 있습니다.',
        });
      }
      return isImage || Upload.LIST_IGNORE;
    },
  };

  return (
    <>
      <Header />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <Card
          title="차량 번호판 이미지 검색"
          style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
        >
          <Dragger {...uploadProps}>
            <div
              style={{
                height: "350px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                번호판 이미지를 클릭하거나 끌어다 놓으세요
              </p>
              <p className="ant-upload-hint">
                PNG 또는 JPG 파일 1개만 업로드할 수 있습니다.
              </p>
            </div>
          </Dragger>
          {loading && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Spin tip="Loading..." />
            </div>
          )}
        </Card>
        {carData && (
          <Modal
            title="차량 정보"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={() => setIsModalVisible(false)}
            cancelButtonProps={{ style: { display: "none" } }}
          >
            <div style={{ marginBottom: "16px", fontSize: "16px" }}>
              <strong style={{ fontSize: "24px" }}>{carData.carNumber}</strong>
              <div>{carData.username}({carData.dong}동 {carData.ho}호)</div>
            </div>
            <div>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                <li>
                  장애차량: {carData.disabledCar ? "예" : "아님"} / 전기차량: {carData.electricCar ? "예" : "아님"} / 외부차량: {carData.guestCar ? "예" : "아님"}
                </li>
              </ul>
            </div>
          </Modal>
        )}
      </Content>
    </>
  );
}
