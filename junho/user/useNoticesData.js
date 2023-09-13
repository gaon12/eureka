import { useState, useEffect } from "react";
import axios from "axios";

export function useNoticesData() {
  const [noticesData, setNoticesData] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("/notice"); // 공지사항 API 엔드포인트로 요청
        setNoticesData(response.data.results); // 결과를 상태에 저장
      } catch (error) {
        console.error("Error fetching notices", error);
      }
    };

    fetchNotices(); // 공지사항 가져오기 함수 호출
  }, []);

  return noticesData;
}
