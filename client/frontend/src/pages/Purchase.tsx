import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Purchases() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from the backend
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-10 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 border border-gray-300">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          🦖 Purchase History
        </h1>

        {loading ? (
          <div className="text-center text-2xl font-semibold text-gray-600">
            Loading...
          </div>
        ) : (
          <div className="text-lg text-gray-600 text-center">
            <p>Nothing to display at this time.</p>
          </div>
        )}
      </div>

      <Link
        to="/"
        className="mt-6 bg-blue-600 text-white px-6 py-3 font-semibold border border-blue-700 rounded-lg hover:bg-blue-700 transition-all shadow-md"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default Purchases;
