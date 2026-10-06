import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FileText, Receipt, ScrollText, CheckSquare, ChefHat, PanelLeftClose, PanelLeftOpen, Printer } from 'lucide-react';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-container">
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <ChefHat size={28} color="var(--primary)" />
            {!collapsed && <h1>CaterDoc</h1>}
          </div>
          <button 
            className="collapse-btn" 
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
        
        <nav className="nav-menu">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end title="Invoice">
            <Receipt size={20} />
            {!collapsed && <span>Invoice</span>}
          </NavLink>
          
          <NavLink to="/bast" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} title="Berita Acara (BAST)">
            <CheckSquare size={20} />
            {!collapsed && <span>Berita Acara (BAST)</span>}
          </NavLink>
          
          <NavLink to="/pesanan" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} title="Surat Pesanan">
            <ScrollText size={20} />
            {!collapsed && <span>Surat Pesanan</span>}
          </NavLink>
          
          <NavLink to="/kwitansi" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} title="Kwitansi">
            <FileText size={20} />
            {!collapsed && <span>Kwitansi</span>}
          </NavLink>

          <NavLink to="/cetak-semua" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} title="Cetak Semua">
            <Printer size={20} />
            {!collapsed && <span>Cetak Semua</span>}
          </NavLink>
        </nav>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
