import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../pages";
import { AuthLayout, Login, Register } from "../pages/auth";
import { Chat } from "../pages/chat";
import Home from "../pages/chat/Home";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route element={<Home />} />
        <Route path="chat/:id" element={<Chat />} />
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
