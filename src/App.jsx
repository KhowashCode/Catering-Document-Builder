import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Invoice from './pages/Invoice';
import Bast from './pages/Bast';
import Pesanan from './pages/Pesanan';
import Kwitansi from './pages/Kwitansi';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Invoice />} />
          <Route path="bast" element={<Bast />} />
          <Route path="pesanan" element={<Pesanan />} />
          <Route path="kwitansi" element={<Kwitansi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
