import { useState } from "react";

function Dinosaurs() {
  const [sortType, setSortType] = useState("age");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-10 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 border border-gray-300">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          🦖 Browse Dinosaurs
        </h1>

        <div className="mb-6 text-center">
          <label className="text-lg font-semibold mr-2">Sort by:</label>
          <select
            className="p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="age">Age</option>
            <option value="species">Species</option>
            <option value="size">Size</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div className="mb-6 text-center">
          <p className="text-lg text-gray-600">
            Currently sorting by: {sortType}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Placeholder for future dinosaur data */}
          <p className="text-lg text-gray-600 text-center col-span-full">
            Dinosaurs will be displayed here once connected to the database.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dinosaurs;
