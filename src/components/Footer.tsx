// Footer.tsx
import React from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-100 py-4 fixed bottom-0 left-0 w-full">
      <div className="container">
        <div className="flex justify-center items-center text-left">
          <p className="mr-4 text-sm">
            Contact us by email or via:
            <a
              href="mailto:phoenix.wan.us@gmail.com"
              className="text-blue-600 hover:underline text-sm"
            >
              {"\n"}&lt;phoenix.wan.us@gmail.com&gt;
            </a>
          </p>
          <a
            href="https://twitter.com/phoenix_sgp"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2"
          >
            <FaTwitter
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              size={30}
            />
          </a>
          <a
            href="https://www.facebook.com/PhoenixWanSGP"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2"
          >
            <FaFacebook
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              size={30}
            />
          </a>
          <a
            href="https://www.instagram.com/phoenix.wan.sgp/"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2"
          >
            <FaInstagram
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              size={30}
            />
          </a>
          <a
            href="https://www.tiktok.com/@phoenixwansgp"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2"
          >
            <FaTiktok
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              size={30}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
