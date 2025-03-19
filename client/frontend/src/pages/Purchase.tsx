import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Purchases() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start font-sans text-center min-h-screen bg-gray-900 p-10">
      <div className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-2xl p-10 border border-gray-700 mt-8">
        <h1 className="text-4xl font-bold text-white mb-6">
          🦖 Purchase History
        </h1>

        {loading ? (
          <div className="text-center text-2xl font-semibold text-gray-300">
            Loading...
          </div>
        ) : (
          <div className="text-lg text-gray-300 text-center">
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
