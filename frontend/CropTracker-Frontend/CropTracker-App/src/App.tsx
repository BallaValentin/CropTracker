import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import UsersListPage from "./pages/UsersListPage";
import { queryClient } from "./query-client/QueryClient";
import { DrawerProvider } from "./contexts/DrawerProvider";
import ErrorPage from "./pages/ErrorPage";
import EmailPage from "./pages/EmailPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

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
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/send-email" element={<EmailPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </DrawerProvider>
    </>
  );
}

export default App;
