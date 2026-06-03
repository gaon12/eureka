import { useEffect, useState } from "react";
import { Collapse, Input, Pagination, Radio, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import NavBar from "../user/navbar";
import type { HealthcareFacility } from "../types/domain";
import { getXmlText } from "../utils/xml";

const { Panel } = Collapse;

const columns: ColumnsType<HealthcareFacility> = [
  { title: "이름", dataIndex: "dutyName", align: "center", key: "dutyName" },
  { title: "주소", dataIndex: "dutyAddr", align: "center", key: "dutyAddr" },
  { title: "전화번호", dataIndex: "dutyTel1", align: "center", key: "dutyTel1" },
  {
    title: "카카오 맵",
    key: "kakaoMap",
    align: "center",
    render: (_text: string, record) => {
      const kakaoMapUrl = `https://map.kakao.com/link/map/${record.dutyName},${record.wgs84Lat},${record.wgs84Lon}`;
      return (
        <a
          href={kakaoMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "blue",
            fontWeight: "bold",
          }}
        >
          맵 보기
        </a>
      );
    },
  },
];

const normalizePhone = (value: string): string =>
  value.includes("000-0000") ? "전화번호 없음" : value;

const DataTable = () => {
  const [data, setData] = useState<HealthcareFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    const API_KEY =
      "KgTzxtwXkBg%2Ff4ZrgvZA4mOI719k%2BgOF8lgKTMo63EYuKdIhhRAzX7b4uzQgXlNw9J1l0eQx0jkW4B2%2BW4Qsxw%3D%3D";

    const searchQuery = searchLocation.length > 0 ? `&Q1=${searchLocation.join("|")}` : "";

    fetch(
      `https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire?serviceKey=${API_KEY}&Q0=대전광역시${searchQuery}&numOfRows=10&pageNo=${page}`,
    )
      .then((response) => response.text())
      .then((str) => new DOMParser().parseFromString(str, "text/xml"))
      .then((xml) => {
        const items = Array.from(xml.getElementsByTagName("item"));
        setData(
          items.map((item) => ({
            dutyAddr: getXmlText(item, "dutyAddr"),
            dutyName: getXmlText(item, "dutyName"),
            dutyTel1: normalizePhone(getXmlText(item, "dutyTel1")),
            wgs84Lat: getXmlText(item, "wgs84Lat"),
            wgs84Lon: getXmlText(item, "wgs84Lon"),
          })),
        );

        const totalCount = xml.getElementsByTagName("totalCount")[0]?.textContent;
        if (totalCount) {
          setTotalPages(Math.ceil(Number(totalCount) / 10));
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [page, searchLocation]);

  const handleRadioClick = (value: string) => {
    if (selectedLocation === value) {
      setSelectedLocation(null);
      setSearchLocation([]);
      return;
    }

    setSelectedLocation(value);
    setSearchLocation([value]);
  };

  return (
    <>
      <NavBar />
      <div>
        <Input.Search
          placeholder="주소 검색"
          style={{ marginTop: "20px" }}
          onSearch={(value) => setSearchLocation([value])}
        />
        <Collapse style={{ marginBottom: "20px", marginTop: "20px" }}>
          <Panel header="Detailed Search" key="1">
            <Radio.Group value={selectedLocation}>
              {["대덕구", "동구", "서구", "중구", "유성구"].map((label) => (
                <Radio key={label} value={label} onClick={() => handleRadioClick(label)}>
                  {label}
                </Radio>
              ))}
            </Radio.Group>
          </Panel>
        </Collapse>
        {isLoading ? (
          <div style={{ textAlign: "center", marginTop: "20vh" }}>
            <Spin tip="Loading..." size="large" />
          </div>
        ) : (
          <>
            <Table<HealthcareFacility>
              columns={columns}
              dataSource={data}
              pagination={false}
              rowKey={(record) => `${record.dutyName}-${record.dutyAddr}`}
            />
            <Pagination
              current={page}
              total={totalPages * 10}
              onChange={setPage}
              showSizeChanger={false}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default DataTable;
