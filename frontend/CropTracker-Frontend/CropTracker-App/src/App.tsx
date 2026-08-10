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
import WorkStatisticsPage from "./pages/WorkStatisticsPage";

function App() {
  const routes = [
    { path: "/signin", element: <LoginPage /> },
    { path: "/signup", element: <RegisterPage /> },
    { path: "/", element: <MainPage /> },
    { path: "/verify-email", element: <VerifyEmailPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/change-password", element: <ChangePasswordPage /> },
    { path: "/show-users", element: <UsersListPage /> },
    { path: "/show-cropfields", element: <CropFieldListPage /> },
    { path: "/create-cropfield", element: <CreateCropFieldPage /> },
    { path: "/cropfield-details/:id", element: <CropFieldDetailsPage /> },
    { path: "/update-cropfield/:id", element: <UpdateCropFieldPage /> },
    { path: "/create-field-parcel", element: <CreateFieldParcelPage /> },
    { path: "/update-field-parcel/:id", element: <UpdateFieldParcelPage /> },
    { path: "/add-field-work/:id", element: <AddFieldWorkPage /> },
    { path: "/update-field-work/:id", element: <UpdateFieldWorkPage /> },
    { path: "/field-work-details/:id", element: <FieldWorkDetailsPage /> },
    { path: "/work-history", element: <WorkHistoryPage /> },
    { path: "/work-statistics", element: <WorkStatisticsPage /> },
    { path: "/show-crops", element: <CropsListPage /> },
    { path: "/error", element: <ErrorPage /> },
  ];
  return (
    <>
      <SelectionProvider>
        <DrawerProvider>
          <SnackbarProvider maxSnack={3}>
            <QueryClientProvider client={queryClient}>
              <Router>
                <Routes>
                  {routes.map((route) => (
                    <Route path={route["path"]} element={route["element"]} />
                  ))}
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
