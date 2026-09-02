package com.maddelivery.maddelivery.controlador;

import com.maddelivery.maddelivery.io.OrderRequest;
import com.maddelivery.maddelivery.io.OrderResponse;
import com.maddelivery.maddelivery.servicio.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest request){
        OrderResponse response= orderService.createOrderWithPayment(request);
        return response;
    }

    @GetMapping
    public List<OrderResponse> getOrders(){
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId){
        orderService.removeOrder(orderId);
    }

    @GetMapping("/all")
    @Deprecated
    public List<OrderResponse> getOrdersOfAllUsers (){
        return orderService.getOrdersOfAllUsers();
    }

    @GetMapping("/all/paginated")
    public Page<OrderResponse> getOrdersOfAllUsersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ){
        return orderService.getOrdersOfAllUsersPaginated(page, size);
    }

    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable String orderId, @RequestParam String estado){
        orderService.updateOrderStatus(orderId, estado);
    }
}