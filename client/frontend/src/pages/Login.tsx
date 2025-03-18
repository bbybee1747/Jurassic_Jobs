import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const LOGIN_MUTATION = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation RegisterUser(
    $fullName: String!
    $phoneNumber: String!
    $address: String!
    $employer: String!
    $netWorth: Float!
    $email: String!
    $password: String!
  ) {
    registerUser(
      input: {
        fullName: $fullName
        phoneNumber: $phoneNumber
        address: $address
        employer: $employer
        netWorth: $netWorth
        email: $email
        password: $password
      }
    ) {
      token
      user {
        id
        email
      }
    }
  }
`;

function Login({ setIsAuthenticated }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [netWorth, setNetWorth] = useState<number | "">("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [employer, setEmployer] = useState("");
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

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const handleNetWorthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      setNetWorth("");
      setFundsError("Lack of funds = No Dinosaurs");
    } else {
      setNetWorth(parsedValue);
      setFundsError(
        parsedValue < 5000000 ? "Lack of funds = No Dinosaurs" : ""
      );
    }
  };

  const toggleMode = () => {
    // Reset errors and form fields when toggling modes
    setError("");
    setFundsError("");
    setEmail("");
    setPassword("");
    setFullName("");
    setPhoneNumber("");
    setAddress("");
    setEmployer("");
    setNetWorth("");
    setIsRegistering(!isRegistering);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        if (typeof netWorth !== "number" || netWorth < 5000000) {
          setFundsError("Lack of funds = No Dinosaurs");
          return;
        }
        const { data } = await registerMutation({
          variables: {
            fullName,
            phoneNumber,
            address,
            employer,
            netWorth: Number(netWorth),
            email,
            password,
          },
        });
        if (data && data.registerUser && data.registerUser.token) {
          localStorage.setItem("token", data.registerUser.token);
          localStorage.setItem("isAuthenticated", "true");
          setIsAuthenticated(true);
          const redirectTo = (location.state as any)?.from || "/";
          navigate(redirectTo);
        }
      } else {
        const { data } = await loginMutation({
          variables: { email, password },
        });
        if (data && data.loginUser && data.loginUser.token) {
          localStorage.setItem("token", data.loginUser.token);
          localStorage.setItem("isAuthenticated", "true");
          setIsAuthenticated(true);
          const redirectTo = (location.state as any)?.from || "/";
          navigate(redirectTo);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Invalid credentials or registration error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start font-sans text-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 p-10 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">
          {isRegistering ? "Register" : "Login"}
        </h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          {isRegistering && (
            <>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Full Name"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Address"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                id="employer"
                name="employer"
                type="text"
                placeholder="Employer"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                required
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
              />
              <input
                id="netWorth"
                name="netWorth"
                type="number"
                placeholder="Net Worth"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
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
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
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
          onClick={toggleMode}
          className="mt-4 w-full text-accent font-bold hover:underline transition-all"
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
