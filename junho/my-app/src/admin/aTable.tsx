import { Pagination, Table } from "antd";
import { useMemo, useState } from "react";
import type { Key } from "react";
import type { AppColumns, CarInfo, NoticeItem, TableRecord } from "../types/domain";

interface AllTableProps<T extends TableRecord> {
  columns: AppColumns<T>;
  data: T[];
}

const ITEMS_PER_PAGE = 10;

const getCategoryName = (categoryNumber: number | string): string => {
  switch (Number(categoryNumber)) {
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

const hasNoticeCategory = (item: TableRecord): item is NoticeItem =>
  "noti_category" in item;

const hasCarFlags = (item: TableRecord): item is CarInfo =>
  "guest_car" in item && "electric_car" in item && "disabled_car" in item;

const transformRow = <T extends TableRecord>(item: T): T => {
  if (hasNoticeCategory(item)) {
    return { ...item, noti_category: getCategoryName(item.noti_category) } as T;
  }

  if (hasCarFlags(item)) {
    return {
      ...item,
      guest_car: item.guest_car ? "True" : "False",
      electric_car: item.electric_car ? "True" : "False",
      disabled_car: item.disabled_car ? "True" : "False",
    } as T;
  }

  return item;
};

const getRowKey = (record: TableRecord, index?: number): Key =>
  record.id ?? record.notice_id ?? record.complaint_id ?? record.w_l_id ?? record.car_number ?? index ?? 0;

export default function AllTable<T extends TableRecord>({ columns, data }: AllTableProps<T>) {
  const [page, setPage] = useState(1);

  const transformedData = useMemo(() => data.map(transformRow), [data]);
  const visibleData = useMemo(() => {
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    return transformedData.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [page, transformedData]);

  return (
    <>
      <Table<T>
        columns={columns}
        dataSource={visibleData}
        pagination={false}
        rowKey={getRowKey}
      />
      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          current={page}
          total={transformedData.length}
          onChange={setPage}
          showSizeChanger={false}
          style={{ marginTop: "20px", textAlign: "center" }}
        />
      </div>
    </>
  );
}
