import { Route, Routes,Navigate } from "react-router-dom";
import React from "react";
import Admin from "./Admin";
import Header from "./Header";
import SearchCar from "./SearchCar";
import Article from "./article";
import ParkInfo from "./parkInfo";
import UserInfo from "./userInfo";
import Notice from "./notice";
import Work from "./work";
export default function App() {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="*" element={<Navigate to="/admin" />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/searchCar" element={<SearchCar/>}></Route>
        <Route path="/userTable" element={<UserInfo/>}></Route>
        <Route path="/article" element={<Article/>}></Route>
        <Route path="/parkInfo" element={<ParkInfo/>}></Route>
        <Route path="/Notice" element={<Notice/>}></Route>
        <Route path='/work' element={<Work/>}></Route>
      </Routes>
    </div>
  );
}
