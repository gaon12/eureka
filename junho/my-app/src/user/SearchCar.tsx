import { useState } from "react";
import type { ReactNode } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Card, Layout, List, message, Modal, Spin, Upload } from "antd";
import type { UploadProps } from "antd";
import { PREDICT_API_URL } from "../config/api";
import type { PlatePrediction } from "../types/domain";

const { Content } = Layout;
const { Dragger } = Upload;

const isSupportedImage = (file: File): boolean =>
  ["image/png", "image/jpeg"].includes(file.type);

export default function SearchCar() {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    if (!(file instanceof File)) {
      const error = new Error("Invalid upload file");
      onError?.(error);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(PREDICT_API_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = (await response.json()) as PlatePrediction;
        const modal = (
          <Modal
            title="차량 정보"
            open
            footer={null}
            onCancel={() => setModalContent(null)}
          >
            <List>
              <List.Item>
                <List.Item.Meta
                  title="차량 번호"
                  description={data.carNumber}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="차량 소유자"
                  description={`${data.username ?? "정보 없음"} (${data.dong ?? "-"}동 ${data.ho ?? "-"}호)`}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="장애차량"
                  description={data.disabledCar ? "예" : "아님"}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="전기차량"
                  description={data.electricCar ? "예" : "아님"}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="외부차량"
                  description={data.guestCar ? "예" : "아님"}
                />
              </List.Item>
            </List>
          </Modal>
        );
        setModalContent(modal);
        onSuccess?.(data);
      } else {
        const data = (await response.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        const error = new Error(data?.error?.message ?? "Upload failed");
        message.error(data?.error?.message ?? "파일 업로드에 실패했습니다.");
        onError?.(error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("파일 업로드 중 오류가 발생했습니다.");
      onError?.(
        error instanceof Error ? error : new Error("Unknown upload error"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
      <Card
        title="차량 번호판 이미지 검색"
        style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
      >
        {loading && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Spin tip="분석 중..." />
          </div>
        )}
        <Dragger
          name="file"
          multiple={false}
          accept="image/png,image/jpeg"
          customRequest={handleFileUpload}
          beforeUpload={(file) => {
            if (!isSupportedImage(file)) {
              message.error("PNG 또는 JPG 이미지만 업로드할 수 있습니다.");
              return Upload.LIST_IGNORE;
            }
            return true;
          }}
        >
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
