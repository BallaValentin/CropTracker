import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import UsersListPage from "./pages/UsersListPage";
import { queryClient } from "./query-client/QueryClient";

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/" element={<MainPage />} />
            <Route path="/show-users" element={<UsersListPage />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
