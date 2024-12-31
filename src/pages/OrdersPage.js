import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]); // Bestellungen
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login-Status
  const [customerName, setCustomerName] = useState(''); // Kundenname
  const [customerPrice, setCustomerPrice] = useState(0); // Kundenpreis
  const navigate = useNavigate();

  // Kundendaten aus SessionStorage abrufen
  useEffect(() => {
    const name = sessionStorage.getItem('customerName');
    const price = sessionStorage.getItem('customerPrice');
    if (name) {
      setCustomerName(name);
      setIsLoggedIn(true);
    }
    if (price) {
      setCustomerPrice(parseFloat(price));
    }
  }, []);

  // Bestellungen vom Backend abrufen
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          'https://bestandsliste.onrender.com/api/orders'
        );
        if (!response.ok) {
          throw new Error('Fehler beim Abrufen der Bestellungen');
        }
        const data = await response.json();
        setOrders(data); // Setzt die Bestellungen
      } catch (error) {
        console.error('Fehler beim Abrufen der Bestellungen:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 text-center">
        Deine Bestellungen
      </h2>

      {/* Begrüßung und Logout */}
      {isLoggedIn && (
        <div className="flex justify-between items-center bg-gray-100 p-4 mb-6 rounded shadow">
          <span className="text-lg font-semibold">Hallo, {customerName}!</span>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => {
              sessionStorage.clear();
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
        Hier findest du eine Übersicht deiner Bestellungen.
      </p>

      {/* Wenn keine Bestellungen */}
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Es sind noch keine Bestellungen vorhanden.
        </p>
      ) : (
        <>
          {/* Bestellungen anzeigen */}
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-300 rounded shadow p-6"
              >
                <h3 className="text-xl font-semibold mb-4">
                  Bestellung #{order._id}
                </h3>
                <div className="space-y-4">
                  {order.products.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between"
                    >
                      {/* Produktbild */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={`https://bestandsliste.onrender.com/${item.product.image}`}
                          alt={item.product.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Titel und Menge */}
                      <div className="flex-1 px-4">
                        <h4 className="text-lg font-semibold">
                          {item.product.title}
                        </h4>
                        <p className="text-gray-600">Menge: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gesamtpreis */}
                {isLoggedIn && (
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <p>
                      <strong>Gesamtmenge:</strong>{' '}
                      {order.products.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}{' '}
                      Stück
                    </p>
                    <p>
                      <strong>Preis pro Stück:</strong>{' '}
                      {customerPrice.toFixed(2)} €
                    </p>
                    <p className="font-bold">
                      <strong>Gesamtpreis:</strong>{' '}
                      {(
                        customerPrice *
                        order.products.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )
                      ).toFixed(2)}{' '}
                      €
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
