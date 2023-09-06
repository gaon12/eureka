import React, { useState, useCallback } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { Card, Upload, Input, Modal,List } from "antd";


export default function SearchCar() {
  const { Content } = Layout;
  const { Dragger } = Upload;
  const { Search } = Input;
  const [modalContent, setModalContent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleOk = () => {
    setModalOpen(false);
  };
  
  const onSearch = (value) => {
    setIsModalVisible(!isModalVisible);
    console.log({ isModalVisible: false });
  }
  const handleFileUpload = async (options) => {
    const { file } = options;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:3000/api/upload", {
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
      } else{
        {}
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const uploadProps = {
    name: "file",
    multiple: true,
    customRequest: handleFileUpload,
  };

  return (
    <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
      <Card
        title="Image Upload"
        style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}
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
      </Card>
      {modalContent}
    </Content>
  );
}
