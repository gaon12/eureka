import React, { useEffect, useRef } from "react";
import NavBar from "../user/navbar";
function Trash() {
  const mapRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=l936h8b1w5";
    script.onload = () => {
      const mapOptions = {
        center: new window.naver.maps.LatLng(36.3504, 127.3845),
        zoom: 10,
      };
      const map = new window.naver.maps.Map(mapRef.current, mapOptions);
      window.naverMap = map;

      // Axios를 사용한 POST 요청
      const fetchPost = async () => {
        try {
          const response = await fetch(
            "https://apis.uiharu.dev/findbin/api.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                latitude: 36.34898258,
                longitude: 127.43264,
                distance: 1000,
              }),
            }
          );
          if (response.ok) {
            const data = response.data.json();
            console.log("API 응답:", data);
            if (Array.isArray(data)) {
              data.forEach((item) => {
                if (item.latitude && item.longitude) {
                  new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(
                      item.latitude,
                      item.longitude
                    ),
                    map: map,
                  });
                }
              });
            }
          }
        } catch (error) {
          console.error("API 요청 중에 문제가 발생했습니다:", error);
        }
      };
      fetchPost();
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <NavBar />
      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          ref={mapRef}
          style={{ width: "70%", height: "70vh", margin: "0 auto" }}
        ></div>
      </div>
    </>
  );
}

export default Trash;
