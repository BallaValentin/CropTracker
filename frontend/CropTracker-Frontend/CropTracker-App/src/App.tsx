import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import UsersListPage from "./pages/UsersListPage";
import { queryClient } from "./query-client/QueryClient";
import { DrawerProvider } from "./contexts/DrawerProvider";
import ErrorPage from "./pages/ErrorPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdateCropFieldPage from "./pages/UpdateCropFieldPage";
import CreateCropFieldPage from "./pages/CreateCropFieldPage";
import CropFieldDetailsPage from "./pages/CropFieldDetailsPage";
import CropFieldListPage from "./pages/CropFieldListPage";
import CropsListPage from "./pages/CropsListPage";

function App() {
  return (
    <>
      <DrawerProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/signin" element={<LoginPage />} />
              <Route path="/signup" element={<RegisterPage />} />
              <Route path="/" element={<MainPage />} />
              <Route path="/show-users" element={<UsersListPage />} />
              <Route path="/show-cropfields" element={<CropFieldListPage />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route
                path="/create-cropfield"
                element={<CreateCropFieldPage />}
              />
              <Route
                path="/cropfield-details/:id"
                element={<CropFieldDetailsPage />}
              />
              <Route
                path="/update-cropfield/:id"
                element={<UpdateCropFieldPage />}
              />
              <Route path="/show-crops" element={<CropsListPage />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </DrawerProvider>
    </>
  );
}

export default App;
