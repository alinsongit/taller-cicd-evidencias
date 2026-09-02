import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AddComida from './paginas/AddComida/AddComida';
import ListaComida from './paginas/ListaComida/ListaComida';
import Ordenes from './paginas/Ordenes/Ordenes';
import Calificaciones from './paginas/calificaciones/Calificaciones';
import Login from './paginas/Login/Login';
import Sidebar from './componentes/Sidebar/Sidebar';
import Menubar from './componentes/Menubar/Menubar';
import { isAuthenticated } from './servicios/auth';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Ruta de Login (pública) */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas del Admin Panel */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="d-flex" id="wrapper">
                <Sidebar sidebarVisible={sidebarVisible} />

                <div id="page-content-wrapper">
                  <Menubar toggleSidebar={toggleSidebar} />

                  <div className="container-fluid">
                    <Routes>
                      <Route path="/agregar" element={<AddComida />} />
                      <Route path="/lista" element={<ListaComida />} />
                      <Route path="/ordenes" element={<Ordenes />} />
                      <Route path="/" element={<ListaComida />} />
                      <Route path="/calificaciones" element={<Calificaciones />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;