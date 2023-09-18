import { atom } from "recoil";
import { Link } from "react-router-dom";
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
    username:'정준호',
    phone1:'010-4462-1409',
    movein:'23-08-25',
  }],
});
export const userRoleState= atom({
  key:'userRoleState',
  default:''
})

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
      "complaint_id": 2,
			    "c_w_id": 1,
			    "title": "민원 제목",
			    "content": "민원 내용...",
			    "created_datetime": "2023-08-31T05:41:26.000Z"
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

export const userColumnsState =atom({
  key: 'userColumnsState',
  default:[
    {
      title: "회원아이디",
      render: (text, data) => `${data.dong}동 ${data.ho}호`,

    },
    {
      title: "이름",
      dataIndex: "username",
      key:'username'

    },
    {
      title: "휴대폰번호",
      dataIndex: "phone1",
      key:'phone1',
      render:(text) =>{
        const trnasformPhon1 = text.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        return trnasformPhon1
      },
      
    },
    {
      title: "전입일",
      dataIndex: "movein",
      key:'movein',
   
      render: (text) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return formattedDate;
    },
  }
  ]
})
export const articleColumnsState = atom({
  key:'articleColumnsState',
  default:[
    {
      title: "✨",
      dataIndex: "complaint_id",
      key:"complaint_id"
    },
    {
      title: "제목",
      dataIndex: "title",
      key:'title',
      render:(text,record,index)=>(
        <Link to={`/article/${index}`}>{text.replace(/&nbsp;/g, ' ')}</Link>
      )
      
      
    },
    {
      title: "내용",
      dataIndex: "content",
      key:'content',
      render:(text,record,index)=> (<Link to={`/article/${index}`}>{text.replace(/&nbsp;/g, ' ')}</Link>)
    },
    {
      title: "작성일",
      dataIndex: "created_datetime",
      key:'created_datetime',
      render: (text) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return formattedDate;
    },
  }
  
  ]
})
export const carColumnsState = atom({
  key:'carColumnsState',
  default:[
    {
      title: "차량번호",
      dataIndex: "car_number",
      key:"car_number"
    },
    {
      title: "외부차량",
      dataIndex: "guest_car",
      key:"guest_car"
    },
    {
      title: "전기차",
      dataIndex: "electric_car",
      key:'electric_car'
    },
    {
      title: "장애차량",
      dataIndex: "disabled_car",
      key:'disabled_car'
    },
  ]
})


export const workColumnsStata = atom({
  key:'workColumnsStata',
  default: [
    {
      title: "작성자",
      dataIndex: "w_w_id",
      key: "w_w_id",
      render:(text,record,index)=>(<Link to={`/work/${index}`}>{text}</Link>)
    },
    {
      title: "업무 일지 내용",
      dataIndex: "w_content",
      key: "w_content",
      render:(text,record,index)=>(<Link to={`/work/${index}`}>{text.replace(/&nbsp;/g, ' ')}</Link>)
      
      
    },
    {
      title: "업무 시작 일시",
      dataIndex: "w_start",
      key: "w_start",
      render: (text) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return formattedDate;
      },
    },
    {
      title: "업무 종료 일시",
      dataIndex: "w_end",
      key:'w_end',
      render: (text) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return formattedDate;
      },
    },
    {
      title: "작성일",
      dataIndex: "w_w_datetime",
      key:'w_w_datetime',
      render: (text) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return formattedDate;
      },
    },
  ]
}
)
export const noticeDataState = atom({
  key:'noticeDataState',
  default:[]
})