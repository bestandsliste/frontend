import React from 'react';
import { useCart } from '../hooks/useCart';
import { FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    // Stelle sicher, dass die Backend-URL als Umgebungsvariable gesetzt ist
    const backendURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    return (
        <div className="border rounded shadow p-4 flex flex-col hover:shadow-lg transition-shadow">
            <img src={`${backendURL}${product.image}`} alt={product.title} className="mb-4 h-40 object-contain" />
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className={`mb-2 ${product.availability === 1 ? 'text-green-500' : 'text-red-500'}`}>
                {product.availability === 1 ? 'Auf Lager' : 'Ausverkauft'}
            </p>
            <p className="mb-4 font-bold text-xl">{product.price.toFixed(2)} €</p>
            <button
                onClick={() => addToCart(product)}
                className={`mt-auto flex items-center justify-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
                    product.availability === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={product.availability === 0}
            >
                <FaShoppingCart className="mr-2" /> In den Warenkorb
            </button>
        </div>
    );
};

export default ProductCard;
