import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
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
import AddFieldWorkPage from "./pages/AddFieldWorkPage";
import WorkHistoryPage from "./pages/WorkHistoryPage";
import FieldWorkDetailsPage from "./pages/FieldWorkDetailsPage";
import UpdateFieldWorkPage from "./pages/UpdateFieldWorkPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import UpdateFieldParcelPage from "./pages/UpdateFieldParcelPage";
import CreateFieldParcelPage from "./pages/CreateFieldParcelPage";
import { SelectionProvider } from "./contexts/MenuSelectProvider";

function App() {
  return (
    <>
      <SelectionProvider>
        <DrawerProvider>
          <SnackbarProvider maxSnack={3}>
            <QueryClientProvider client={queryClient}>
              <Router>
                <Routes>
                  <Route path="/signin" element={<LoginPage />} />
                  <Route path="/signup" element={<RegisterPage />} />
                  <Route path="/" element={<MainPage />} />
                  <Route path="/show-users" element={<UsersListPage />} />
                  <Route
                    path="/show-cropfields"
                    element={<CropFieldListPage />}
                  />
                  <Route path="/error" element={<ErrorPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route
                    path="/change-password"
                    element={<ChangePasswordPage />}
                  />
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
                  <Route
                    path="/create-field-parcel"
                    element={<CreateFieldParcelPage />}
                  />
                  <Route
                    path="/update-field-parcel/:id"
                    element={<UpdateFieldParcelPage />}
                  />
                  <Route path="/show-crops" element={<CropsListPage />} />
                  <Route
                    path="/add-field-work/:id"
                    element={<AddFieldWorkPage />}
                  />
                  <Route
                    path="/update-field-work/:id"
                    element={<UpdateFieldWorkPage />}
                  />
                  <Route path="/work-history" element={<WorkHistoryPage />} />
                  <Route
                    path="/field-work-details/:id"
                    element={<FieldWorkDetailsPage />}
                  />
                </Routes>
              </Router>
            </QueryClientProvider>
          </SnackbarProvider>
        </DrawerProvider>
      </SelectionProvider>
    </>
  );
}

export default App;
