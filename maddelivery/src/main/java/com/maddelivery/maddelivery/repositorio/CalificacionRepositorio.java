package com.maddelivery.maddelivery.repositorio;

import com.maddelivery.maddelivery.entidad.Calificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalificacionRepositorio extends JpaRepository<Calificacion, Long> {

    List<Calificacion> findAllByOrderByFechaCreacionDesc();

    List<Calificacion> findByPuntuacion(Integer puntuacion);

}