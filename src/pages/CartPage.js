import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearCart } =
    useContext(CartContext); // `setCart` entfernt
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState(
    cart.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );

  // Menge aktualisieren
  const handleQuantityChange = (id, newQuantity) => {
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
    addToCart({ id, quantity: parseInt(newQuantity, 10) || 1 }); // `addToCart` genutzt
  };

  // Produkt entfernen
  const removeProduct = (id) => {
    removeFromCart(id);
  };

  // Bestellung generieren
  const generateOrder = async () => {
    if (cart.length === 0) {
      alert(
        'Der Warenkorb ist leer. Es kann keine Bestellung erstellt werden.'
      );
      return;
    }

    try {
      const response = await axios.post(
        'https://bestandsliste.onrender.com/api/orders',
        {
          products: cart,
        }
      );
      const orderId = response.data.id; // Nehmen wir an, die API gibt eine Bestell-ID zurück
      navigate(`/order/${orderId}`); // Weiterleitung zur Bestellseite
    } catch (error) {
      console.error('Fehler beim Generieren der Bestellung:', error);
      alert(
        'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
      );
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4">
      {/* Zurück zur Startseite */}
      <button
        className="mb-6 text-blue-600 underline"
        onClick={() => navigate('/')}
      >
        &larr; Zurück zur Bestandsliste
      </button>

      {/* Infotext */}
      <h2 className="text-2xl font-bold mb-4">Dein Warenkorb</h2>
      <p className="text-gray-600 mb-8">
        Hier kannst du deine Liste überprüfen, die Menge bearbeiten oder auch
        Produkte aus der Liste entfernen.
      </p>

      {/* Wenn Warenkorb leer */}
      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Dein Warenkorb ist leer. Zurück zur{' '}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => navigate('/')}
          >
            Bestandsliste
          </span>
          , um Produkte hinzuzufügen.
        </p>
      ) : (
        <>
          {/* Warenkorb-Liste */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                {/* Produktbild */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Titel und Menge */}
                <div className="flex-1 px-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <div className="mt-2">
                    <label htmlFor={`quantity-${item.id}`} className="sr-only">
                      Menge
                    </label>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      value={quantities[item.id]}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                      min="1"
                    />
                  </div>
                </div>

                {/* Entfernen-Button */}
                <button
                  onClick={() => removeProduct(item.id)}
                  className="text-red-600 hover:text-red-800 px-4 py-2 border border-red-600 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          {/* Aktionen */}
          <div className="flex justify-between items-center mt-8">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={clearCart}
            >
              Liste leeren
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={generateOrder}
            >
              Bestellung generieren
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;