import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrdersPage = () => {
  const { link } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `https://bestandsliste.onrender.com/api/orders/${link}`
        );
        if (!response.ok) {
          throw new Error('Bestellung nicht gefunden.');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Bestellung:', error);
      }
    };

    fetchOrder();
  }, [link]);

  if (!order) {
    return <p>Bestellung wird geladen...</p>;
  }

  return (
    <div className="container mx-auto">
      <h1>Bestellung</h1>
      <ul>
        {order.products.map((item) => (
          <li key={item.product._id}>
            {item.product.title} - {item.quantity} Stück
          </li>
        ))}
      </ul>
      <p>Gesamtpreis: {order.totalPrice} €</p>
      {order.customerName && <p>Kunde: {order.customerName}</p>}
    </div>
  );
};

export default OrdersPage;
