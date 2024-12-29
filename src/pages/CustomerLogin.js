import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerLogin = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://bestandsliste.onrender.com/api/customers/login',
        { name, password }
      );

      // Daten aus der Antwort holen
      const { id, name: customerName, customerPrice, token } = response.data;

      // Daten im sessionStorage speichern
      sessionStorage.setItem(
        'customer',
        JSON.stringify({ id, customerName, customerPrice, token })
      );

      // Weiterleitung zur Startseite oder CartPage
      navigate('/');
    } catch (error) {
      console.error('Login-Fehler:', error);
      setError(
        error.response?.data?.message ||
          'Fehler beim Login. Bitte versuchen Sie es erneut.'
      );
    }
  };

  return (
    <div className="container mx-auto max-w-md py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Kunden-Login</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Passwort
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default CustomerLogin;
