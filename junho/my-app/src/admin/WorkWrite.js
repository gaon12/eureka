import React, { useState } from "react";
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
  DatePicker,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import UploadAdapter from "./uploadAdapter";
import { Url } from "../admin/url";
import Header from "./Header";
// 환경 변수로 관리하는 것이 좋습니다.


const API_ENDPOINTS = {
  publish: `${Url}/work/write/`,
  imageUpload: "https://api.eureka.uiharu.dev/img.php",
};

function WorkWrite() {
  const [form] = Form.useForm();
  const [editorInstance, setEditorInstance] = useState(null);
  const { Content } = Layout;
  const { Title } = Typography;
  const { RangePicker } = DatePicker;

  const go = useNavigate();
  const navi= (path)=>{
    go(path)
  }

  const [dateValue, setDateValue] = useState([]);

  const onChange = (value, dateString) => {
    setDateValue(dateString);
 
  };
  const onOk = (value) => {

  };
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

      const content = editorInstance.getData();

      const payload = {
        start: dateValue[0],
        end: dateValue[1],
        content: stripHTMLTags(content),
        content2: content,
      };

      const response = await fetch(API_ENDPOINTS.publish, {
        headers:{"Content-Type":"application/json"},
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const data = await response.json();

      if (data.status ===201) {
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

  const handleImageUpload = (editor) => {
    if (!editor.plugins.get("FileRepository")) {
      console.error("Please check if the FileRepository plugin was loaded");
      return;
    }

    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      // 실제 URL을 사용하도록 수정
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
          <Title level={5}>업무일지작성</Title>
          <Form form={form} layout="vertical" style={{ padding: "20px" }}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <RangePicker
                    showTime={{
                      format: "HH:mm",
                    }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={onChange}
                    onOk={onOk}
                    style={{ width: "100%" }}
                  />
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

export default WorkWrite;