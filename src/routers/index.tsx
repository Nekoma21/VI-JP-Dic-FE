import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./public-route";
import MainLayout from "../components/layouts/main";
import LookUpPage from "../views/lookup";
import TranslatePage from "../views/translate";
import DeckPage from "../views/deck";
import SettingsPage from "../views/settings";

const AllRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/kodomo"} />} />

      {/* Public route */}
      <Route element={<PublicRoute />}>
        <Route path="/kodomo" element={<MainLayout component={LookUpPage} />} />
        <Route path="/lookup" element={<MainLayout component={LookUpPage} />} />
        <Route
          path="/translate"
          element={<MainLayout component={TranslatePage} />}
        />
        <Route path="/deck" element={<MainLayout component={DeckPage} />} />
        <Route
          path="/settings"
          element={<MainLayout component={SettingsPage} />}
        />
      </Route>
    </Routes>
  );
};

export default AllRouters;
