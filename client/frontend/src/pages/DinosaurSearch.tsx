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
      const graphqlQuery = {
        query: `
          query SearchDinosaur($query: String!) {
            searchDinosaur(query: $query)
          }
        `,
        variables: { query },
      };

      const response = await axios.post(
        "http://localhost:5000/graphql",
        graphqlQuery,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("GraphQL Response:", response.data);
      if (response.data.errors) {
        console.error("GraphQL Errors:", response.data.errors);
        setResults("Error fetching dinosaur information.");
      } else {
        setResults(response.data.data.searchDinosaur);
      }
    } catch (error) {
      console.error("GraphQL error:", error);
      setResults("Error fetching dinosaur information.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-start font-sans text-center min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Dinosaur Encyclopedia
      </h1>

      <div className="w-full max-w-lg bg-gray-800 p-10 border border-gray-700 rounded-2xl shadow-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a dinosaur..."
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-4 w-full shadow-md transition-all"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-300">Loading...</p>}

      {results && (
        <div className="mt-6 w-full max-w-lg bg-gray-800 p-10 border border-gray-700 rounded-2xl shadow-2xl">
          <h2 className="text-xl font-semibold text-white">Search Results:</h2>
          <p className="text-gray-300 mt-2">{results}</p>
        </div>
      )}
    </div>
  );
};

export default DinosaurSearch;
