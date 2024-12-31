import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CustomerLogin from './pages/CustomerLogin';
import OrdersPage from './pages/OrdersPage'; // <-- OrdersPage importieren

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/orders" element={<OrdersPage />} />{' '}
            {/* Route hinzugefügt */}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
