import { useEffect, useState } from "react";
import { Button, Collapse, Input, Pagination, Radio, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from "sweetalert2";
import NavBar from "../user/navbar";
import "../user/userstyles.css";

const { Panel } = Collapse;

interface DisasterMessage {
  md101_sn: string;
  create_date: string;
  location_name: string;
  msg: string;
}

interface DisasterResponse {
  data: DisasterMessage[];
  total_pages: number;
}

const columns: ColumnsType<DisasterMessage> = [
  {
    title: "날짜",
    dataIndex: "create_date",
    key: "create_date",
    width: "33%",
  },
  {
    title: "장소",
    dataIndex: "location_name",
    key: "location_name",
    width: "33%",
  },
  { title: "메시지", dataIndex: "msg", key: "msg", width: "33%" },
];

const dedupeLocations = (locationName: string): string =>
  [...new Set(locationName.split(","))].join(",");

const DataTable = () => {
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState<string[]>([]);
  const [data, setData] = useState<DisasterMessage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [searchText, location]);

  useEffect(() => {
    fetch(
      `https://apis.uiharu.dev/disaster/get_disaster_messages.php?page=${page}&search=${searchText}&filter=${location.join(
        ",",
      )}`,
    )
      .then((response) => response.json() as Promise<DisasterResponse>)
      .then((fetchedData) => {
        setData(
          fetchedData.data.map((item) => ({
            ...item,
            location_name: dedupeLocations(item.location_name),
          })),
        );
        setTotalPages(fetchedData.total_pages);
      })
      .catch((error) => console.error(error));
  }, [page, searchText, location]);

  const handleRadioClick = (value: string) => {
    if (selectedLocation === value) {
      setSelectedLocation(null);
      setLocation([]);
      return;
    }

    setSelectedLocation(value);
    setLocation([value]);
  };

  return (
    <>
      <NavBar />
      <div style={{ width: "100%" }}>
        <Input.Search
          placeholder="input search text"
          onSearch={setSearchText}
          style={{ width: "100%", marginBottom: "20px" }}
        />
        <Collapse style={{ marginBottom: "20px" }}>
          <Panel header="Detailed Search" key="1">
            <Radio.Group value={selectedLocation}>
              {[
                "서울특별시",
                "경기도",
                "인천광역시",
                "강원특별자치도",
                "대전광역시",
                "세종특별자치시",
                "충청북도",
                "충청남도",
                "경상북도",
                "경상남도",
                "전라북도",
                "전라남도",
                "제주특별자치도",
              ].map((label) => (
                <Radio
                  key={label}
                  value={label}
                  onClick={() => handleRadioClick(label)}
                >
                  {label}
                </Radio>
              ))}
            </Radio.Group>
          </Panel>
        </Collapse>
        <Table<DisasterMessage>
          columns={columns}
          dataSource={data}
          rowKey="md101_sn"
          pagination={false}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <p>발송시간: {record.create_date}</p>
                <p>대상지역: {record.location_name}</p>
                <p>재난문자 내용: {record.msg}</p>
                <CopyToClipboard
                  text={`발송시간: ${record.create_date}\n대상지역: ${record.location_name}\n재난문자 내용: ${record.msg}`}
                  onCopy={() => {
                    Swal.fire("성공!", "내용이 복사되었습니다.", "success");
                  }}
                >
                  <Button type="primary">복사</Button>
                </CopyToClipboard>
              </div>
            ),
          }}
        />
        <Pagination
          current={page}
          total={totalPages * 10}
          onChange={setPage}
          showSizeChanger={false}
          style={{ marginTop: "20px", textAlign: "center" }}
        />
      </div>
    </>
  );
};

export default DataTable;
