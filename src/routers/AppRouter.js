import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../pages";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}></Route>
    </Routes>
  );
};

export default AppRouter;
