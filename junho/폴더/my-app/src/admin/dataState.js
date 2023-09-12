import { atom } from "recoil";

export const dataState = atom({
  key: "dataState",
  default: new Array(5).fill().map((_, i) => ({
    title: "차량등록요청",
    car_number: "48허7901",
    guest_car: 0,
    electric_car: 1,
    disabled_car: 0,
  })),
});
export const userDataState = atom({
  key: "userDataState",
  default: [{
    userId:'102동802호',
    userName:'정준호',
    phone1:'010-4462-1409',
    movein:'23-08-25',
  }],
});

export const carDataState = atom({
  key: "carDataState",
  default: [
    {
      car_number: "48허7901",
      guest_car: 0,
      electric_car: 1,
      disabled_car: 0,
  }
  ],
});
export const nCarDataState = atom({
  key:"nCarDataState",
  default:[]
})
export const articleDataState = atom({
  key:'articleDataState',
  default:[
    {
      noti_category : 1,
      title:'초전도체 발견?!',
      summary:'상온에서도 초전도체 성질을 가지는...',
      noti_w_date:'23-08-25'
    }
  ]
})
export const workDataState = atom({
  key: 'workDataState',
  default:[{
    w_l_id: 1,
    w_w_id: 12,
    w_content: "업무일지 내용",
    w_start: "2023-08-18T15:00:00.000Z",
    w_end: "2023-08-18T15:00:00.000Z",
    w_w_datetime: "2023-08-19T11:04:54.000Z"
  },
  {
    w_l_id: 2,
    w_w_id: 12,
    w_content: "업무일지 내용",
    w_start: "2023-08-18T15:00:00.000Z",
    w_end: "2023-08-18T15:00:00.000Z",
    w_w_datetime: "2023-08-19T11:04:54.000Z"
  },
  {
    w_l_id: 3,
    w_w_id: 12,
    w_content: "업무일지 내용",
    w_start: "2023-08-18T15:00:00.000Z",
    w_end: "2023-08-18T15:00:00.000Z",
    w_w_datetime: "2023-08-19T11:04:54.000Z"
  },
  {
    w_l_id: 4,
    w_w_id: 12,
    w_content: "업무일지 내용",
    w_start: "2023-08-18T15:00:00.000Z",
    w_end: "2023-08-18T15:00:00.000Z",
    w_w_datetime: "2023-08-19T11:04:54.000Z"
  },
  {
    w_l_id: 5,
    w_w_id: 12,
    w_content: "업무일지 내용",
    w_start: "2023-08-18T15:00:00.000Z",
    w_end: "2023-08-18T15:00:00.000Z",
    w_w_datetime: "2023-08-19T11:04:54.000Z"
  },
  {
    w_l_id: 6,
    w_w_id: 12,
    w_content: "업무일지 내용",
    w_start: "2023-08-18T15:00:00.000Z",
    w_end: "2023-08-18T15:00:00.000Z",
    w_w_datetime: "2023-08-19T11:04:54.000Z"
  },
  ]
})
