import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dinosaurs from "./pages/Dinosaurs";
import Purchases from "./pages/Purchase";
import SNESPage from "./pages/SNESPage";
import DinosaurSearch from "./pages/DinosaurSearch";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="bg-yellow-300 text-red-600 font-sans min-h-screen flex flex-col">
        <Header
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <main className="flex-grow max-w-4xl mx-auto bg-black border-4 border-blue-600 shadow-lg p-8 rounded-xl">
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
            <Route path="/snes" element={<SNESPage />} />
            <Route path="/search" element={<DinosaurSearch />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
