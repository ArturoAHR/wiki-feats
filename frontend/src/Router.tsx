import { Route, Routes } from "react-router-dom";
import { Feed } from "./pages/feed/Feed";
import { Home } from "./pages/home/Home";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feed" element={<Feed />} />
    </Routes>
  );
};
