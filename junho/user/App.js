import { Route, Routes, Navigate,useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./login";
import RegisterPage from "./sign";
import Main from "./Main";
import Noticeboard from "./noticeboard";
import Noticeboardwrite from "./noticeboardwrite";
import Vote from "./vote";
import Trash from "./trash";
import PrivateRoute from "./privateRoute";
export function App() {
  const [userRole, setUserRole] = useState(false);
  const location = useLocation(); // 현재 위치 정보를 얻습니다.
  useEffect(() => {
    if (location.pathname === "/login") {
      setUserRole(false);
    }
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login setUserRole={setUserRole}/>}  />
        <Route path="/sign" element={<RegisterPage />}></Route>
        <Route path="/" element={<PrivateRoute currentRole={userRole}><Main/></PrivateRoute>}></Route>
        <Route path="/noticeboard" element={<PrivateRoute currentRole={userRole}><Noticeboard /></PrivateRoute>} />
        <Route path="/noticeboardwrite" element={<PrivateRoute currentRole={userRole}><Noticeboardwrite /></PrivateRoute>} />
        <Route path="/trash" element={<PrivateRoute currentRole={userRole}><Trash /></PrivateRoute>} />
        <Route path="/vote" element={<PrivateRoute currentRole={userRole}><Vote /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
