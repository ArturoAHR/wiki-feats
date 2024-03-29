import { Route, Routes } from "react-router-dom";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<div>hello</div>} />
    </Routes>
  );
};
