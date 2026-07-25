import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppErrorBoundary } from "../components/feedback/AppErrorBoundary";
import { RouteLoading } from "../components/feedback/RouteLoading";
import { AppShell } from "../components/layout/AppShell";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const TracksPage = lazy(() => import("../pages/TracksPage"));
const TrackPage = lazy(() => import("../pages/TrackPage"));
const LessonPage = lazy(() => import("../pages/LessonPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export function App() {
  return (
    <AppErrorBoundary>
      <AppShell>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tracks" element={<TracksPage />} />
            <Route path="/tracks/:trackId" element={<TrackPage />} />
            <Route path="/learn/:trackId/:lessonId" element={<LessonPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/home" element={<Navigate replace to="/" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </AppErrorBoundary>
  );
}
