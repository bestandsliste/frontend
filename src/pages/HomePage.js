import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('Alle');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products', {
          params: {
            search,
            availability,
          },
        });
        setProducts(data);
      } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
      }
    };

    fetchProducts();
  }, [search, availability]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produkte</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Suche nach Produkten..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mr-2"
        />
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Alle">Alle ({products.length})</option>
          <option value="auf lager">
            Auf Lager (
            {products.filter((p) => p.availability === 'auf lager').length})
          </option>
          <option value="ausverkauft">
            Ausverkauft (
            {products.filter((p) => p.availability === 'ausverkauft').length})
          </option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
