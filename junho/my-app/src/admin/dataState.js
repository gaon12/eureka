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
          "content2":"",
			    "created_datetime": "2023-08-31T05:41:26.000Z"
    }
  ]
})
export const workDataState = atom({
  key: 'workDataState',
  default:[]})

export const userColumnsState =atom({
  key: 'userColumnsState',
  default:[
    {
      title: "회원아이디",
      render: (text, data) => `${data.dong}동 ${data.ho}호`,
      align: 'center',

    },
    {
      title: "이름",
      dataIndex: "username",
      key:'username',
      align: 'center'

    },
    {
      title: "휴대폰번호",
      dataIndex: "phone1",
      key:'phone1',
      align: 'center',
      render:(text) =>{
        const trnasformPhon1 = text.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        return trnasformPhon1
      },
      
    },
    {
      title: "전입일",
      dataIndex: "movein",
      key:'movein',
      align: 'center',
   
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
      key:"complaint_id",
      align: 'center'
    },
    {
      title: "제목",
      dataIndex: "title",
      key:'title',
      align: 'center',
      render: (text, record) => (
        <Link to={`/article/${record.complaint_id}`}>{text.replace(/&nbsp;/g, ' ')}</Link>
      )
    },
    {
      title: "내용",
      dataIndex: "content",
      key:'content',
      align: 'center',
      render: (text, record) => (<Link to={`/article/${record.complaint_id}`}>{text.replace(/&nbsp;/g, ' ')}</Link>)
    },    
    {
      title: "작성일",
      dataIndex: "created_datetime",
      key:'created_datetime',
      align: 'center',
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
      key:"car_number",
      align: 'center'
    },
    {
      title: "외부차량",
      dataIndex: "guest_car",
      key:"guest_car",
      align: 'center'
    },
    {
      title: "전기차",
      dataIndex: "electric_car",
      key:'electric_car',
      align: 'center'
    },
    {
      title: "장애차량",
      dataIndex: "disabled_car",
      key:'disabled_car',
      align: 'center'
    },
  ]
})


export const workColumnsStata = atom({
  key:'workColumnsStata',
  default: [
    {
      title: "번호",
      dataIndex: "w_l_id",
      key: "w_l_id",
      align: 'center',
      render:(text, record) => (<Link to={`/work/${record.w_l_id}`}>{text}</Link>)
    },
    {
      title: "업무 일지 내용",
      dataIndex: "w_content",
      key: "w_content",
      align: 'center',
      render:(text, record) => (<Link to={`/work/${record.w_l_id}`}>{text.replace(/&nbsp;/g, ' ')}</Link>)
    },
    {
      title: "업무 시작 일시",
      dataIndex: "w_start",
      key: "w_start",
      align: 'center',
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
      align: 'center',
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
      align: 'center',
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