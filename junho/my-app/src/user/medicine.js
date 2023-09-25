import React, { useState, useEffect } from "react";
import { Table, Radio, Collapse, Pagination, Input, Spin } from "antd";
import NavBar from "../user/navbar";

const { Panel } = Collapse;

const DataTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState(null); // 추가
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const columns = [
    { title: "이름", dataIndex: "dutyName", align: "center", key: "dutyName" },
    { title: "주소", dataIndex: "dutyAddr", align: "center", key: "dutyAddr" },
    { title: "전화번호", dataIndex: "dutyTel1", align: "center", key: "dutyTel1" },
    {
      title: "카카오 맵",
      key: "kakaoMap",
      align: "center",
      render: (text, record) => {
        const { dutyName, wgs84Lat, wgs84Lon } = record;
        const kakaoMapUrl = `https://map.kakao.com/link/map/${dutyName},${wgs84Lat},${wgs84Lon}`;
        return (
          <a
            href={kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "blue",
              fontWeight: "bold",
            }}
          >
            맵 보기
          </a>
        );
      }
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    const API_KEY =
      "KgTzxtwXkBg%2Ff4ZrgvZA4mOI719k%2BgOF8lgKTMo63EYuKdIhhRAzX7b4uzQgXlNw9J1l0eQx0jkW4B2%2BW4Qsxw%3D%3D";

    let searchQuery = "";
    if (searchLocation.length > 0) {
      searchQuery = `&Q1=${searchLocation.join("|")}`;
    }

    fetch(
      `https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire?serviceKey=${API_KEY}&Q0=대전광역시${searchQuery}&numOfRows=10&pageNo=${page}`
    )
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((xml) => {
        const items = Array.from(xml.getElementsByTagName("item"));
        const parsedItems = items.map((item) => {
          let dutyTel1 = item.getElementsByTagName("dutyTel1")[0].textContent;
          if (dutyTel1.includes("000-0000")) {
            dutyTel1 = "전화번호 없음";
          }

          return {
            dutyAddr: item.getElementsByTagName("dutyAddr")[0].textContent,
            dutyName: item.getElementsByTagName("dutyName")[0].textContent,
            dutyTel1: dutyTel1,
            wgs84Lat: item.getElementsByTagName("wgs84Lat")[0].textContent,
            wgs84Lon: item.getElementsByTagName("wgs84Lon")[0].textContent
          };
        });
        setData(parsedItems);

        const totalCount = xml.getElementsByTagName("totalCount")[0]
          ?.textContent;
        if (totalCount) {
          setTotalPages(Math.ceil(Number(totalCount) / 10));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [page, searchLocation]);

  const handleRadioClick = (event) => {
    const value = event.target.value;
    if (selectedLocation === value) {
      setSelectedLocation(null);
      setSearchLocation([]);
    } else {
      setSelectedLocation(value);
      setSearchLocation([value]);
    }
  };

  return (
    <>
      <NavBar />
      <div>
        <Input.Search
          placeholder="주소 검색"
          style={{ marginTop: "20px" }}
          onSearch={(value) => setSearchLocation([value])}
        />
        <Collapse style={{ marginBottom: "20px", marginTop: "20px" }}>
          <Panel header="Detailed Search" key="1">
            <Radio.Group value={selectedLocation}>
              <Radio value="대덕구" onClick={handleRadioClick}>대덕구</Radio>
              <Radio value="동구" onClick={handleRadioClick}>동구</Radio>
              <Radio value="서구" onClick={handleRadioClick}>서구</Radio>
              <Radio value="중구" onClick={handleRadioClick}>중구</Radio>
              <Radio value="유성구" onClick={handleRadioClick}>유성구</Radio>
            </Radio.Group>
          </Panel>
        </Collapse>
        {isLoading ? (
          <div style={{ textAlign: "center", marginTop: "20vh" }}>
            <Spin tip="Loading..." size="large" />
          </div>
        ) : (
          <>
            <Table columns={columns} dataSource={data} pagination={false} />
            <Pagination
              current={page}
              total={totalPages * 10}
              onChange={(page) => setPage(page)}
              showSizeChanger={false}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default DataTable;
