import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router";
import { RequireAuth } from "@/features/auth";
import { CabinetPage, StudentProgressPage } from "@/pages/cabinet";
import { CatalogPage } from "@/pages/catalog";
import { DocsPage, JavascriptPage } from "@/pages/docs";
import { HomePage } from "@/pages/home";
import { LessonPage } from "@/pages/lesson";
import { LoginPage } from "@/pages/login";
import { MePage } from "@/pages/me";
import { NotFoundPage } from "@/pages/not-found";
import { ProfilePage } from "@/pages/profile";
import { QuizPage } from "@/pages/quiz";
import { SignupPage } from "@/pages/signup";
import { UsersPage } from "@/pages/users";
import { ScrollOnNavigate } from "./scroll-on-navigate";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollOnNavigate />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/react" element={<CatalogPage />} />
        <Route path="/docs/react/:slug/quiz" element={<QuizPage />} />
        <Route path="/docs/react/:slug" element={<LessonPage />} />
        <Route path="/docs/javascript" element={<JavascriptPage />} />
        <Route path="/learn/react" element={<RedirectLearnToDocs />} />
        <Route path="/learn/react/*" element={<RedirectLearnToDocs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route
          path="/mentors"
          element={<Navigate to="/users?mentors=1" replace />}
        />
        <Route path="/u/:slug" element={<ProfilePage />} />
        <Route
          path="/me"
          element={
            <RequireAuth>
              <MePage />
            </RequireAuth>
          }
        />
        <Route
          path="/cabinet"
          element={
            <RequireAuth>
              <CabinetPage />
            </RequireAuth>
          }
        />
        <Route
          path="/cabinet/students/:id"
          element={
            <RequireAuth>
              <StudentProgressPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function RedirectLearnToDocs() {
  const params = useParams();
  const { search, hash } = useLocation();
  const rest = params["*"];
  const suffix = rest ? `/${rest}` : "";
  return <Navigate to={`/docs/react${suffix}${search}${hash}`} replace />;
}
