import { useState } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_DINOSAURS = gql`
  query GetDinosaurs($sortBy: String) {
    dinosaurs(sortBy: $sortBy) {
      id
      age
      species
      size
      price
      imageUrl
      description
    }
  }
`;

function Dinosaurs() {
  const [sortType, setSortType] = useState("age");
  const { data, loading, error } = useQuery(GET_DINOSAURS, {
    variables: { sortBy: sortType },
  });

  return (
    <div className="flex flex-col items-center justify-start font-sans text-center">
      <div className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-2xl p-10 border border-gray-700 mt-8">
        <h1 className="text-4xl font-bold text-white mb-6">Browse Dinosaurs</h1>

        <div className="mb-6">
          <label
            htmlFor="sort"
            className="text-lg font-semibold text-white mr-2"
          >
            Sort by:
          </label>
          <select
            id="sort"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent test-black"
          >
            <option value="age">Age</option>
            <option value="species">Species</option>
            <option value="size">Size</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-300">
            Currently sorting by:{" "}
            <span className="font-medium text-white">{sortType}</span>
          </p>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading dinosaurs...</p>
        ) : error ? (
          <p className="text-red-500">Error loading dinosaurs.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.dinosaurs.map((dino: any) => (
              <div
                key={dino.id}
                className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform"
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
    </div>
  );
}

export default Dinosaurs;
