import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 text-center py-4 border-t border-gray-200">
      <p className="text-sm">
        © {new Date().getFullYear()} Jurassic Jobs. All rights reserved.
      </p>
      <nav className="mt-2">
        <Link
          to="/privacy"
          className="text-gray-600 hover:text-gray-900 transition-colors mx-2 text-sm"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="text-gray-600 hover:text-gray-900 transition-colors mx-2 text-sm"
        >
          Terms of Service
        </Link>
      </nav>
    </footer>
  );
}

export default Footer;
