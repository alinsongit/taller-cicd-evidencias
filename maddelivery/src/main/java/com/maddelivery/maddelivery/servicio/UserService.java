package com.maddelivery.maddelivery.servicio;

import com.maddelivery.maddelivery.entidad.UserEntity;
import com.maddelivery.maddelivery.io.UserRequest;
import com.maddelivery.maddelivery.io.UserResponse;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    String findByUserId();

    List<UserEntity> obtenerTodosLosUsuarios();

    Optional<UserEntity> obtenerUsuarioPorId(String id);

    Optional<UserEntity> obtenerUsuarioPorEmail(String email);

    long contarUsuarios();
}