import { Table } from "antd";
import { useMemo } from "react";
import type { Key } from "react";
import type {
  AppColumns,
  CarInfo,
  ComplaintArticle,
  NoticeItem,
  RenderableValue,
  TableRecord,
} from "../types/domain";

interface CompactTableProps<T extends TableRecord> {
  columns: AppColumns<T>;
  data: T[];
}

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
const hasComplaintContent = (item: TableRecord): item is ComplaintArticle =>
  "complaint_id" in item;

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

  if (hasComplaintContent(item)) {
    return { ...item, content: item.content.replace(/&nbsp;/g, " ") } as T;
  }

  return item;
};

const toKey = (value: RenderableValue): Key | undefined =>
  typeof value === "string" || typeof value === "number" ? value : undefined;

const getRowKey = (record: TableRecord, index?: number): Key =>
  toKey(record.id) ??
  toKey(record.notice_id) ??
  toKey(record.complaint_id) ??
  toKey(record.w_l_id) ??
  toKey(record.car_number) ??
  index ??
  0;

export default function CTable<T extends TableRecord>({
  columns,
  data,
}: CompactTableProps<T>) {
  const visibleData = useMemo(() => data.map(transformRow).slice(0, 5), [data]);

  return (
    <Table<T>
      columns={columns}
      dataSource={visibleData}
      pagination={false}
      rowKey={getRowKey}
    />
  );
}
