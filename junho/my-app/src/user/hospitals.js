import React, { useState, useEffect } from "react";
import { Table, Checkbox, Input, Collapse, Pagination } from "antd";
import axios from "axios";
import { parseString } from "xml2js";
import NavBar from "../user/navbar";

const { Panel } = Collapse;

const DataTable = () => {
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const columns = [
    {
      title: "병원 이름",
      dataIndex: "hospital",
      key: "hospital",
      width: "20%"
    },
    {
      title: "시/도",
      dataIndex: "city",
      key: "city",
      width: "10%"
    },
    {
      title: "시/군/구",
      dataIndex: "area",
      key: "area",
      width: "10%"
    },
    {
      title: "우편번호",
      dataIndex: "zipnumber",
      key: "zipnumber",
      width: "10%"
    },
    {
      title: "도로명 주소",
      dataIndex: "address",
      key: "address",
      width: "20%"
    },
    {
      title: "전화번호",
      dataIndex: "phone",
      key: "phone",
      width: "10%"
    },
    {
      title: "좌표 X",
      dataIndex: "coordinateX",
      key: "coordinateX",
      width: "10%"
    },
    {
      title: "좌표 Y",
      dataIndex: "coordinateY",
      key: "coordinateY",
      width: "10%"
    }
  ];

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const response = await axios.get(
          "https://apis.uiharu.dev/fixcors/api.php?url=http://43.202.151.155:3000/hospital"
        );

        parseString(response.data, (err, result) => {
          if (err) {
            console.error("Error parsing XML:", err);
            return;
          }

          const dataArray = result.rows.row.map((item) => ({
            hospital: item.Hospital[0],
            city: item.City[0],
            area: item.Area[0],
            zipnumber: item.Zipnumber[0],
            address: item.Address[0],
            phone: item.Phone[0],
            coordinateX: item.CoordinateX[0],
            coordinateY: item.CoordinateY[0]
          }));
          setData(dataArray);
        });
      } catch (error) {
        console.error("Error fetching RSS feed", error);
      }
    };

    fetchRSS();
  }, []);

  useEffect(() => {
    let newData = [...data];

    if (searchText) {
      newData = newData.filter((item) => item.hospital.includes(searchText));
    }

    if (location.length) {
      newData = newData.filter((item) => location.includes(item.area));
    }

    setFilteredData(newData);
  }, [searchText, location, data]);

  const handleLocationChange = (e, area) => {
    const newLocation = [...location];
    if (e.target.checked) {
      newLocation.push(area);
    } else {
      const index = newLocation.indexOf(area);
      if (index > -1) {
        newLocation.splice(index, 1);
      }
    }
    setLocation(newLocation);
  };

  const detailedSearchAreas = ["대덕구", "동구", "서구", "중구", "유성구"];

  const totalItems = filteredData.length;

  return (
    <>
    <NavBar />
      <div style={{ width: "100%" }}>
        <Input.Search
          placeholder="병원 이름 검색"
          onSearch={(value) => setSearchText(value)}
          style={{ width: "100%", marginBottom: "20px" }}
        />
        <Collapse style={{ marginBottom: "20px" }}>
          <Panel header="세부 검색" key="1">
            {detailedSearchAreas.map((area) => (
              <Checkbox
                key={area}
                onChange={(e) => handleLocationChange(e, area)}
              >
                {area}
              </Checkbox>
            ))}
          </Panel>
        </Collapse>
        <Table
          dataSource={filteredData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          columns={columns}
          pagination={false}
        />
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Pagination
            current={currentPage}
            onChange={setCurrentPage}
            total={totalItems}
            pageSize={pageSize}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default DataTable;
