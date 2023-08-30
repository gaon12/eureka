import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Select, Input, Button } from 'antd';
import axios from 'axios';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom'; // 변경된 부분

function AppInner() { // 변경된 부분: 내부 컴포넌트
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const { Option } = Select;

  const handlePublish = async () => {
    const payload = {
      category,
      title,
      content,
      content2: content.replace(/<[^>]*>?/gm, ''),
    };

    try {
      const response = await axios.post('https://example.com/publish', payload);
      
      if (response.data.status === 201) {
        alert('게시글이 성공적으로 업로드되었습니다.');
        navigate('/notice');
      } else {
        alert('서버에서 오류가 발생했습니다.');
      }
      
    } catch (error) {
      if (error.response && error.response.data.status === 400) {
        alert('필수 항목 미입력: ' + error.response.data.error.message);
      } else {
        alert('알 수 없는 에러가 발생했습니다.');
      }
    }
  };

  return (
    <div className="App">
      <div>
        <Select
          placeholder="분류 선택"
          onChange={(value) => setCategory(value)}
          style={{ width: 200 }}
        >
          <Option value="tech">공지1</Option>
          <Option value="life">공지2</Option>
          {/* 다른 분류 추가 가능 */}
        </Select>
        <Input
          placeholder="제목"
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: 400, marginLeft: 20 }}
        />
      </div>
      <CKEditor
        editor={ClassicEditor}
        config={{
          simpleUpload: {
            uploadUrl: "https://test.com/img.php"
          }
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
        }}
      />
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <Button type="primary" onClick={handlePublish}>
          등록
        </Button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
