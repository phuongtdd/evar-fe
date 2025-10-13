import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { App as AppAntdApp } from "antd";

const App = () => {
  return (
    <>
    <AppAntdApp>
      <AppRoutes />
    </AppAntdApp>
    </>
  );
};

export default App;
