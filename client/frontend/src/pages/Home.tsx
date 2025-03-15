import dinoVest from "../assets/DinoVest.webp";
import Pterodactyle from "../assets/Pterodactyl.webp";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-10 font-sans text-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Jurassic Jobs
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your premier platform for connecting with exceptional prehistoric
          opportunities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dinosaur 1 */}
          <div className="bg-gray-50 p-6 border border-gray-300 rounded-lg shadow-md text-center">
            <img
              src={dinoVest}
              alt="Tyrannosaurus Rex"
              className="w-48 h-48 mx-auto rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Tyrannosaurus Rex
            </h2>
            <p className="text-gray-600">
              A formidable predator known for its impressive stature and power.
            </p>
          </div>

          {/* Dinosaur 2 */}
          <div className="bg-gray-50 p-6 border border-gray-300 rounded-lg shadow-md text-center">
            <img
              src={Pterodactyle}
              alt="Pterodactyl"
              className="w-48 h-48 mx-auto rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">Pterodactyl</h2>
            <p className="text-gray-600">
              A renowned flying reptile that once dominated the skies.
            </p>
          </div>

          {/* Dinosaur 3 */}
          <div className="bg-gray-50 p-6 border border-gray-300 rounded-lg shadow-md text-center">
            <img
              src={dinoVest}
              alt="Triceratops"
              className="w-48 h-48 mx-auto rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">Triceratops</h2>
            <p className="text-gray-600">
              A distinctive herbivore recognized by its iconic trio of horns.
            </p>
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
