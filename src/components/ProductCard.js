import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="border rounded shadow p-4 flex flex-col">
            <img src={product.image} alt={product.title} className="mb-4 h-40 object-contain" />
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className="mb-2">Verfügbarkeit: {product.availability}</p>
            <p className="mb-2">Preis: {product.price} €</p>
            <button className="mt-auto bg-blue-500 text-white p-2 rounded">In den Warenkorb</button>
        </div>
    )
};

export default ProductCard;
