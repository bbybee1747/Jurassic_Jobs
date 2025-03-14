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
    <header className="bg-black text-white flex justify-between items-center p-4 border-b-4 border-neon-green shadow-lg">
      <h1 className="neon-pink text-3xl font-semibold tracking-wide">
        Jurassic Jobs
      </h1>
      <nav className="flex space-x-6">
        <Link to="/" className="neon-blue hover:text-neon-green transition-all">
          Home
        </Link>
        <Link
          to="/dinosaurs"
          className="neon-blue hover:text-neon-green transition-all"
        >
          Dinosaurs
        </Link>
        <Link
          to="/purchases"
          className="neon-blue hover:text-neon-green transition-all"
        >
          Purchases
        </Link>
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="neon-blue hover:text-neon-green transition-all"
            >
              Login
            </Link>
            <Link
              to="/snes"
              className="neon-blue hover:text-neon-green transition-all"
            >
              SNES
            </Link>
            <Link
              to="/search"
              className="neon-blue hover:text-neon-green transition-all"
            >
              Search
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="neon-red border border-neon-red px-4 py-1 rounded-lg hover:text-neon-yellow transition-all"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
