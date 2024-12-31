import React from 'react';
import { FaPlus } from 'react-icons/fa';

const ProductCard = ({ product, addToCart }) => {
  const imagePath = `https://bestandsliste.onrender.com${product.image}`;

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <img
        src={imagePath}
        alt={product.title}
        className="w-full h-56 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-semibold mb-2">
          {product.title}
        </h3>
        <span
          className={`text-m sm:text-sm font-medium ${
            product.availability ? 'text-green-600' : 'text-red-600'
          } mb-4`}
        >
          {product.availability ? 'Auf Lager' : 'Ausverkauft'}
        </span>
        <button
          onClick={() => addToCart(product)}
          disabled={!product.availability}
          className={`mt-auto w-full py-3 flex items-center justify-center space-x-2 transition-all duration-300 ${
            product.availability
              ? 'bg-gray-800 text-white hover:bg-gray-900'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {product.availability ? (
            <>
              <FaPlus />
              <span>In den Warenkorb</span>
            </>
          ) : (
            <span>Bald verfügbar</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
