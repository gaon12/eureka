import { atom } from "recoil";
import { Link } from "react-router-dom";
import type {
  AppColumns,
  CarInfo,
  ComplaintArticle,
  NoticeItem,
  PendingCarInfo,
  UserInfo,
  UserRole,
  WorkLog,
} from "../types/domain";

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const normalizeHtmlSpace = (value: string): string => value.replace(/&nbsp;/g, " ");

export const dataState = atom<CarInfo[]>({
  key: "dataState",
  default: Array.from({ length: 5 }, () => ({
    car_number: "48허7901",
    guest_car: 0,
    electric_car: 1,
    disabled_car: 0,
  })),
});

export const userDataState = atom<UserInfo[]>({
  key: "userDataState",
  default: [
    {
      userId: "102동802호",
      username: "정준호",
      phone1: "01044621409",
      movein: "2023-08-25",
    },
  ],
});

export const userRoleState = atom<UserRole>({
  key: "userRoleState",
  default: "",
});

export const carDataState = atom<CarInfo[]>({
  key: "carDataState",
  default: [
    {
      car_number: "48허7901",
      guest_car: 0,
      electric_car: 1,
      disabled_car: 0,
    },
  ],
});

export const nCarDataState = atom<PendingCarInfo[]>({
  key: "nCarDataState",
  default: [],
});

export const articleDataState = atom<ComplaintArticle[]>({
  key: "articleDataState",
  default: [
    {
      complaint_id: 2,
      c_w_id: 1,
      title: "민원 제목",
      content: "민원 내용...",
      content2: "",
      created_datetime: "2023-08-31T05:41:26.000Z",
    },
  ],
});

export const workDataState = atom<WorkLog[]>({
  key: "workDataState",
  default: [],
});

export const userColumnsState = atom<AppColumns<UserInfo>>({
  key: "userColumnsState",
  default: [
    {
      title: "회원아이디",
      render: (_value: unknown, record: UserInfo) => `${record.dong ?? ""}동 ${record.ho ?? ""}호`,
      align: "center",
    },
    {
      title: "이름",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "휴대폰번호",
      dataIndex: "phone1",
      key: "phone1",
      align: "center",
      render: (value: string) => value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"),
    },
    {
      title: "전입일",
      dataIndex: "movein",
      key: "movein",
      align: "center",
      render: (value: string) => formatDate(value),
    },
  ],
});

export const articleColumnsState = atom<AppColumns<ComplaintArticle>>({
  key: "articleColumnsState",
  default: [
    {
      title: "번호",
      dataIndex: "complaint_id",
      key: "complaint_id",
      align: "center",
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      align: "center",
      render: (value: string, record: ComplaintArticle) => (
        <Link to={`/article/${record.complaint_id}`}>{normalizeHtmlSpace(value)}</Link>
      ),
    },
    {
      title: "내용",
      dataIndex: "content",
      key: "content",
      align: "center",
      render: (value: string, record: ComplaintArticle) => (
        <Link to={`/article/${record.complaint_id}`}>{normalizeHtmlSpace(value)}</Link>
      ),
    },
    {
      title: "작성일",
      dataIndex: "created_datetime",
      key: "created_datetime",
      align: "center",
      render: (value: string) => formatDate(value),
    },
  ],
});

export const carColumnsState = atom<AppColumns<CarInfo>>({
  key: "carColumnsState",
  default: [
    {
      title: "차량번호",
      dataIndex: "car_number",
      key: "car_number",
      align: "center",
    },
    {
      title: "외부차량",
      dataIndex: "guest_car",
      key: "guest_car",
      align: "center",
    },
    {
      title: "전기차",
      dataIndex: "electric_car",
      key: "electric_car",
      align: "center",
    },
    {
      title: "장애차량",
      dataIndex: "disabled_car",
      key: "disabled_car",
      align: "center",
    },
  ],
});

export const workColumnsStata = atom<AppColumns<WorkLog>>({
  key: "workColumnsStata",
  default: [
    {
      title: "번호",
      dataIndex: "w_l_id",
      key: "w_l_id",
      align: "center",
      render: (value: number, record: WorkLog) => <Link to={`/work/${record.w_l_id}`}>{value}</Link>,
    },
    {
      title: "업무 일지 내용",
      dataIndex: "w_content",
      key: "w_content",
      align: "center",
      render: (value: string, record: WorkLog) => (
        <Link to={`/work/${record.w_l_id}`}>{normalizeHtmlSpace(value)}</Link>
      ),
    },
    {
      title: "업무 시작 일시",
      dataIndex: "w_start",
      key: "w_start",
      align: "center",
      render: (value: string) => formatDate(value),
    },
    {
      title: "업무 종료 일시",
      dataIndex: "w_end",
      key: "w_end",
      align: "center",
      render: (value: string) => formatDate(value),
    },
    {
      title: "작성일",
      dataIndex: "w_w_datetime",
      key: "w_w_datetime",
      align: "center",
      render: (value: string) => formatDate(value),
    },
  ],
});

export const noticeDataState = atom<NoticeItem[]>({
  key: "noticeDataState",
  default: [],
});
