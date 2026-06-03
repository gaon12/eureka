import type { ColumnsType } from "antd/es/table";

export type UserRole = "" | "user" | "admin";
export type BinaryFlag = 0 | 1;
export type RenderableValue = string | number | boolean | null | undefined;
export type TableRecord = Record<string, RenderableValue>;

export interface UserInfo extends TableRecord {
  id?: number;
  dong?: number | string;
  ho?: number | string;
  userId?: string;
  username: string;
  phone1: string;
  movein: string;
}

export interface CarInfo extends TableRecord {
  id?: number;
  car_number: string;
  guest_car: BinaryFlag | boolean | string;
  electric_car: BinaryFlag | boolean | string;
  disabled_car: BinaryFlag | boolean | string;
}

export interface PendingCarInfo extends CarInfo {
  username?: string;
  dong?: number | string;
  ho?: number | string;
}

export interface ComplaintArticle extends TableRecord {
  id?: number;
  complaint_id: number;
  c_w_id?: number;
  title: string;
  content: string;
  content2: string;
  created_datetime: string;
}

export interface WorkLog extends TableRecord {
  id?: number;
  w_l_id: number;
  w_content: string;
  w_content2: string;
  w_start: string;
  w_end: string;
  w_w_datetime: string;
}

export interface NoticeItem extends TableRecord {
  id?: number;
  notice_id: number;
  noti_category: number | string;
  title: string;
  content: string;
  content2: string;
  summary?: string | null;
  noti_w_date: string;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
}

export interface WeatherRow {
  key: string;
  발표일시: string;
  지역: string;
  하늘상태: string;
  강수확률: string;
  최저기온: string;
  최고기온: string;
  풍속: string;
}

export interface PlatePrediction {
  carNumber: string;
  username?: string;
  dong?: number | string;
  ho?: number | string;
  disabledCar?: boolean;
  electricCar?: boolean;
  guestCar?: boolean;
}

export interface HealthcareFacility {
  dutyAddr: string;
  dutyDiv?: string;
  dutyDivNam?: string;
  dutyName: string;
  dutyTel1: string;
  wgs84Lat: string;
  wgs84Lon: string;
}

export type AppColumns<T extends object> = ColumnsType<T>;
