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
    <header className="bg-white text-gray-900 shadow-md border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Jurassic Jobs
        </h1>
        <nav className="flex items-center flex-grow ml-8">
          <div className="flex space-x-6">
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
            <Link
              to="/snes"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Game Mode
            </Link>
            <Link
              to="/search"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Search
            </Link>
            <Link
              to="/admin"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Admin
            </Link>
          </div>
          <div className="ml-auto">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-red-500 border border-red-500 px-4 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
