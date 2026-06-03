import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Layout, Card, Upload, Modal, List, message, Spin } from "antd";
import { PREDICT_API_URL } from "../config/api";

export default function SearchCar() {
  const { Content } = Layout;
  const { Dragger } = Upload;
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setModalContent(null);
  };

  const handleFileUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(PREDICT_API_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const modal = (
          <Modal
            onOk={handleOk}
            closable={false}
            cancelButtonProps={{ style: { display: "none" } }}
            open={true}
          >
            <List
              bordered
              dataSource={data}
              renderItem={(item, i) => (
                <List.Item style={{ display: "flex" }}>
                  <List.Item.Meta
                    title={item.title}
                    description={` 차량번호: ${item.car_number},외부차량: ${
                      item.disabled_car ? "T" : "F"
                    }, 전기차: ${item.electric_car ? "T" : "F"}, 장애차량: ${
                      item.disabled_car ? "T" : "F"
                    }`}
                  />
                </List.Item>
              )}
            />
          </Modal>
        );
        setModalContent(modal);
        onSuccess?.(data);
      } else {
        const data = await response.json().catch(() => ({}));
        message.error(data?.error?.message || "파일 업로드에 실패했습니다.");
        onError?.(new Error(data?.error?.message || "Upload failed"));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("파일 업로드 중 오류가 발생했습니다.");
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: "image/png,image/jpeg",
    customRequest: handleFileUpload,
    beforeUpload: (file) => {
      const isImage = ["image/png", "image/jpeg"].includes(file.type);
      if (!isImage) {
        message.error("PNG 또는 JPG 이미지만 업로드할 수 있습니다.");
      }
      return isImage || Upload.LIST_IGNORE;
    },
  };

  return (
    <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
      <Card
        title="차량 번호판 이미지 검색"
        style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}
      >
        {loading && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Spin tip="분석 중..." />
          </div>
        )}
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
      </Card>
      {modalContent}
    </Content>
  );
}
