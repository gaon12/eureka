import { useState, useEffect } from "react";
import axios from "axios";
import { parseString } from "xml2js";

export function useNewsData() {
    const [newsData, setNewsData] = useState([]);
  
    useEffect(() => {
      const fetchRSS = async () => {
        try {
          const response = await axios.get(
            "https://apis.uiharu.dev/fixcors/api.php?url=https://www.korea.kr/rss/policy.xml"
          );
          parseString(response.data, (err, result) => {
            const newsArray = result.rss.channel[0].item.map((newsItem) => ({
              title: newsItem.title[0],
              link: newsItem.link[0],
              pubDate: newsItem.pubDate[0],
            }));
            setNewsData(newsArray);
          });
        } catch (error) {
        }
      };
  
      fetchRSS();
    }, []);
  
    return newsData;
  }
  
  