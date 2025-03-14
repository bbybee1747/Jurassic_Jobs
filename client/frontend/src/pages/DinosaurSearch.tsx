import { useState } from "react";
import axios from "axios";

const DinosaurSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/search", {
        query,
      });
      setResults(response.data.response);
    } catch (error) {
      setResults("Error fetching dinosaur information.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dinosaur Encyclopedia
      </h1>

      <div className="w-full max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a dinosaur..."
          className="border border-gray-400 p-3 w-full rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4 w-full"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}

      {results && (
        <div className="mt-6 bg-white shadow-lg p-6 rounded-lg max-w-lg w-full">
          <h2 className="text-xl font-semibold text-gray-700">
            Search Results:
          </h2>
          <p className="text-gray-600 mt-2">{results}</p>
        </div>
      )}
    </div>
  );
};

export default DinosaurSearch;
