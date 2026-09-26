import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RecordsPage from "./pages/RecordsPage";
import DetailPage from "./pages/DetailPage";
import { NewRecordPage, EditRecordPage } from "./pages/EditorPage";
import StatsPage from "./pages/StatsPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="records" element={<RecordsPage />} />
        <Route path="records/new" element={<NewRecordPage />} />
        <Route path="records/:id" element={<DetailPage />} />
        <Route path="records/:id/edit" element={<EditRecordPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
