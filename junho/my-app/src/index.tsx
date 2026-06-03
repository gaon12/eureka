import React from "react";
import { createRoot } from "react-dom/client";
import App from "./user/App";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element was not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
);
