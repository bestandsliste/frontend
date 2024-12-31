import React, { useEffect, useState, useContext } from 'react';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('searchQuery') || '';
  });
  const [availability, setAvailability] = useState(() => {
    return localStorage.getItem('availability') || 'Alle';
  });
  const [customerName, setCustomerName] = useState('');
  const navigate = useNavigate();

  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get('https://bestandsliste.onrender.com/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) =>
        console.error('Fehler beim Abrufen der Produkte:', error)
      );
  }, []);

  useEffect(() => {
    const name = sessionStorage.getItem('customerName');
    if (name) {
      setCustomerName(name);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setCustomerName('');
    navigate('/');
  };

  useEffect(() => {
    localStorage.setItem('searchQuery', searchQuery);
    localStorage.setItem('availability', availability);
  }, [searchQuery, availability]);

  const filterProducts = () => {
    let filtered = products;

    if (availability === 'Auf Lager') {
      filtered = products.filter((product) => product.availability);
    } else if (availability === 'Ausverkauft') {
      filtered = products.filter((product) => !product.availability);
    }

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const totalCount = products.length;
  const inStockCount = products.filter(
    (product) => product.availability
  ).length;
  const soldOutCount = products.filter(
    (product) => !product.availability
  ).length;

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-gray-800 text-white py-5 shadow-lg fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto max-w-6xl flex justify-between items-center px-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
            Bestandsliste
          </h1>
          <div className="flex items-center space-x-4">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => navigate('/cart')}
            >
              <FaShoppingCart size={20} />
              <span className="text-sm sm:text-lg font-semibold">
                ({cart.reduce((total, item) => total + item.quantity, 0)})
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Kundenbox */}
      {customerName && (
        <div className="bg-gray-100 p-4 shadow rounded flex justify-between items-center mt-16 mx-auto max-w-6xl">
          <span className="text-lg font-semibold">Hallo, {customerName}!</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}

      {/* Hero-Bereich */}
      <div className="py-20 bg-gray-800 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 mt-8">
          Willkommen in unserer exklusiven Bestandsliste
        </h2>
        <p className="text-lg sm:text-xl font-light">
          Durchsuchen Sie unsere Auswahl und finden Sie das perfekte Produkt.
        </p>
      </div>

      {/* Suche und Filter */}
      <div className="py-6 container mx-auto max-w-6xl">
        {/* Suchfeld */}
        <div className="mb-6 flex items-center space-x-3 bg-white shadow-md p-4 rounded">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Produkte durchsuchen..."
            className="flex-1 outline-none text-base sm:text-lg bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="flex justify-center space-x-8 mb-8">
          <button
            className={`px-6 py-2 rounded transition-all duration-300 ${
              availability === 'Alle'
                ? 'bg-gray-800 text-white shadow-md'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
            onClick={() => setAvailability('Alle')}
          >
            Alle ({totalCount})
          </button>
          <button
            className={`px-6 py-2 rounded transition-all duration-300 ${
              availability === 'Auf Lager'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
            onClick={() => setAvailability('Auf Lager')}
          >
            Auf Lager ({inStockCount})
          </button>
          <button
            className={`px-6 py-2 rounded transition-all duration-300 ${
              availability === 'Ausverkauft'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
            onClick={() => setAvailability('Ausverkauft')}
          >
            Ausverkauft ({soldOutCount})
          </button>
        </div>
      </div>

      {/* Produktliste */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 container mx-auto max-w-6xl">
        {filterProducts().length > 0 ? (
          filterProducts().map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          <p className="text-center text-lg text-gray-500 col-span-full">
            Keine Produkte gefunden. Versuchen Sie es mit einer anderen Suche
            oder einem anderen Filter.
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
