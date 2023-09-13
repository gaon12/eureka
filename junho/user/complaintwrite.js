import React, { useState } from "react";
import {
  Input,
  Button,
  Form,
  Row,
  Col,
  Layout,
  Card,
  Typography,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import UploadAdapter from "../user/UploadAdapter";
import { Url } from "../user/url";
import NavBar from "../user/navbar";
// 환경 변수로 관리하는 것이 좋습니다.

const API_ENDPOINTS = {
  publish: `${Url}/complaint/write/`,
  imageUpload: "https://api.eureka.uiharu.dev/img.php",
};

export default function Notice() {
  const [form] = Form.useForm();
  const [editorInstance, setEditorInstance] = useState(null);
  const { Content } = Layout;
  const { Title } = Typography;


  const stripHTMLTags = (str) => {
    if (typeof str !== "string") {
      console.error("Expected a string but received:", str);
      return "";
    }
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const handleSubmit = async () => {
    try {
      // Ant Design의 Form 유효성 검사
      await form.validateFields();
  
      const { title } = form.getFieldsValue();
      const content = editorInstance.getData();
      const payload = {
        title,
        content: stripHTMLTags(content),
        content2: content,
      };
      
      console.log(JSON.stringify(payload));
      
      const response = await fetch(API_ENDPOINTS.publish, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Server responded with an error");
      }
  
      const data = await response.json();
  
      if (data.status === 201) {
        Swal.fire("Success", "제출 성공", "success");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };
  
  const handleImageUpload = (editor) => {
    if (!editor.plugins.get("FileRepository")) {
      console.error("Please check if the FileRepository plugin was loaded");
      return;
    }

    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      // 실제 URL을 사용하도록 수정
      console.log(API_ENDPOINTS.imageUpload);
      return new UploadAdapter({ loader, url: API_ENDPOINTS.imageUpload });
    };
  };
  const minHeight = 750;
  return (
    <>
    <NavBar />
      <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
        <Card
          style={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            maxHeight: minHeight,
            overflow: "hidden",
          }}
        >
          <Title level={5}>민원 작성</Title>
          <Form form={form} layout="vertical" style={{ padding: "20px" }}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: "제목을 입력해주세요!" }]}
                >
                  <Input placeholder="제목을 입력하세요" />
                </Form.Item>
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: "내용을 입력해주세요!" }]}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    onReady={(editor) => {
                      handleImageUpload(editor);
                      setEditorInstance(editor);
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
