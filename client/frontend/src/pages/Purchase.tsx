import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Purchases() {
  const [loading, setLoading] = useState(true);
  const [purchasedDinosaurs, setPurchasedDinosaurs] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve purchased dinosaurs from localStorage
    const stored = localStorage.getItem("purchasedDinosaurs");
    if (stored) {
      setPurchasedDinosaurs(JSON.parse(stored));
    }
    // Simulate a loading state (adjust or remove as needed)
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
        ) : purchasedDinosaurs.length === 0 ? (
          <div className="text-lg text-gray-300 text-center">
            <p>Nothing to display at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedDinosaurs.map((dino) => (
              <div
                key={dino.id}
                className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg shadow-md"
              >
                {dino.imageUrl ? (
                  <img
                    src={dino.imageUrl}
                    alt={dino.species}
                    className="w-full h-48 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-600 flex items-center justify-center rounded">
                    <span className="text-gray-300">No Image</span>
                  </div>
                )}
                <h3 className="mt-2 text-2xl font-bold text-white">
                  {dino.species}
                </h3>
                <p className="text-white">Age: {dino.age}</p>
                <p className="text-white">Size: {dino.size}</p>
                <p className="text-white">Price: ${dino.price}</p>
                {dino.description && (
                  <p className="text-white mt-2">{dino.description}</p>
                )}
              </div>
            ))}
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
