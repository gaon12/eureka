import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import NavBar from "./navbar";

interface TrashBin {
  road_address: string;
  latitude?: number | string;
  longitude?: number | string;
}

const latitude = 36.33911728370101;
const longitude = 127.4478382836177;
const distance = 1000;

const columns: ColumnsType<TrashBin> = [
  {
    title: "도로명 주소",
    align: "center",
    dataIndex: "road_address",
    key: "road_address",
  },
];

function Trash() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<NaverMap | null>(null);
  const [clickedMarkers, setClickedMarkers] = useState<TrashBin[]>([]);

  const markerClickHandler = useCallback(
    (item: TrashBin) => () => {
      setClickedMarkers((prevMarkers) => [
        item,
        ...prevMarkers.slice(0, Math.min(prevMarkers.length, 2)),
      ]);
    },
    [],
  );

  useEffect(() => {
    if (!mapRef.current) {
      return undefined;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=l936h8b1w5";
    script.onload = () => {
      if (!mapRef.current) {
        return;
      }

      const mapOptions = {
        center: new window.naver.maps.LatLng(latitude, longitude),
        zoom: 14,
      };
      const mapInstance = new window.naver.maps.Map(mapRef.current, mapOptions);
      setMap(mapInstance);

      const currentLocationMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(latitude, longitude),
        map: mapInstance,
        title: "현재 위치",
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: '<div style="width:150px;text-align:center;padding:10px;"><b>현재 위치</b></div>',
      });

      window.naver.maps.Event.addListener(currentLocationMarker, "click", () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(mapInstance, currentLocationMarker);
        }

        setClickedMarkers([{ road_address: "현재 위치" }]);
      });

      new window.naver.maps.Circle({
        map: mapInstance,
        center: new window.naver.maps.LatLng(latitude, longitude),
        radius: distance,
        strokeColor: "#5347AA",
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillOpacity: 0.3,
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    axios
      .post<TrashBin[]>(
        "https://apis.uiharu.dev/findbin/api.php",
        JSON.stringify({
          latitude,
          longitude,
          distance,
        }),
      )
      .then((response) => {
        response.data.forEach((item) => {
          if (item.latitude && item.longitude) {
            const marker = new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(item.latitude, item.longitude),
              map,
            });

            window.naver.maps.Event.addListener(marker, "click", markerClickHandler(item));
          }
        });
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
        <div ref={mapRef} style={{ width: "70%", height: "70vh", marginBottom: "20px" }} />
        <Table<TrashBin>
          columns={columns}
          dataSource={clickedMarkers}
          rowKey={(record) => record.road_address}
          pagination={false}
          style={{ width: "90%" }}
        />
      </div>
    </>
  );
}

export default Trash;
