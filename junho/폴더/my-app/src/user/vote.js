import React, { useState } from "react";
import { Button, List, Radio, Card } from "antd";
import Swal from 'sweetalert2';
import NavBar from "./navbar";

function App() {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = ["옵션 1", "옵션 2", "옵션 3", "옵션 4"];

  const handleRadioClick = (item) => {
    if (selectedOption === item) {
      setSelectedOption(null);
    } else {
      setSelectedOption(item);
    }
  };

  const handleVoteClick = () => {
    Swal.fire('성공', '투표하셨습니다.', 'success');
  };

  return (
    <>
    <NavBar />
    <div
      className="App"
      style={{
        textAlign: "center",
        marginTop: "50px",
        height: "600px"
      }}
    >
      <Card title="투표">
        <List
          dataSource={options}
          renderItem={(item) => (
            <List.Item>
              <Radio
                checked={selectedOption === item}
                onClick={() => handleRadioClick(item)}
              >
                {item}
              </Radio>
            </List.Item>
          )}
        />
        <Button 
          type="primary" 
          block 
          disabled={!selectedOption}
          onClick={handleVoteClick}
        >
          투표하기
        </Button>
      </Card>
    </div>
    </>
  );
}

export default App;
