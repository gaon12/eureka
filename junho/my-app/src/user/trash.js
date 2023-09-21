import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { Table } from "antd";
import NavBar from "./navbar";

function Trash() {

  const [markers, setMarkers] = useState([]); // 마커를 저장할 상태 변수
  const [infoWindows, setInfoWindows] = useState([]); // 정보 창을 저장할 상태 변수
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [clickedMarkers, setClickedMarkers] = useState([]);
  const [distance, setDistance] = useState(1000); // 반경을 상태 변수로 추가

  const latitude = 36.33911728370101;  // 위도와 경도를 컴포넌트 스코프에서 단 한 번만 선언
  const longitude = 127.4478382836177; 

  const columns = [
    {
      title: "도로명 주소",
      align: 'center',
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
        center: new window.naver.maps.LatLng(latitude, longitude),
        zoom: 14,
      };
      const mapInstance = new window.naver.maps.Map(mapRef.current, mapOptions);
      setMap(mapInstance);
  
      // 현재 위치에 마커 핀 추가
      const currentLocationMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(latitude, longitude),
        map: mapInstance,
        title: "현재 위치",
      });
  
      // 현재 위치 정보창
      const infoWindow = new window.naver.maps.InfoWindow({
        content: '<div style="width:150px;text-align:center;padding:10px;"><b>현재 위치</b></div>',
      });
  
      window.naver.maps.Event.addListener(currentLocationMarker, "click", () => {
        if (infoWindow.getMap()) {
          infoWindow.close(); // 정보 창이 열려 있다면 닫기
        } else {
          infoWindow.open(mapInstance, currentLocationMarker); // 정보 창이 닫혀 있다면 열기
        }
      
        setClickedMarkers([
          {
            road_address: "현재 위치",
          }
        ]);
      });
      
  
      // 반경 distance 미터 내에 원 그리기
      new window.naver.maps.Circle({
        map: mapInstance,
        center: new window.naver.maps.LatLng(latitude, longitude),
        radius: distance,
        strokeColor: '#5347AA',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillOpacity: 0.3,
      });
    };
  
    document.head.appendChild(script);
  
    return () => {
      document.head.removeChild(script);
    };
  }, [distance]);
  
  

  useEffect(() => {
    if (!map) return;

    axios
      .post(
        "https://apis.uiharu.dev/findbin/api.php",
        JSON.stringify({
          latitude,
          longitude,
          distance,
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
  }, [map, markerClickHandler, latitude, longitude, distance]);  // useEffect 의존성 배열에 latitude와 longitude 추가

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
          pagination={false}
          style={{ width: '90%' }}
        />
      </div>
    </>
  );
}

export default Trash;
