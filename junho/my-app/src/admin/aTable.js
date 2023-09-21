import { Table,Pagination } from "antd";
import React, { useState, useEffect } from "react";
export default function AllTable(props) {
  const [page, setPage] = useState(1);
  const [currentData, setCurrentData] =useState(null);
  const itemsPerPage = 10;
  const { columns, data } = props;
  const totalPages = Math.ceil(data.length / itemsPerPage);
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
  useEffect(() => {
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    const updatedData = transformData.map((data) => ({
      ...data,
    }));

    setCurrentData(updatedData.slice(startIdx, endIdx));
  }, [page]);
  
  
  
  return (
    <>
    <Table
      columns={columns}
      dataSource={currentData}
      
      pagination={false}
      rowKey={(record) => record.id}
    ></Table>
     <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              current={page}
              total={totalPages * itemsPerPage}
              onChange={(page) => setPage(page)}
              showSizeChanger={false}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </div>
    </>
    
    
  );
}