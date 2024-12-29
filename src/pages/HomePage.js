import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('Alle');

  // Verwende die Umgebungsvariable für die API-URL
  const backendURL =
    process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${backendURL}/products`, {
          params: {
            search,
            availability:
              availability === 'Alle'
                ? ''
                : availability === 'Auf Lager'
                ? 1
                : 0,
          },
        });
        setProducts(data);
      } catch (error) {
        console.error(
          'Fehler beim Laden der Produkte:',
          error.response?.data?.message || error.message
        );
      }
    };

    fetchProducts();
  }, [search, availability, backendURL]);

  // Berechne die Anzahl der Produkte für Filteroptionen
  const totalCount = products.length;
  const inStockCount = products.filter((p) => p.availability === 1).length;
  const soldOutCount = products.filter((p) => p.availability === 0).length;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Unsere Produkte</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Suche nach Produkten..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-2">
          <button
            onClick={() => setAvailability('Alle')}
            className={`px-4 py-2 rounded ${
              availability === 'Alle'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            Alle ({totalCount})
          </button>
          <button
            onClick={() => setAvailability('Auf Lager')}
            className={`px-4 py-2 rounded ${
              availability === 'Auf Lager'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            Auf Lager ({inStockCount})
          </button>
          <button
            onClick={() => setAvailability('Ausverkauft')}
            className={`px-4 py-2 rounded ${
              availability === 'Ausverkauft'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            Ausverkauft ({soldOutCount})
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center">Keine Produkte gefunden.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
