import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Global from './styles/Global';
import Banner from './components/banner';
import Home from './pages/Home';
import Rodape from './components/rodape';
import Login from './pages/Login';
import Register from './pages/Register';

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
  return (
    <BrowserRouter>
      <Global />
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*"        element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
