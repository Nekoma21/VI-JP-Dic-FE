import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./public-route";
import ProtectedRoute from "./protected-route";
import MainLayout from "../components/layouts/main";
import AdminLayout from "../components/layouts/admin";
import LookUpPage from "../views/lookup";
import TranslatePage from "../views/translate";
import DeckPage from "../views/deck";
import LoginPage from "../views/login";
import RegisterPage from "../views/register";
import VerifyPage from "../views/verify";
import WordResult from "../views/word-result";
import KanjiResult from "../views/kanji-result";
import ProfilePage from "../views/profile";
import AdminDashboard from "../views/admin/dashboard";
import { useAuth } from "../contexts/AccountContext";
import Vocabulary from "../views/admin/vocabulary";
import Hanzi from "../views/admin/kanji";
import Users from "../views/admin/users";
import Settings from "../views/admin/settings";
import VerifyLinkRestPage from "../views/reset-password/verify-link";
import ResetPasswordPage from "../views/reset-password";

const AllRouters = () => {
  const { account } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={account && account.role === 1 ? "/admin/dashboard" : "/kodomo"}
          />
        }
      />

      {/* Public route */}
      <Route element={<PublicRoute />}>
        <Route path="/user/verify/:userId/:token" element={<VerifyPage />} />
        <Route
          path="/user/verify-mail-reset/:userId/:token"
          element={<VerifyLinkRestPage />}
        />
        <Route
          path="/auth/login"
          element={<MainLayout component={LoginPage} />}
        />
        <Route
          path="/auth/register"
          element={<MainLayout component={RegisterPage} />}
        />
        <Route
          path="/auth/reset-password/:userId/:token"
          element={<MainLayout component={ResetPasswordPage} />}
        />
        <Route path="/kodomo" element={<MainLayout component={LookUpPage} />} />
        <Route path="/lookup" element={<MainLayout component={LookUpPage} />} />
        <Route
          path="/translate"
          element={<MainLayout component={TranslatePage} />}
        />
        <Route
          path="/lookup/result"
          element={<MainLayout component={WordResult} />}
        />
        <Route
          path="/lookup/kanji/result"
          element={<MainLayout component={KanjiResult} />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[1]} />}>
        <Route
          path="/admin/dashboard"
          element={<AdminLayout component={AdminDashboard} />}
        />
        <Route
          path="/admin/dictionary/vocabulary"
          element={<AdminLayout component={Vocabulary} />}
        />
        <Route
          path="/admin/dictionary/kanzi"
          element={<AdminLayout component={Hanzi} />}
        />
        <Route
          path="/admin/dictionary/kanzi"
          element={<AdminLayout component={Hanzi} />}
        />
        <Route
          path="/admin/users"
          element={<AdminLayout component={Users} />}
        />
        <Route
          path="/admin/settings"
          element={<AdminLayout component={Settings} />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[0]} />}>
        <Route path="/deck" element={<MainLayout component={DeckPage} />} />
        <Route
          path="/settings"
          element={<MainLayout component={ProfilePage} />}
        />
      </Route>
    </Routes>
  );
};

export default AllRouters;
