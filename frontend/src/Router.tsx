import { Route, Routes } from "react-router-dom";
import { Feed } from "./pages/feed/Feed";
import { Home } from "./pages/home/Home";
import { NotFound } from "./pages/not-found/NotFound";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
