import React, { useState, useEffect } from "react";
import { Table, Checkbox, Input, Collapse, Pagination } from "antd";
import axios from "axios";
import { parseString } from "xml2js";
import NavBar from "./navbar";

const { Panel } = Collapse;

const DataTable = () => {
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const columns = [
    {
      title: "시/도",
      dataIndex: "stateName",
      key: "stateName",
      width: "20%"
    },
    {
      title: "시/군/구",
      dataIndex: "cityName",
      key: "cityName",
      width: "20%"
    },
    {
      title: "약국 이름",
      dataIndex: "pharmacyName",
      key: "pharmacyName",
      width: "20%"
    },
    {
      title: "도로명 주소",
      dataIndex: "roadNameAddress",
      key: "roadNameAddress",
      width: "30%"
    },
    {
      title: "전화번호",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "20%"
    }
  ];

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const response = await axios.get(
          "https://apis.uiharu.dev/fixcors/api.php?url=http://43.202.151.155:3000/medical"
        );

        parseString(response.data, (err, result) => {
          if (err) {
            console.error("Error parsing XML:", err);
            return;
          }

          // RSS 피드의 키 이름을 확인하여 아래 키 이름을 업데이트하세요.
          const dataArray = result.rows.row.map((item) => ({
            stateName: item.StateName[0],
            cityName: item.CityName[0],
            pharmacyName: item.PharmacyName[0],
            roadNameAddress: item.RoadNameAddress[0],
            phoneNumber: item.PhoneNumber[0]
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
      newData = newData.filter((item) =>
        item.pharmacyName.includes(searchText)
      );
    }

    if (location.length) {
      newData = newData.filter((item) => location.includes(item.cityName));
    }

    setFilteredData(newData);
  }, [searchText, location, data]);

  const handleLocationChange = (e, cityName) => {
    const newLocation = [...location];
    if (e.target.checked) {
      newLocation.push(cityName);
    } else {
      const index = newLocation.indexOf(cityName);
      if (index > -1) {
        newLocation.splice(index, 1);
      }
    }
    setLocation(newLocation);
  };

  const totalItems = filteredData.length; // 이 부분을 여기로 옮겼습니다.

  return (
    <>
    <NavBar />
      <div style={{ width: "100%" }}>
        <Input.Search
          placeholder="약국 이름 검색"
          onSearch={(value) => setSearchText(value)}
          style={{ width: "100%", marginBottom: "20px" }}
        />
        <Collapse style={{ marginBottom: "20px" }}>
          <Panel header="세부 검색" key="1">
            <Checkbox onChange={(e) => handleLocationChange(e, "유성구")}>
              유성구
            </Checkbox>
            <Checkbox onChange={(e) => handleLocationChange(e, "대덕구")}>
              대덕구
            </Checkbox>
            <Checkbox onChange={(e) => handleLocationChange(e, "동구")}>
              동구
            </Checkbox>
            <Checkbox onChange={(e) => handleLocationChange(e, "서구")}>
              서구
            </Checkbox>
            <Checkbox onChange={(e) => handleLocationChange(e, "중구")}>
              중구
            </Checkbox>
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
