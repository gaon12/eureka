import { useState } from "react";
import {
  Input,
  Button,
  Form,
  Row,
  Col,
  Select,
  Layout,
  Card,
  Typography,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import UploadAdapter from "./uploadAdapter";
import { Url } from "../admin/url";
import Header from "./Header";
import type { ApiEnvelope } from "../types/api";
import type { CkEditorInstance, CkFileLoader } from "../types/ckeditor";
// 환경 변수로 관리하는 것이 좋습니다.

const API_ENDPOINTS = {
  publish: `${Url}/notice/write`,
  imageUpload: "https://api.eureka.uiharu.dev/img.php",
};

export default function Notice() {
  const [form] = Form.useForm<{ category: string; title: string; content: string }>();
  const [editorInstance, setEditorInstance] = useState<CkEditorInstance | null>(null);
  const { Content } = Layout;
  const { Title } = Typography;

  const navi = useNavigate();
  const stripHTMLTags = (str: string): string => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.body.textContent || "";
  };

  const handleSubmit = async () => {
    try {
      // Ant Design의 Form 유효성 검사
      await form.validateFields();

      if (!editorInstance) {
        Swal.fire("Error", "에디터가 아직 준비되지 않았습니다.", "error");
        return;
      }

      const { category, title } = form.getFieldsValue();
      const content = editorInstance.getData();
      const payload = {
        category,
        title,
        content: content,
        content2: stripHTMLTags(content),
      };
     
      const response = await fetch(API_ENDPOINTS.publish, {
        headers:{"Content-Type":"application/json"},
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const data = (await response.json()) as ApiEnvelope<never>;
     
      if (data.status===200 || data.status===201) {
        Swal.fire("Success", "게시물이 등록되었습니다!", "success");
        navi("/admin");
      } else {
        Swal.fire("Error", "게시물 등록에 실패했습니다!", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleImageUpload = (editor: CkEditorInstance) => {
    const fileRepository = editor.plugins.get("FileRepository");
    if (!fileRepository) {
      console.error("Please check if the FileRepository plugin was loaded");
      return;
    }

    fileRepository.createUploadAdapter = (loader: CkFileLoader) => {
      return new UploadAdapter({ loader, url: API_ENDPOINTS.imageUpload });
    };
  };
  const minHeight = 750;
  return (
    <>
      <Header />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <Card
          style={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            maxHeight: minHeight,
            overflow: "hidden",
          }}
        >
          <Title level={5}>공지사항 작성</Title>
          <Form form={form} layout="vertical" style={{ padding: "20px" }}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: "제목을 입력해주세요!" }]}
                >
                  <Input placeholder="제목을 입력하세요" />
                </Form.Item>
                <Form.Item name="category" initialValue="1">
                  <Select
                    style={{ width: "100%" }}
                    options={[
                      { value: "1", label: "공지" },
                      { value: "2", label: "이벤트" },
                      { value: "3", label: "업데이트" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: "내용을 입력해주세요!" }]}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    onReady={(editor) => {
                      const typedEditor = editor as CkEditorInstance;
                      handleImageUpload(typedEditor);
                      setEditorInstance(typedEditor);
                    }}
                    config={{
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "blockQuote",
                        "imageUpload",
                      ],
                    }}
                  />
                </Form.Item>
                <Form.Item style={{ textAlign: "right" }}>
                  <Button type="primary" onClick={handleSubmit}>
                    제출하기
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Content>
    </>
  );
}
