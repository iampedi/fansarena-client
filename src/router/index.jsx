// src/router/index.jsx
import { Route, Routes } from "react-router-dom";

import AdminLayout from "@/layout/AdminLayout";
import AuthLayout from "@/layout/AuthLayout";
import MainLayout from "@/layout/MainLayout";

import ClubDetails from "@/pages/ClubDetails";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import AdminPage from "@/pages/admin/Index";
import AdminCitiesPage from "@/pages/admin/cities/Index";
import EditClubPage from "@/pages/admin/clubs/Edit";
import AdminClubsPage from "@/pages/admin/clubs/Index";
import NewClubPage from "@/pages/admin/clubs/New";
import EditCompetitionPage from "@/pages/admin/competitions/Edit";
import AdminCompetitionsPage from "@/pages/admin/competitions/Index";
import NewCompetitionPage from "@/pages/admin/competitions/New";
import AdminCountriesPage from "@/pages/admin/countries/Index";
import SigninPage from "@/pages/auth/SigninPage";
import SignupPage from "@/pages/auth/SignupPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="clubs/:slug" element={<ClubDetails />} />
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
}
