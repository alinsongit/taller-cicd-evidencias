package com.maddelivery.maddelivery.servicio;

import com.maddelivery.maddelivery.entidad.CartEntity;
import com.maddelivery.maddelivery.io.CartRequest;
import com.maddelivery.maddelivery.io.CartResponse;
import com.maddelivery.maddelivery.repositorio.CartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private CartServiceImpl cartService;

    @BeforeEach
    void setUp() {
        when(userService.findByUserId()).thenReturn("user-123");
    }

    @Test
    void addToCart_creaUnCarritoCuandoNoExiste() {
        when(cartRepository.findByUserId("user-123")).thenReturn(Optional.empty());
        when(cartRepository.save(any(CartEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CartResponse response = cartService.addToCart(
                CartRequest.builder().foodId("plato-1").build());

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo("user-123");
        assertThat(response.getItems()).containsEntry("plato-1", 1);
        verify(cartRepository).save(any(CartEntity.class));
    }

    @Test
    void addToCart_incrementaCantidadCuandoElItemYaExiste() {
        Map<String, Integer> items = new HashMap<>();
        items.put("plato-2", 1);
        CartEntity existing = new CartEntity("cart-1", "user-123", items);

        when(cartRepository.findByUserId("user-123")).thenReturn(Optional.of(existing));
        when(cartRepository.save(any(CartEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CartResponse response = cartService.addToCart(
                CartRequest.builder().foodId("plato-2").build());

        assertThat(response.getItems()).containsEntry("plato-2", 2);
        verify(cartRepository).save(existing);
    }

    @Test
    void addToCart_devuelveLosItemsAcumulados() {
        Map<String, Integer> items = new HashMap<>();
        items.put("plato-1", 2);
        items.put("plato-3", 1);
        CartEntity existing = new CartEntity("cart-1", "user-123", items);

        when(cartRepository.findByUserId("user-123")).thenReturn(Optional.of(existing));

        CartResponse response = cartService.getCart();

        assertThat(response.getItems()).containsEntry("plato-1", 2)
                .containsEntry("plato-3", 1);
    }

    @Test
    void removeFromCart_decrementaLaCantidadDelItem() {
        Map<String, Integer> items = new HashMap<>();
        items.put("plato-1", 1);
        CartEntity existing = new CartEntity("cart-1", "user-123", items);

        when(cartRepository.findByUserId("user-123")).thenReturn(Optional.of(existing));
        when(cartRepository.save(any(CartEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CartResponse response = cartService.removeFromCart(
                CartRequest.builder().foodId("plato-1").build());

        assertThat(response.getItems()).containsEntry("plato-1", 0);
    }

    @Test
    void clearCart_eliminaElCarritoDelUsuario() {
        cartService.clearCart();
        verify(cartRepository).deleteByUserId("user-123");
    }
}