import { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { ip_address } from "./ipaddress";
import { noticeDataState } from "../admin/dataState";
import type { ApiEnvelope } from "../types/api";
import type { NoticeItem } from "../types/domain";

export function useNoticesData(): NoticeItem[] {
  const [noticesData, setNoticesData] = useRecoilState(noticeDataState);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get<ApiEnvelope<NoticeItem[]>>(
          `${ip_address}/notice`,
          {
            withCredentials: true,
          },
        );
        setNoticesData(response.data.results ?? []);
      } catch (error) {
        console.error("Error fetching notices", error);
      }
    };

    fetchNotices();
  }, [setNoticesData]);

  return noticesData;
}
