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
import PlotsListPage from "./pages/PlotsListPage";
import CreatePlotPage from "./pages/CreatePlotPage";
import PlotDetailsPage from "./pages/PlotDetailsPage";
import UpdatePlotPage from "./pages/UpdatePlotPage";

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
              <Route path="/show-plots" element={<PlotsListPage />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/create-plot" element={<CreatePlotPage />} />
              <Route path="/plot-details/:id" element={<PlotDetailsPage />} />
              <Route path="/update-plot/:id" element={<UpdatePlotPage />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </DrawerProvider>
    </>
  );
}

export default App;
