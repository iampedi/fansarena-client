// src/router/index.jsx
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import NewClubPage from "@/pages/admin/clubs/New";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/layout/MainLayout";
import AdminLayout from "@/layout/AdminLayout";
import AdminPage from "@/pages/admin/Index";
import AdminClubsPage from "@/pages/admin/clubs/Index";
import AdminCountriesPage from "@/pages/admin/countries/Index";
import AdminCitiesPage from "@/pages/admin/cities/Index";
import AuthLayout from "@/layout/AuthLayout";
import SignupPage from "@/pages/auth/signup/Index";
import SigninPage from "@/pages/auth/signin/Index";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>

      <Route path="auth" element={<AuthLayout />}>
        <Route path="signup" element={<SignupPage />} />
        <Route path="signin" element={<SigninPage />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
        <Route path="clubs" element={<AdminClubsPage />} />
        <Route path="clubs/new" element={<NewClubPage />} />
        <Route path="countries" element={<AdminCountriesPage />} />
        <Route path="cities" element={<AdminCitiesPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
