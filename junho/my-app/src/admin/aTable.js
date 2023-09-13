import { Table } from "antd";
export default function AllTable(props) {
    
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
    }
    return item;
  });
  const visibleData = transformData;
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <Table
      columns={columns}
      dataSource={visibleData}
      onChange={onChange}
      pagination={{
        position: 'default',
      }}
      rowKey={(record) => record.id}
    ></Table>
  );
}
