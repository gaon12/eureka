import { useState, useEffect } from "react";
import axios from "axios";
import { ip_address } from './ipaddress';
import { useRecoilState } from "recoil";
import {noticeDataState} from '../admin/dataState'
export function useNoticesData() {
  const [noticesData, setNoticesData] = useRecoilState(noticeDataState);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${ip_address}/notice`); // 공지사항 API 엔드포인트로 요청
        setNoticesData(response.data.results); // 결과를 상태에 저장
      } catch (error) {
        console.error("Error fetching notices", error);
      }
    };

    fetchNotices();
  }, []);

  return noticesData
}
