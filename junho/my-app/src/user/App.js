import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,

} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "../user/login";
import RegisterPage from "../user/sign";
import Main from "../user/Main";
import Noticeboard from "../user/noticeboard";
import Noticepage from "../user/noticepage"
import Complaintwrite from "../user/complaintwrite";
import Trash from "../user/trash";
import Calamity from "../user/calamity";
import News from "../user/news";
import Medicine from "../user/medicine";
import Hospitals from "../user/hospitals";
import Admin from "../admin/Admin";
import SearchCar from "../admin/SearchCar";
import Article from "../admin/article";
import ParkInfo from "../admin/parkInfo";
import UserInfo from "../admin/userInfo";
import Notice from "../admin/notice";
import Work from "../admin/work";
import {userRoleState} from "../admin/dataState"
import { ip_address } from './ipaddress';
import WorkWrite from "../admin/WorkWrite";
import { useRecoilState } from "recoil";
import { useNoticesData } from "./useNoticesData";
import WorkContent from "../admin/workContent";
import ArticleContent from "../admin/articleContent";
export function App() {
  const [userRole, setUserRole] = useRecoilState(userRoleState);
  const location = useLocation();
  const navigate = useNavigate();
  const noticesData = useNoticesData();
   
  useEffect(() => {
    if (location.pathname === "/") {
      if (userRole === "user") {
        navigate("/main");
      } else if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/login");
      }
    }
  }, [location, navigate, userRole]);

  useEffect(() => {
    fetch(`${ip_address}/user/auth`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          if (data.message === 0) {
            setUserRole("user"); // 일반 사용자
          } else if (data.message === 1) {
            setUserRole("admin"); // 관리자
          }
        } else {
          setUserRole(""); // 로그인하지 않은 상태 또는 오류 상태
        }
      })
      .catch(error => console.error('Error:', error));
  }, []);
  

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        {userRole === "" && (
          <>
            <Route path="*" element={<Navigate to="/login" />} />
            <Route
              path="/login"
              element={<Login userRole={userRole} setUserRole={setUserRole} />}
            />
            <Route path="/sign" element={<RegisterPage />} />
          </>
        )}

        {userRole === "user" && (
          <>
            <Route path="*" element={<Navigate to="/main" />} />
            <Route path="/main" element={<Main />} />
            <Route path="/noticeboard" element={<Noticeboard  noticesData={noticesData}/>} />
            <Route path='/noticeboard/:notice_id' element={<Noticepage noticesData={noticesData}/>} />
            <Route path="/complaintwrite" element={<Complaintwrite />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/calamity" element={<Calamity />} />
            <Route path="/news" element={<News />} />
            <Route path="/medicine" element={<Medicine />} />
            <Route path="/hospitals" element={<Hospitals />} />
          </>
        )}
        {userRole === "admin" && (
          <>
            <Route path="*" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/searchCar" element={<SearchCar />} />
            <Route path="/userTable" element={<UserInfo />} />
            <Route path="/article" element={<Article />} />
            <Route path="/article/:article_id" element={<ArticleContent />} />
            <Route path="/parkInfo" element={<ParkInfo />} />
            <Route path="/Notice" element={<Notice />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:work_id" element={<WorkContent />} />

            <Route path="/WorkWrite" element={<WorkWrite />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
