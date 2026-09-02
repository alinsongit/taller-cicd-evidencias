import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Calificaciones.css';

const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  
  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const itemsPorPagina = 50;

  useEffect(() => {
    cargarCalificaciones(0, 'todas');
    cargarEstadisticas();
  }, []);

  const cargarCalificaciones = async (page = 0, filtroEstrellas = filtro) => {
    try {
      setLoading(true);
      
      // Construir URL con paginación
      let url = `http://localhost:8080/api/calificaciones/paginated?page=${page}&size=${itemsPorPagina}`;
      
      // Si hay filtro de estrellas, agregarlo (opcional por ahora)
      // if (filtroEstrellas !== 'todas') {
      //   url += `&puntuacion=${filtroEstrellas}`;
      // }
      
      const response = await axios.get(url);
      
      // Aplicar filtro en el frontend por ahora
      let datos = response.data.content || [];
      if (filtroEstrellas !== 'todas') {
        datos = datos.filter(c => c.puntuacion === parseInt(filtroEstrellas));
      }
      
      setCalificaciones(datos);
      setTotalPaginas(response.data.totalPages || 0);
      setTotalElementos(response.data.totalElements || 0);
      setPaginaActual(response.data.number || 0);
      
    } catch (error) {
      toast.error('Error al cargar calificaciones');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/calificaciones/estadisticas');
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const eliminarCalificacion = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta calificación?')) {
      try {
        await axios.delete(`http://localhost:8080/api/calificaciones/${id}`);
        toast.success('Calificación eliminada');
        cargarCalificaciones(paginaActual, filtro);
        cargarEstadisticas();
      } catch (error) {
        toast.error('Error al eliminar');
        console.error('Error:', error);
      }
    }
  };

  const cambiarFiltro = (nuevoFiltro) => {
    setFiltro(nuevoFiltro);
    setPaginaActual(0);
    cargarCalificaciones(0, nuevoFiltro);
  };

  const cambiarPagina = (nuevaPagina) => {
    cargarCalificaciones(nuevaPagina, filtro);
  };

  const renderEstrellas = (puntuacion) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bi bi-star${index < puntuacion ? '-fill' : ''}`}
        style={{ color: index < puntuacion ? '#ffc107' : '#ddd' }}
      ></i>
    ));
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !calificaciones.length) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="calificaciones-container">
      <div className="calificaciones-header">
        <h2>
          <i className="bi bi-star-fill text-warning me-2"></i>
          Calificaciones de Clientes
        </h2>
        {totalElementos > 0 && (
          <div className="text-muted">
            <small>Total: {totalElementos} calificaciones</small>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="estadisticas-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <i className="bi bi-clipboard-data"></i>
            </div>
            <div className="stat-content">
              <h3>{estadisticas.total}</h3>
              <p>Total Calificaciones</p>
            </div>
          </div>

          <div className="stat-card promedio">
            <div className="stat-icon">
              <i className="bi bi-star-fill"></i>
            </div>
            <div className="stat-content">
              <h3>{estadisticas.promedio.toFixed(1)}</h3>
              <p>Promedio General</p>
              <div className="stars-small">
                {renderEstrellas(Math.round(estadisticas.promedio))}
              </div>
            </div>
          </div>

          <div className="stat-card distribucion">
            <div className="stat-icon">
              <i className="bi bi-bar-chart-fill"></i>
            </div>
            <div className="stat-content">
              <p>Distribución</p>
              <div className="distribucion-bars">
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="bar-item">
                    <span>{star}★</span>
                    <div className="bar-bg">
                      <div 
                        className="bar-fill" 
                        style={{ 
                          width: `${(estadisticas.porPuntuacion[star] / estadisticas.total) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span>{estadisticas.porPuntuacion[star]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="filtros-container">
        <button 
          className={`btn-filtro ${filtro === 'todas' ? 'active' : ''}`}
          onClick={() => cambiarFiltro('todas')}
        >
          Todas
        </button>
        {[5, 4, 3, 2, 1].map(star => (
          <button 
            key={star}
            className={`btn-filtro ${filtro === star.toString() ? 'active' : ''}`}
            onClick={() => cambiarFiltro(star.toString())}
          >
            {star} ★
          </button>
        ))}
      </div>

      {/* Lista de Calificaciones */}
      <div className="calificaciones-list">
        {calificaciones.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <p>No hay calificaciones {filtro !== 'todas' ? `de ${filtro} estrellas` : ''}</p>
          </div>
        ) : (
          calificaciones.map((cal) => (
            <div key={cal.id} className="calificacion-card">
              <div className="cal-header">
                <div className="cal-user-info">
                  <div className="user-avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div>
                    <h4>{cal.nombre} {cal.apellido}</h4>
                    <p className="cal-fecha">
                      <i className="bi bi-clock"></i> {formatearFecha(cal.fechaCreacion)}
                    </p>
                  </div>
                </div>
                <div className="cal-rating">
                  {renderEstrellas(cal.puntuacion)}
                  <span className="rating-number">{cal.puntuacion}/5</span>
                </div>
              </div>

              <div className="cal-body">
                <p className="cal-experiencia">{cal.experiencia}</p>
              </div>

              <div className="cal-footer">
                <div className="cal-contact">
                  <span>
                    <i className="bi bi-telephone"></i> {cal.telefono}
                  </span>
                </div>
                <button 
                  className="btn-eliminar"
                  onClick={() => eliminarCalificacion(cal.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="paginacion-container">
          <div className="paginacion-info">
            <small>
              Mostrando {paginaActual * itemsPorPagina + 1} - {Math.min((paginaActual + 1) * itemsPorPagina, totalElementos)} de {totalElementos}
            </small>
          </div>
          
          <nav>
            <ul className="pagination mb-0">
              {/* Primera página */}
              <li className={`page-item ${paginaActual === 0 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => cambiarPagina(0)}
                  disabled={paginaActual === 0}
                >
                  ««
                </button>
              </li>

              {/* Anterior */}
              <li className={`page-item ${paginaActual === 0 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 0}
                >
                  Anterior
                </button>
              </li>

              {/* Números de página */}
              {(() => {
                const pagesToShow = [];
                let startPage = Math.max(0, paginaActual - 2);
                let endPage = Math.min(totalPaginas - 1, paginaActual + 2);
                
                if (paginaActual <= 2) {
                  endPage = Math.min(4, totalPaginas - 1);
                }
                if (paginaActual >= totalPaginas - 3) {
                  startPage = Math.max(0, totalPaginas - 5);
                }

                for (let i = startPage; i <= endPage; i++) {
                  pagesToShow.push(
                    <li 
                      key={i} 
                      className={`page-item ${paginaActual === i ? 'active' : ''}`}
                    >
                      <button 
                        className="page-link" 
                        onClick={() => cambiarPagina(i)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  );
                }
                return pagesToShow;
              })()}

              {/* Siguiente */}
              <li className={`page-item ${paginaActual === totalPaginas - 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas - 1}
                >
                  Siguiente
                </button>
              </li>

              {/* Última página */}
              <li className={`page-item ${paginaActual === totalPaginas - 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => cambiarPagina(totalPaginas - 1)}
                  disabled={paginaActual === totalPaginas - 1}
                >
                  »»
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Calificaciones;