import React, { useContext } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Header = () => {
  const { cart } = useContext(CartContext); // cart aus Context holen
  const navigate = useNavigate();

  // Sicherstellen, dass cart ein Array ist, bevor reduce() aufgerufen wird
  const cartCount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <header className="bg-gray-800 text-white py-5 shadow-lg fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto max-w-6xl flex justify-between items-center px-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
          Bestandsliste
        </h1>
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => navigate("/cart")} // Klick führt zur Warenkorb-Seite
        >
          <FaShoppingCart size={20} />
          <span className="text-sm sm:text-lg font-semibold">({cartCount})</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
