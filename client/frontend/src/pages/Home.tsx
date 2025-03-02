import dinoVest from "../assets/DinoVest.webp";
import Pterodactyle from "../assets/Pterodactyl.webp";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-10 font-sans text-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 border border-gray-300">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🦖 Welcome to Jurassic Jobs!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your premier platform for connecting with prehistoric opportunities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dinosaur 1 */}
          <div className="bg-gray-50 p-6 border border-gray-300 rounded-lg shadow-md text-center">
            <img
              src={dinoVest}
              alt="Dino with Vest"
              className="w-48 h-48 mx-auto rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Tyrannosaurus Rex
            </h2>
            <p className="text-gray-600">The king of dinosaurs!</p>
          </div>

          {/* Dinosaur 2 */}
          <div className="bg-gray-50 p-6 border border-gray-300 rounded-lg shadow-md text-center">
            <img
              src={Pterodactyle}
              alt="Pterodactyle"
              className="w-48 h-48 mx-auto rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">Pterodactyl</h2>
            <p className="text-gray-600">
              Soaring through the prehistoric skies!
            </p>
          </div>

          {/* Dinosaur 3 */}
          <div className="bg-gray-50 p-6 border border-gray-300 rounded-lg shadow-md text-center">
            <img
              src={dinoVest}
              alt="Dino with Vest"
              className="w-48 h-48 mx-auto rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">Triceratops</h2>
            <p className="text-gray-600">A gentle giant with horns.</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/dinosaurs"
            className="text-blue-600 hover:underline text-lg"
          >
            View Available Dinosaurs
          </a>
          <br />
          <a
            href="/purchases"
            className="text-blue-600 hover:underline text-lg"
          >
            Check Your Purchases
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
