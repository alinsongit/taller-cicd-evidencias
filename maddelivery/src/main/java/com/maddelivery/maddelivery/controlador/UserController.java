package com.maddelivery.maddelivery.controlador;

import com.maddelivery.maddelivery.entidad.UserEntity;
import com.maddelivery.maddelivery.io.UserRequest;
import com.maddelivery.maddelivery.io.UserResponse;
import com.maddelivery.maddelivery.servicio.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request){
        return userService.registerUser(request);
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UserEntity>> obtenerTodosLosUsuarios() {
        List<UserEntity> usuarios = userService.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<UserEntity> obtenerUsuarioPorId(@PathVariable String id) {
        Optional<UserEntity> usuario = userService.obtenerUsuarioPorId(id);
        return usuario.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuarios/email/{email}")
    public ResponseEntity<UserEntity> obtenerUsuarioPorEmail(@PathVariable String email) {
        Optional<UserEntity> usuario = userService.obtenerUsuarioPorEmail(email);
        return usuario.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuarios/count")
    public ResponseEntity<Long> contarUsuarios() {
        long count = userService.contarUsuarios();
        return ResponseEntity.ok(count);
    }
}