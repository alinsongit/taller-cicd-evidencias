import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../servicios/auth';
import { toast } from 'react-toastify';

const Menubar = ({toggleSidebar}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Sesión cerrada');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container-fluid">
            <button className="btn btn-primary" id="sidebarToggle" onClick={toggleSidebar}>
                <i className='bi bi-list'></i>
            </button>
            
            <div className="ms-auto">
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            </div>
        </div>
    </nav>
  )
}

export default Menubar;