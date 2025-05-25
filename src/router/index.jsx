// src/router/index.jsx
import { Route, Routes } from "react-router-dom";

import AdminLayout from "@/layout/AdminLayout";
import AuthLayout from "@/layout/AuthLayout";
import MainLayout from "@/layout/MainLayout";

import ClubDetailsPage from "@/pages/ClubDetails";
import HomePage from "@/pages/Home";
import LeaderboardPage from "@/pages/Leaderboard";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/Profile";

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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="clubs/:slug" element={<ClubDetailsPage />} />
        <Route path="leaderboard/" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="auth" element={<AuthLayout />}>
        <Route path="signup" element={<SignupPage />} />
        <Route path="signin" element={<SigninPage />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
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
