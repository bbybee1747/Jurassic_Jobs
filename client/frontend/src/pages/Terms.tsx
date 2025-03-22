const TermsOfService = () => {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-white">
        <h1 className="text-3xl font-bold mb-4 text-center text-yellow-300">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-200 mb-8 text-center">
          <strong>Last Updated:</strong> March 20, 2025
        </p>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-yellow-200">
            1. Eligibility
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Be at least 18 years old;</li>
            <li>Have the legal authority to enter into contracts;</li>
            <li>Not attempt to weaponize, clone, or genetically modify any dinosaur.</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-yellow-200">
            2. Services Provided
          </h2>
          <p className="mb-2">Jurassic Jobs offers dinosaur-powered solutions for tasks like:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Security</strong> – perimeter defense, asset protection</li>
            <li><strong>Transportation</strong> – hauling, off-road delivery</li>
            <li><strong>Events</strong> – parades, openings, public appearances</li>
          </ul>
          <p className="mt-2 text-sm italic text-slate-300">
            Note: All dinosaurs are controlled by certified handlers.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-yellow-200">
            3. Client Responsibilities
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide a safe working environment;</li>
            <li>Not provoke, ride, or feed dinosaurs without permission;</li>
            <li>Be liable for damages caused by negligence.</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-yellow-200">
            4. Risk Acknowledgment
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Dinosaurs may behave unpredictably;</li>
            <li>You assume all risks of dinosaur interaction;</li>
            <li>Jurassic Jobs is not liable for damages beyond handler control.</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-yellow-200">
            5. Payment & Cancellations
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Full payment required before deployment.</li>
            <li>Less than 48-hour cancellations may not be refunded.</li>
            <li>We may cancel due to incidents or force majeure (e.g., meteor strikes).</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-yellow-200">
            6. Prohibited Uses
          </h2>
          <p className="mb-2">You may not use our dinosaurs for:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Military or illegal activities;</li>
            <li>Unauthorized surveillance;</li>
            <li>Jurassic Park-style cloning ventures;</li>
            <li>Violations of any laws.</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-yellow-200">
            7. Limitation of Liability
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Time travel incidents;</li>
            <li>Emotional trauma from staring contests with raptors;</li>
            <li>Mating season complications.</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-yellow-200">
            8. Termination
          </h2>
          <p className="mb-2">We reserve the right to deny or terminate service if:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Client safety is at risk;</li>
            <li>Misuse of services occurs;</li>
            <li>Too many dinosaur selfies delay operations.</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-yellow-200">
            9. Changes to These Terms
          </h2>
          <p>
            We may update these Terms at any time. Continued use after changes implies acceptance.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-yellow-200">
            10. Contact
          </h2>
          <p>
            Have a question or want to report a rogue Triceratops?
          </p>
          <p className="mt-1">
            <strong>Email:</strong>{" "}
            <a href="mailto:prehistoricsupport@jurassicjobs.com" className="text-blue-300 hover:underline">
              prehistoricsupport@jurassicjobs.com
            </a>
          </p>
          <p>
            <strong>Phone:</strong> 1-800-DINO-WORK
          </p>
        </section>
      </div>
    );
  };
  
  export default TermsOfService;
  