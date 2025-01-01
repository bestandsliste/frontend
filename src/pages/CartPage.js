import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState(
    cart.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Überprüfung ob Nutzer eingeloggt ist
  const [customerName, setCustomerName] = useState(''); // Kundenname aus SessionStorage
  const [customerPrice, setCustomerPrice] = useState(0); // Kundenpreis aus SessionStorage
  const [totalPrice, setTotalPrice] = useState(0); // Gesamtpreis für eingeloggten Kunden

  // Kundendaten aus SessionStorage abrufen
  useEffect(() => {
    const name = sessionStorage.getItem('customerName'); // Kundenname
    const price = sessionStorage.getItem('customerPrice'); // Kundenpreis
    if (name) {
      setCustomerName(name); // Setzt den Kundenname
      setIsLoggedIn(true); // Setzt den Login-Status
    }
    if (price) {
      setCustomerPrice(parseFloat(price)); // Konvertiert Preis zu einer Zahl
    }
  }, []);

  // Gesamtpreis berechnen
  useEffect(() => {
    if (isLoggedIn) {
      let total = 0;
      if (!customerPrice || isNaN(customerPrice)) {
        console.error('Ungültiger Kundenpreis:', customerPrice);
      } else {
        cart.forEach((item) => {
          total += customerPrice * item.quantity; // Gesamtpreis berechnen
        });
      }
      setTotalPrice(total);
    }
  }, [cart, isLoggedIn, customerPrice]);

  // Menge aktualisieren
  const handleQuantityChange = (id, newQuantity) => {
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
    addToCart({ id, quantity: parseInt(newQuantity, 10) || 1 }); // Menge aktualisieren
  };

  // Produkt entfernen
  const removeProduct = (id) => {
    removeFromCart(id);
  };

  // Bestellung generieren
  const generateOrder = async () => {
    if (cart.length === 0) {
      alert('Der Warenkorb ist leer. Es kann keine Bestellung erstellt werden.');
      return;
    }
  
    try {
      // Bestellung erstellen
      const response = await fetch(
        'https://bestandsliste.onrender.com/api/orders',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products: cart.map((item) => ({
              product: item.id, // ID direkt aus dem Warenkorb (soll ein String sein)
              quantity: item.quantity,
            })),
            customerId: sessionStorage.getItem('customerId') || null,
            customerName: sessionStorage.getItem('customerName') || 'Gast',
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Fehlerdaten:', errorData);
        throw new Error(errorData.message || 'Serverfehler');
      }
  
      const data = await response.json();
      console.log('Bestellung erfolgreich:', data);
  
      // Weiterleitung zur OrderPage
      navigate(`/order/${data.uniqueLink.split('/').pop()}`);
    } catch (error) {
      console.error('Fehler beim Generieren der Bestellung:', error);
      alert(`Fehler: ${error.message}`);
    }
  };  

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 text-center">Dein Warenkorb</h2>

      {/* Begrüßung und Logout */}
      {isLoggedIn && (
        <div className="flex justify-between items-center bg-gray-100 p-4 mb-6 rounded shadow">
          <span className="text-lg font-semibold">Hallo, {customerName}!</span>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => {
              sessionStorage.clear(); // SessionStorage löschen
              setIsLoggedIn(false);
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Zurück zur Startseite */}
      <button
        className="mb-6 text-blue-600 underline"
        onClick={() => navigate('/')}
      >
        &larr; Zurück zur Bestandsliste
      </button>

      {/* Infotext */}
      <p className="text-gray-600 mb-8">
        Überprüfe deine Liste, passe Mengen an oder entferne Produkte.
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
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                {/* Produktbild */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={`https://bestandsliste.onrender.com/${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover rounded"
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
                  className="text-xs text-red-600 hover:text-red-800 px-4 py-2 border border-red-600 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          {/* Gesamtpreis-Box */}
          {isLoggedIn && (
            <div className="p-6 bg-gray-100 rounded shadow mb-6">
              <h3 className="text-xl font-bold mb-4">Dein Gesamtpreis</h3>
              <p className="mb-2">
                <strong>Summe:</strong>{' '}
                {cart.reduce((sum, item) => sum + item.quantity, 0)} Stück
              </p>
              <p className="mb-2">
                <strong>Preis pro Stück:</strong> {customerPrice.toFixed(2)} €
              </p>
              <p className="mb-2 text-lg font-semibold">
                <strong>Gesamt:</strong> {totalPrice.toFixed(2)} €
              </p>
              <small className="text-gray-500">
                * Versandkosten werden separat berechnet.
              </small>
            </div>
          )}

          {/* Aktionen */}
          <div className="flex justify-between items-center">
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
