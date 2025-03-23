import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/Payment";
import ReactModal from "react-modal";

// GraphQL query to fetch dinosaurs
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

// Load your Stripe publishable key (test mode)
const stripePromise = loadStripe("YOUR_STRIPE_PUBLISHABLE_KEY");

// Set the root element for accessibility (adjust "#root" as needed)
ReactModal.setAppElement("#root");

function Dinosaurs() {
  const [sortType, setSortType] = useState("age");
  const [selectedDino, setSelectedDino] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_DINOSAURS, {
    variables: { sortBy: sortType },
  });

  // Opens the modal and sets the selected dinosaur
  const openModal = (dino: any) => {
    setSelectedDino(dino);
    setIsModalOpen(true);
  };

  // Closes the modal and resets the selected dinosaur
  const closeModal = () => {
    setSelectedDino(null);
    setIsModalOpen(false);
  };

  // Callback after a successful payment
  const handlePaymentSuccess = () => {
    alert(`You purchased ${selectedDino.species}!`);
    closeModal();
  };

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
            className="p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
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
                <button
                  onClick={() => openModal(dino)}
                  className="mt-4 px-4 py-2 bg-yellow-500 text-gray-800 rounded hover:bg-yellow-600 transition-colors"
                >
                  Purchase
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for payment processing */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 max-w-md mx-auto mt-20 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        <div className="flex justify-end">
          <button onClick={closeModal} className="text-xl font-bold">
            &times;
          </button>
        </div>
        {selectedDino && (
          <Elements stripe={stripePromise}>
            <PaymentForm
              dinosaur={selectedDino}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}
      </ReactModal>
    </div>
  );
}

export default Dinosaurs;
