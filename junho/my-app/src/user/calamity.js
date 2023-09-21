import React, { useState, useEffect } from "react";
import { Table, Checkbox, Button, Collapse, Pagination, Input } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from 'sweetalert2';
import NavBar from "../user/navbar";
import "../user/userstyles.css";

const { Panel } = Collapse;

const DataTable = () => {
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const columns = [
    {
      title: "날짜",
      dataIndex: "create_date",
      key: "create_date",
      width: "33%"
    },
    {
      title: "장소",
      dataIndex: "location_name",
      key: "location_name",
      width: "33%"
    },
    { title: "메시지", dataIndex: "msg", key: "msg", width: "33%" }
  ];

  useEffect(() => {
    setPage(1);
  }, [searchText, location]);

  useEffect(() => {
    fetch(
      `https://apis.uiharu.dev/disaster/get_disaster_messages.php?page=${page}&search=${searchText}&filter=${location.join(
        ","
      )}`
    )
      .then((response) => response.json())
      .then((fetchedData) => {
        const processedData = fetchedData.data.map((item) => {
          const locations = item.location_name.split(",");
          const uniqueLocations = [...new Set(locations)];
          return {
            ...item,
            location_name: uniqueLocations.join(",")
          };
        });

        setData(processedData);
        setTotalPages(fetchedData.total_pages);
      })
      .catch((err) => console.error(err));
  }, [page, searchText, location]);

  const handleLocationChange = (event) => {
    const newLocation = [...location];
    if (event.target.checked) {
      newLocation.push(event.target.value);
    } else {
      const index = newLocation.indexOf(event.target.value);
      if (index > -1) {
        newLocation.splice(index, 1);
      }
    }
    setLocation(newLocation);
  };

  return (
    <>
      <NavBar />
      <div style={{ width: "100%" }}>
        <Input.Search
          placeholder="input search text"
          onSearch={(value) => setSearchText(value)}
          style={{ width: "100%", marginBottom: "20px" }}
        />
        <Collapse style={{ marginBottom: "20px" }}>
          <Panel header="Detailed Search" key="1">
          <Checkbox onChange={handleLocationChange} value="서울특별시">
            서울특별시
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="경기도">
            경기도
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="인천광역시">
            인천광역시
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="강원특별자치도">
            강원특별자치도
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="대전광역시">
            대전광역시
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="세종특별자치시">
            세종특별자치시
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="충청북도">
            충청북도
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="충청남도">
            충청남도
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="경상북도">
            경상북도
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="경상남도">
            경상남도
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="전라북도">
            전라북도
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="전라남도">
            전라남도
          </Checkbox>
          <Checkbox onChange={handleLocationChange} value="제주특별자치도">
            제주특별자치도
          </Checkbox>
        </Panel>
        </Collapse>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="md101_sn"
          pagination={false}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <p>발송시간: {record.create_date}</p>
                <p>대상지역: {record.location_name}</p>
                <p>재난문자 내용: {record.msg}</p>
                <CopyToClipboard
                  text={`발송시간: ${record.create_date}\n대상지역: ${record.location_name}\n재난문자 내용: ${record.msg}`}
                  onCopy={() => {
                    Swal.fire(
                      '성공!',
                      '내용이 복사되었습니다.',
                      'success'
                    );
                  }}
                >
                  <Button type="primary">복사</Button>
                </CopyToClipboard>
              </div>
            )
          }}
        />
        <Pagination
          current={page}
          total={totalPages * 10}
          onChange={(page) => setPage(page)}
          showSizeChanger={false}
          style={{ marginTop: "20px", textAlign: "center" }}
        />
      </div>
    </>
  );
};

export default DataTable;
