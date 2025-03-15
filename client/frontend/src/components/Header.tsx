import { Link } from "react-router-dom";

interface HeaderProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

function Header({ isAuthenticated, setIsAuthenticated }: HeaderProps) {
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <header className="bg-white text-gray-900 flex justify-between items-center px-6 py-4 border-b border-gray-200 shadow-sm">
      <h1 className="text-xl font-bold tracking-tight">Jurassic Jobs</h1>
      <nav className="flex space-x-6">
        <Link
          to="/"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/dinosaurs"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Dinosaurs
        </Link>
        <Link
          to="/purchases"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Purchases
        </Link>
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/snes"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              SNES
            </Link>
            <Link
              to="/search"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Search
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-red-500 border border-red-500 px-4 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
