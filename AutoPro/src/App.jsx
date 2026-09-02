import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import Header from './components/header';
import Global from './styles/Global';
import Banner from './components/banner';
import Home from './pages/Home';
import Rodape from './components/rodape';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';

/* ── Main app shell (header + banner + home + footer) ── */
const MainLayout = () => (
  <div>
    <Header />
    <Banner />
    <Home />
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Global />
      <Routes>
        <Route path="/login"    element={session ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={session ? <Navigate to="/" /> : <Register />} />
        <Route path="/admin/*"  element={session ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/*"        element={session ? <MainLayout /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
