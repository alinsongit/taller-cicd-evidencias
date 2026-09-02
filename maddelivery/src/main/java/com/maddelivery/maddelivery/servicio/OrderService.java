package com.maddelivery.maddelivery.servicio;

import com.maddelivery.maddelivery.io.OrderRequest;
import com.maddelivery.maddelivery.io.OrderResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {

    OrderResponse createOrderWithPayment(OrderRequest request);

    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    Page<OrderResponse> getOrdersOfAllUsersPaginated(int page, int size);

    void updateOrderStatus(String orderId, String status);

}