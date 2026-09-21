import { BrowserRouter, Route, Routes } from "react-router";
import { CatalogPage } from "@/pages/catalog";
import { HomePage } from "@/pages/home";
import { LessonPage } from "@/pages/lesson";
import { NotFoundPage } from "@/pages/not-found";
import { QuizPage } from "@/pages/quiz";
import { ScrollOnNavigate } from "./scroll-on-navigate";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollOnNavigate />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn/react" element={<CatalogPage />} />
        <Route path="/learn/react/:slug" element={<LessonPage />} />
        <Route path="/learn/react/:slug/quiz" element={<QuizPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
