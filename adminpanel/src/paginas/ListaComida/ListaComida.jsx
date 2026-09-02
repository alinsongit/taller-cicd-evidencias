import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import './ListaComida.css';
import { deleteFood, getFoodList } from '../../servicios/comidaServicio';

const ListaComida = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // Lista de categorías disponibles
  const categorias = [
    'Todas',
    'Hamburguesas',
    'Salchipapas',
    'Perros',
    'Pizzas',
    'Arabe',
    'Bebidas'
  ];

  const obtenerLista = async() => {
    try {
      const data = await getFoodList();
      setList(data);
      setFilteredList(data); // Inicialmente mostrar todas
    } catch (error) {
      toast.error('Error al mostrar la lista de comidas.');
    }
  }

  const eliminarComida = async(comidaId) => {
    try {
      const exito = await deleteFood(comidaId);
      if(exito) {
        toast.success('Comida eliminada.');
        await obtenerLista();
      } else {
        toast.error('Error al eliminar la comida.');
      }
    } catch (error) {
      toast.error('Error al eliminar la comida.');
    }
  }

  // Filtrar por categoría
  const filtrarPorCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setPaginaActual(1); // Resetear a la primera página
    
    if (categoria === 'Todas') {
      setFilteredList(list);
    } else {
      const filtered = list.filter(item => 
        item.categoria.toLowerCase() === categoria.toLowerCase()
      );
      setFilteredList(filtered);
    }
  }

  // Calcular datos de paginación
  const indexUltimoItem = paginaActual * itemsPorPagina;
  const indexPrimerItem = indexUltimoItem - itemsPorPagina;
  const itemsActuales = filteredList.slice(indexPrimerItem, indexUltimoItem);
  const totalPaginas = Math.ceil(filteredList.length / itemsPorPagina);

  // Cambiar de página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  }

  useEffect(() => {
    obtenerLista();
  }, []);

  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11">
        {/* Filtro por categorías */}
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title mb-3">Filtrar por categoría</h5>
            <div className="d-flex flex-wrap gap-2">
              {categorias.map((categoria, index) => (
                <button
                  key={index}
                  className={`btn ${categoriaSeleccionada === categoria ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => filtrarPorCategoria(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
            <div className="mt-2 text-muted">
              <small>Mostrando {filteredList.length} plato(s)</small>
            </div>
          </div>
        </div>

        {/* Tabla de comidas */}
        <div className="card">
          <div className="card-body">
            <table className='table table-hover'>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {itemsActuales.length > 0 ? (
                  itemsActuales.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img src={item.imageUrl} alt="" height={48} width={48} className="rounded"/>
                      </td>
                      <td>{item.nombre}</td>
                      <td>
                        <span className="badge bg-secondary">{item.categoria}</span>
                      </td>
                      <td>${item.precio}</td>
                      <td className='text-danger'>
                        <i 
                          className='bi bi-x-circle-fill' 
                          style={{cursor: 'pointer'}}
                          onClick={() => eliminarComida(item.id)}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No hay platos en esta categoría
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            {filteredList.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                  <small>
                    Mostrando {indexPrimerItem + 1} - {Math.min(indexUltimoItem, filteredList.length)} de {filteredList.length}
                  </small>
                </div>
                
                <nav>
                  <ul className="pagination mb-0">
                    {/* Botón Anterior */}
                    <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                      >
                        Anterior
                      </button>
                    </li>

                    {/* Números de página */}
                    {[...Array(totalPaginas)].map((_, index) => (
                      <li 
                        key={index} 
                        className={`page-item ${paginaActual === index + 1 ? 'active' : ''}`}
                      >
                        <button 
                          className="page-link" 
                          onClick={() => cambiarPagina(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}

                    {/* Botón Siguiente */}
                    <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                      >
                        Siguiente
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListaComida;