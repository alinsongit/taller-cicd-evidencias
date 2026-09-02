package com.maddelivery.maddelivery.controlador;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maddelivery.maddelivery.filters.JwtAuthenticationFilter;
import com.maddelivery.maddelivery.io.CartRequest;
import com.maddelivery.maddelivery.io.CartResponse;
import com.maddelivery.maddelivery.servicio.CartService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = CartController.class,
        excludeAutoConfiguration = { SecurityAutoConfiguration.class },
        excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class))
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CartService cartService;

    @Test
    void addToCart_agregaPlatoYDevuelve200() throws Exception {
        Map<String, Integer> items = new HashMap<>();
        items.put("plato-1", 1);
        CartResponse response = CartResponse.builder()
                .id("cart-1")
                .userId("user-123")
                .items(items)
                .build();
        when(cartService.addToCart(any(CartRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/cart")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("foodId", "plato-1"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("user-123"))
                .andExpect(jsonPath("$.items.plato-1").value(1));
    }

    @Test
    void addToCart_conFoodIdVacio_devuelve400() throws Exception {
        mockMvc.perform(post("/api/cart")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"foodId\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void addToCart_sinFoodId_devuelve400() throws Exception {
        mockMvc.perform(post("/api/cart")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getCart_devuelveElCarritoDelUsuario() throws Exception {
        CartResponse response = CartResponse.builder()
                .userId("user-123")
                .items(new HashMap<>())
                .build();
        when(cartService.getCart()).thenReturn(response);

        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("user-123"));
    }

    @Test
    void removeFromCart_eliminaUnPlato() throws Exception {
        Map<String, Integer> items = new HashMap<>();
        items.put("plato-1", 0);
        CartResponse response = CartResponse.builder().items(items).build();
        when(cartService.removeFromCart(argThat(req -> "plato-1".equals(req.getFoodId()))))
                .thenReturn(response);

        mockMvc.perform(post("/api/cart/remove")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("foodId", "plato-1"))))
                .andExpect(status().isOk());
    }

    @Test
    void clearCart_eliminaElCarrito() throws Exception {
        mockMvc.perform(delete("/api/cart"))
                .andExpect(status().isNoContent());
    }
}