import { useEffect, useState } from "react";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import type { NewsItem } from "../types/domain";

interface RssNewsItem {
  title?: [string];
  link?: [string];
  pubDate?: [string];
}

interface PolicyRss {
  rss?: {
    channel?: [
      {
        item?: RssNewsItem[];
      },
    ];
  };
}

const isPolicyRss = (value: unknown): value is PolicyRss =>
  typeof value === "object" && value !== null && "rss" in value;

const toNewsItem = (item: RssNewsItem): NewsItem => ({
  title: item.title?.[0] ?? "",
  link: item.link?.[0] ?? "",
  pubDate: item.pubDate?.[0] ?? "",
});

export function useNewsData(): NewsItem[] {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const response = await axios.get<string>(
          "https://apis.uiharu.dev/fixcors/api.php?url=https://www.korea.kr/rss/policy.xml",
        );
        const result = (await parseStringPromise(response.data)) as unknown;

        if (!isPolicyRss(result)) {
          setNewsData([]);
          return;
        }

        const items = result.rss?.channel?.[0]?.item ?? [];
        setNewsData(items.map(toNewsItem));
      } catch (error) {
        console.error("Error fetching news", error);
        setNewsData([]);
      }
    };

    fetchRSS();
  }, []);

  return newsData;
}
