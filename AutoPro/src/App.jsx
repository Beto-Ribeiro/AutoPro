import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { CartProvider } from './context/CartContext';
import Header from './components/header';
import Rodape from './components/rodape';
import Global from './styles/Global';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Address from './pages/Address';
import CheckoutReview from './pages/CheckoutReview';
import CheckoutDelivery from './pages/CheckoutDelivery';
import CheckoutPayment from './pages/CheckoutPayment';

/* ─── Layouts ─────────────────────────────────────────────────── */

const MainLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    {children}
    <Rodape />
  </div>
);

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          color: 'var(--secondary)',
        }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Global />
      {/* CartProvider wraps everything so any component can useCart() */}
      <CartProvider>
        <Routes>
          {/* ── Rotas públicas ── */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <MainLayout>
                <Cart />
              </MainLayout>
            }
          />
          <Route
            path="/login"
            element={session ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={session ? <Navigate to="/" /> : <Register />}
          />

          {/* ── Rotas protegidas ── */}
          <Route
            path="/profile"
            element={
              session ? (
                <MainLayout>
                  <Profile />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/address"
            element={
              session ? (
                <MainLayout>
                  <Address />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/checkout/review"
            element={session ? <CheckoutReview /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkout/delivery"
            element={session ? <CheckoutDelivery /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkout/payment"
            element={session ? <CheckoutPayment /> : <Navigate to="/login" />}
          />
          <Route 
            path="/admin/*"  
            element={session ? <Admin /> : <Navigate to="/login" />} 
          />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
