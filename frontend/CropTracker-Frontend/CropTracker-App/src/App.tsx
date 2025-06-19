import { QueryClient } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      refetchInterval: 1000 * 60 * 60,
    },
  },
});

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
