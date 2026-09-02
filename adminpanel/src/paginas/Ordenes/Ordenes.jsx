import React, { useEffect, useState } from "react";
import { fetchAllOrdersPaginated, updateOrderStatus } from "../../servicios/orderService";
import { toast } from "react-toastify";

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(0); // Spring usa base 0
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const itemsPorPagina = 50;

  const fetchOrders = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Llamar al nuevo endpoint paginado
      const response = await fetchAllOrdersPaginated(page, itemsPorPagina);
      console.log("Orders received:", response);
      
      // response será un objeto Page de Spring con esta estructura:
      // { content: [], totalPages: 10, totalElements: 500, number: 0, size: 50 }
      
      setData(response.content || []);
      setTotalPaginas(response.totalPages || 0);
      setTotalElementos(response.totalElements || 0);
      setPaginaActual(response.number || 0);
      
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
      setError("No es posible cargar los pedidos");
      toast.error("No es posible mostrar los pedidos. Intente de nuevo.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (event, orderId) => {
    try {
      const success = await updateOrderStatus(orderId, event.target.value);
      if (success) {
        toast.success("Estado de la orden actualizado exitosamente");
        // Recargar la página actual sin perder la posición
        await fetchOrders(paginaActual);
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast.error("Error al actualizar el estado:");
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    fetchOrders(nuevaPagina);
  };

  useEffect(() => {
    fetchOrders(0); // Cargar primera página al iniciar
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando ordenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => fetchOrders(0)}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Panel de pedidos</h2>
            <div className="text-muted">
              <small>Total: {totalElementos} pedidos</small>
            </div>
          </div>

          {data.length === 0 ? (
            <div className="card p-4 text-center">
              <p className="mb-0">No hay pedidos encontrados</p>
            </div>
          ) : (
            <>
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th></th>
                        <th>Detalles de las ordenes</th>
                        <th>Valor</th>
                        <th>Items</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((order, index) => {
                        const amount = order.amount || order.cuenta || order.total || 0;
                        const items = order.orderedItems || order.items || order.orderItems || [];
                        const address = order.userAddress || order.address || order.direccion || "No hay direccion";
                        const status = order.orderStatus || order.status || order.estado || "En preparacion";

                        return (
                          <tr key={order.id || index}>
                            <td style={{width: '60px'}}>
                              <div 
                                style={{
                                  width: '48px', 
                                  height: '48px', 
                                  backgroundColor: '#e9ecef', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  borderRadius: '8px',
                                  fontSize: '24px'
                                }}
                              >
                                📦
                              </div>
                            </td>
                            <td>
                              <div className="mb-1">
                                <strong>Pedido #{order.id}</strong>
                              </div>
                              <div className="mb-2">
                                {items.length > 0 ? (
                                  items.map((item, idx) => {
                                    const itemName = item.name || item.nombrePlato || item.nombre || "Unknown item";
                                    const itemQty = item.quantity || item.cantidad || 1;
                                    
                                    if (idx === items.length - 1) {
                                      return itemName + " x " + itemQty;
                                    } else {
                                      return itemName + " x " + itemQty + ", ";
                                    }
                                  })
                                ) : (
                                  <span className="text-muted">No items</span>
                                )}
                              </div>
                              <div className="text-muted small">
                                📍 {address}
                              </div>
                            </td>
                            <td>
                              <strong>${Number(amount).toFixed(0)}</strong>
                            </td>
                            <td>
                              <span className="badge bg-secondary">
                                {items.length} {items.length === 1 ? 'item' : 'items'}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                onChange={(event) => updateStatus(event, order.id)}
                                value={status}
                              >
                                <option value="Recibido">Recibido</option>
                                <option value="En preparacion">En preparacion</option>
                                <option value="Salio a entrega">Salio a entrega</option>
                                <option value="Entregado">Entregado</option>
                                <option value="Cancelado">Cancelado</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="card mt-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-muted">
                        <small>
                          Mostrando {paginaActual * itemsPorPagina + 1} - {Math.min((paginaActual + 1) * itemsPorPagina, totalElementos)} de {totalElementos}
                        </small>
                      </div>
                      
                      <nav>
                        <ul className="pagination mb-0">
                          {/* Botón Primera Página */}
                          <li className={`page-item ${paginaActual === 0 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => cambiarPagina(0)}
                              disabled={paginaActual === 0}
                            >
                              ««
                            </button>
                          </li>

                          {/* Botón Anterior */}
                          <li className={`page-item ${paginaActual === 0 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => cambiarPagina(paginaActual - 1)}
                              disabled={paginaActual === 0}
                            >
                              Anterior
                            </button>
                          </li>

                          {/* Números de página (mostrar máximo 5) */}
                          {(() => {
                            const pagesToShow = [];
                            let startPage = Math.max(0, paginaActual - 2);
                            let endPage = Math.min(totalPaginas - 1, paginaActual + 2);
                            
                            // Ajustar si estamos al inicio o al final
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

                          {/* Botón Siguiente */}
                          <li className={`page-item ${paginaActual === totalPaginas - 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => cambiarPagina(paginaActual + 1)}
                              disabled={paginaActual === totalPaginas - 1}
                            >
                              Siguiente
                            </button>
                          </li>

                          {/* Botón Última Página */}
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
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;  