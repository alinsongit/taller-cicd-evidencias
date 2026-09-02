package com.maddelivery.maddelivery.servicio;

import com.maddelivery.maddelivery.entidad.OrderEntity;
import com.maddelivery.maddelivery.io.OrderRequest;
import com.maddelivery.maddelivery.io.OrderResponse;
import com.maddelivery.maddelivery.repositorio.CartRepository;
import com.maddelivery.maddelivery.repositorio.OrderRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CartRepository cartRepository;


    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) {
        String userId = userService.findByUserId();

        OrderEntity newOrder = convertToEntity(request);

        newOrder.setUserId(userId);

        newOrder = orderRepository.save(newOrder);
        return convertToResponse(newOrder);
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        List<OrderEntity> list = orderRepository.findByUserId(loggedInUserId);
        return list.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    @Deprecated
    public List<OrderResponse> getOrdersOfAllUsers() {
        List <OrderEntity> list = orderRepository.findAll();
        return list.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public Page<OrderResponse> getOrdersOfAllUsersPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("id").descending()
        );

        Page<OrderEntity> entityPage = orderRepository.findAll(pageable);

        return entityPage.map(entity -> convertToResponse(entity));
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        entity.setEstado(status);
        orderRepository.save(entity);
    }

    private OrderResponse convertToResponse(OrderEntity newOrder){
        return OrderResponse.builder()
                .id(newOrder.getId())
                .cuenta(newOrder.getCuenta())
                .direccion(newOrder.getDireccion())
                .userId(newOrder.getUserId())
                .estado(newOrder.getEstado())
                .estadoDePago(newOrder.getEstadoDePago())
                .email(newOrder.getEmail())
                .telefono(newOrder.getTelefono())
                .orderedItems(newOrder.getOrderItems())
                .build();
    }

    private OrderEntity convertToEntity(OrderRequest request) {
        return OrderEntity.builder()
                .direccion(request.getDireccion())
                .cuenta(request.getCuenta())
                .orderItems(request.getOrderedItems())
                .email(request.getEmail())
                .telefono(request.getTelefono())
                .estado(request.getEstado())
                .build();
    }
}