import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dinosaurs from "./pages/Dinosaurs";
import Purchases from "./pages/Purchase";
import SNESPage from "./pages/SNESPage";
import DinosaurSearch from "./pages/DinosaurSearch";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./AdminRoutes";
import TermsOfService from "./pages/Terms";
import PrivacyPolicy from "./pages/Privacy";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="bg-gradient-to-br from-bgStart via-bgMiddle to-bgEnd text-primary font-sans min-h-screen flex flex-col">
        <Header
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/dinosaurs"
              element={
                isAuthenticated ? <Dinosaurs /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/purchases"
              element={
                isAuthenticated ? <Purchases /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute isAuthenticated={isAuthenticated}>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route path="/snes" element={<SNESPage />} />
            <Route path="/search" element={<DinosaurSearch />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
