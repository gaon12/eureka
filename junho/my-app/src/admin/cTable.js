import { Table } from "antd";

export default function CTable(props) {
  const { columns, data } = props;
  
  const getCategoryName = (categoryNumber) => {
    switch (categoryNumber) {
      case 1:
        return "공지";
      case 2:
        return "이벤트";
      case 3:
        return "업데이트";
      default:
        return "기타";
    }
  };

  const transformData = data.map((item) => {
    if (item.hasOwnProperty("noti_category")) {
      return {
        ...item,
        noti_category: getCategoryName(item.noti_category),
      };
    } else if (
      item.hasOwnProperty("guest_car") &&
      item.hasOwnProperty("electric_car") &&
      item.hasOwnProperty("disabled_car")
    ) {
      return {
        ...item,
        guest_car: item.guest_car ? "True" : "False",
        electric_car: item.electric_car ? "True" : "False",
        disabled_car: item.disabled_car ? "True" : "False",
      };
    } else if(
      item.hasOwnProperty("complaint_id")
    ){
      return{
        ...item,
        content: item.content.replace('&nbsp;' ," ")
      }
    }

    return item;
  });

  const onChange = (pagination, filters, sorter, extra) => {
  };

  // 여기서 최신 5개의 데이터만 가져옵니다
  const visibleData = transformData.slice(0,5);


  return (
    <Table
      columns={columns}
      dataSource={visibleData}
      onChange={onChange}
      pagination={false}
      rowKey={(record) => record.id}
    ></Table>
  );
}
