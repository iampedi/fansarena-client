// src/router/index.jsx
import { Route, Routes } from "react-router-dom";

import AdminLayout from "@/layout/AdminLayout";
import AuthLayout from "@/layout/AuthLayout";
import MainLayout from "@/layout/MainLayout";

import ProtectedComponentsUser from "@/components/ProtectedComponentsUser";

import ClubDetailsPage from "@/pages/clubs/ClubDetails";
import HomePage from "@/pages/Home";
import LeaderboardPage from "@/pages/leaderboard/Index";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/profile/Index";

import SigninPage from "@/pages/auth/SigninPage";
import SignupPage from "@/pages/auth/SignupPage";

import AdminPage from "@/pages/admin/Index";
import AdminCitiesPage from "@/pages/admin/cities/Index";
import EditClubPage from "@/pages/admin/clubs/Edit";
import AdminClubsPage from "@/pages/admin/clubs/Index";
import NewClubPage from "@/pages/admin/clubs/New";
import EditCompetitionPage from "@/pages/admin/competitions/Edit";
import AdminCompetitionsPage from "@/pages/admin/competitions/Index";
import NewCompetitionPage from "@/pages/admin/competitions/New";
import AdminCountriesPage from "@/pages/admin/countries/Index";
import ProtectedRoutesAdmin from "@/components/ProtectedRoutesAdmin";
import ProtectedIncompletesUser from "@/components/ProtectIncompleteUser";
import ProtectedLoginUser from "@/components/ProtectedLoginUser";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="clubs/:slug" element={<ClubDetailsPage />} />
        <Route
          path="leaderboard/"
          element={
            <ProtectedComponentsUser>
              <ProtectedIncompletesUser>
                <LeaderboardPage />
              </ProtectedIncompletesUser>
            </ProtectedComponentsUser>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedComponentsUser>
              <ProfilePage />
            </ProtectedComponentsUser>
          }
        />
      </Route>

      <Route path="auth" element={<AuthLayout />}>
        <Route
          path="signup"
          element={
            // <ProtectedLoginUser>
              <SignupPage />
            // </ProtectedLoginUser>
          }
        />
        <Route
          path="signin"
          element={
            // <ProtectedLoginUser>
              <SigninPage />
            // </ProtectedLoginUser>
          }
        />
      </Route>

      <Route
        path="admin"
        element={
          <ProtectedRoutesAdmin>
            <AdminLayout />
          </ProtectedRoutesAdmin>
        }
      >
        <Route index element={<AdminPage />} />
        <Route path="competitions" element={<AdminCompetitionsPage />} />
        <Route path="competitions/new" element={<NewCompetitionPage />} />
        <Route path="competitions/:slug" element={<EditCompetitionPage />} />
        <Route path="clubs" element={<AdminClubsPage />} />
        <Route path="clubs/new" element={<NewClubPage />} />
        <Route path="clubs/:slug" element={<EditClubPage />} />
        <Route path="countries" element={<AdminCountriesPage />} />
        <Route path="cities" element={<AdminCitiesPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
