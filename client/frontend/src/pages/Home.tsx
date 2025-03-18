import Pterodactyle from "../assets/Pterodactyl.webp";
import tRex from "../assets/t-rex.jpg";

const HeroBanner = () => {
  return (
    <section className="relative w-full">
      <img
        src={Pterodactyle}
        alt="Jurassic Scene 2"
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-4xl md:text-5xl text-white font-bold drop-shadow-lg">
          Welcome to Jurassic Jobs
        </h2>
      </div>
    </section>
  );
};

function Home() {
  return (
    <div className="flex flex-col items-center justify-start font-sans text-center">
      <HeroBanner />
      <div className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-2xl p-10 border border-gray-700 mt-8">
        <p className="text-lg text-gray-300 mb-6">
          Your premier platform for connecting with exceptional prehistoric
          opportunities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dinosaur Card 1 */}
          <div className="bg-gray-700 p-6 border border-gray-600 rounded-lg shadow-md text-center">
            <img
              src={tRex}
              alt="Tyrannosaurus Rex"
              className="w-48 h-48 mx-auto rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-white">
              Tyrannosaurus Rex
            </h2>
            <p className="text-gray-300">
              A formidable predator known for its impressive stature and power.
            </p>
          </div>
          {/* Dinosaur Card 2 */}
          <div className="bg-gray-700 p-6 border border-gray-600 rounded-lg shadow-md text-center">
            <img
              src={Pterodactyle}
              alt="Pterodactyl"
              className="w-48 h-48 mx-auto rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-white">Pterodactyl</h2>
            <p className="text-gray-300">
              A renowned flying reptile that once dominated the skies.
            </p>
          </div>
          {/* Dinosaur Card 3 */}
          <div className="bg-gray-700 p-6 border border-gray-600 rounded-lg shadow-md text-center">
            <img
              src={tRex}
              alt="Triceratops"
              className="w-48 h-48 mx-auto rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-white">Triceratops</h2>
            <p className="text-gray-300">
              A distinctive herbivore recognized by its iconic trio of horns.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <a href="/dinosaurs" className="text-accent hover:underline text-lg">
            View Available Dinosaurs
          </a>
          <br />
          <a href="/purchases" className="text-accent hover:underline text-lg">
            Check Your Purchases
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
