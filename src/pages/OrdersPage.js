import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderPage = () => {
  const { link } = useParams(); // Link aus der URL
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://bestandsliste.onrender.com/api/orders/${link}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Serverfehler');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Bestellung:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [link]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Fehler: {error}</p>;
  }

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Bestellung</h2>
      {order && (
        <>
          <h3 className="text-lg font-semibold mb-4">
            Kunde: {order.customerName || 'Gast'}
          </h3>
          <div className="space-y-4">
            {order.products.map((item) => (
              <div key={item.product._id} className="flex items-center justify-between border-b pb-4">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={`https://bestandsliste.onrender.com/${item.product.image}`}
                    alt={item.product.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 px-4">
                  <h3 className="text-lg font-semibold">{item.product.title}</h3>
                  <p className="mt-2">Menge: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          {order.customerId && (
            <div className="p-6 bg-gray-100 rounded shadow mt-6">
              <h3 className="text-xl font-bold mb-4">Preisdetails</h3>
              <p>
                <strong>Gesamtpreis:</strong> {order.totalPrice.toFixed(2)} €
              </p>
              <small className="text-gray-500">* Versandkosten separat.</small>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderPage;
