import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { Table } from "antd";
import NavBar from "./navbar";

function Trash() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [clickedMarkers, setClickedMarkers] = useState([]);

  const columns = [
    {
      title: "도로명 주소",
      dataIndex: "road_address",
      key: "road_address",
    },
  ];

  const markerClickHandler = useCallback(
    (item) => () => {
      setClickedMarkers((prevMarkers) => [
        item,
        ...prevMarkers.slice(0, prevMarkers.length > 2 ? 2 : prevMarkers.length - 1),
      ]);
    },
    []
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=l936h8b1w5";
    script.onload = () => {
      const mapOptions = {
        center: new window.naver.maps.LatLng(36.33911728370101, 127.4478382836177),
        zoom: 10,
      };
      const mapInstance = new window.naver.maps.Map(mapRef.current, mapOptions);
      setMap(mapInstance);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    axios
      .post(
        "https://apis.uiharu.dev/findbin/api.php",
        JSON.stringify({
          latitude: 36.33911728370101,
          longitude: 127.4478382836177,
          distance: 1000,
        })
      )
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.latitude && item.longitude) {
              const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(item.latitude, item.longitude),
                map: map,
              });

              window.naver.maps.Event.addListener(marker, "click", markerClickHandler(item));
            }
          });
        }
      })
      .catch((error) => {
        console.error("API 요청 중에 문제가 발생했습니다:", error);
      });
  }, [map, markerClickHandler]);

  return (
    <>
    <NavBar />
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          ref={mapRef}
          style={{ width: "70%", height: "70vh", marginBottom: "20px" }}
        ></div>
        <Table
          columns={columns}
          dataSource={clickedMarkers}
          rowKey={(record) => record.road_address}
          pagination={false} // 페이징 비활성화
          style={{ width: '90%' }} // 가로 길이 90%로 설정
        />
      </div>
    </>
  );
}

export default Trash;
