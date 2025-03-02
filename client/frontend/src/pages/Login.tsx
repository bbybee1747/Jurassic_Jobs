import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

function Login({ setIsAuthenticated }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [netWorth, setNetWorth] = useState<number | "">("");
  const [error, setError] = useState("");
  const [fundsError, setFundsError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "admin@jurassicjobs.com" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo);
    } else {
      setError("Invalid credentials");
    }
  };

  const handleNetWorthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setNetWorth(value);
    setFundsError(value < 5000000 ? "Lack of funds = No Dinosaurs" : "");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="bg-white p-8 border border-gray-300 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {isRegistering ? "Register" : "Login"}
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          {isRegistering && (
            <>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Employer"
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Net Worth"
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                value={netWorth}
                onChange={handleNetWorthChange}
              />
              {fundsError && (
                <p className="text-red-600 text-2xl font-bold text-center">
                  {fundsError}
                </p>
              )}
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-600 font-bold text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 font-bold border border-blue-700 rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            {isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="mt-4 w-full text-blue-600 font-bold hover:text-blue-800 transition-all"
        >
          {isRegistering
            ? "Already have an account? Login"
            : "New User? Register Here"}
        </button>
      </div>
    </div>
  );
}

export default Login;
