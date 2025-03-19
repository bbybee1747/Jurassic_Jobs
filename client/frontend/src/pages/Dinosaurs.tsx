import { useState } from "react";

function Dinosaurs() {
  const [sortType, setSortType] = useState("age");

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
            className="p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            onChange={(e) => setSortType(e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <p className="text-lg text-gray-300 text-center col-span-full">
            Dinosaur data will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dinosaurs;
