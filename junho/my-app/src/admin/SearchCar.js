import React, { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Layout, Spin } from "antd";
import { Card, Upload, Modal } from "antd";
import Header from "./Header";

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
      const response = await fetch("https://www.gaon.xyz:9037/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCarData(data);
        setIsModalVisible(true);
      } else {
        console.error("Response not okay");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    customRequest: handleFileUpload,
    fileList,
  };

  return (
    <>
      <Header />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <Card
          title="Image Upload"
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
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
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
            visible={isModalVisible}
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
