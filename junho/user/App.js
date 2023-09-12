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
import Complaintwrite from "../user/complaintwrite";
import Trash from "../user/trash";
import Calamity from "../user/calamity";
import News from "../user/news";
import Medicine from "../user/medicine";
import Admin from "../admin/Admin";
import SearchCar from "../admin/SearchCar";
import Article from "../admin/article";
import ParkInfo from "../admin/parkInfo";
import UserInfo from "../admin/userInfo";
import Notice from "../admin/notice";
import Work from "../admin/work";
import WorkWrite from "../admin/workWrite";

export function App() {
  const [userRole, setUserRole] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    if (location.pathname === "/login") {
      setUserRole("");
    }
    if (location.pathname === "/") {
      navigate("/login");
    }
  }, []); 


  return (
    <div>
      <Routes>
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
            <Route path="/noticeboard" element={<Noticeboard />} />
            <Route path="/complaintwrite" element={<Complaintwrite />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/calamity" element={<Calamity />} />
            <Route path="/news" element={<News />} />
            <Route path="/medicine" element={<Medicine />} />
          </>
        )}
        {userRole === "admin" && (
          <>
            <Route path="*" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/searchCar" element={<SearchCar />} />
            <Route path="/userTable" element={<UserInfo />} />
            <Route path="/article" element={<Article />} />
            <Route path="/parkInfo" element={<ParkInfo />} />
            <Route path="/Notice" element={<Notice />} />
            <Route path="/work" element={<Work />} />
            <Route path="/WorkWrite" element={<WorkWrite />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;