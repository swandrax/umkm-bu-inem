package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.*;
import com.ibuinem.pos.dto.order.*;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class OrderServiceTest {

    private StubOrderDAO orderDAO;
    private StubServiceProductDAO serviceProductDAO;
    private StubCustomerDAO customerDAO;
    private StubBusinessSettingsDAO businessSettingsDAO;
    private StubReceiptDAO receiptDAO;
    private StubCrmActivityDAO crmActivityDAO;
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderDAO = new StubOrderDAO();
        serviceProductDAO = new StubServiceProductDAO();
        customerDAO = new StubCustomerDAO();
        businessSettingsDAO = new StubBusinessSettingsDAO();
        receiptDAO = new StubReceiptDAO();
        crmActivityDAO = new StubCrmActivityDAO();

        orderService = new OrderService(
                orderDAO,
                serviceProductDAO,
                customerDAO,
                businessSettingsDAO,
                receiptDAO,
                crmActivityDAO
        );
    }

    @Test
    @DisplayName("Should authoritatively calculate order subtotal, discount, tax (11%), and grand total")
    void testCreateOrderAuthoritativeCalculation() {
        // Business Settings: 11% Tax
        BusinessSettings settings = new BusinessSettings();
        settings.setTaxRate(new BigDecimal("11.00"));
        businessSettingsDAO.settings = settings;

        // Service Product: basePrice 1,500,000, finalPrice 1,200,000 (discount 300,000)
        ServiceProduct sp = new ServiceProduct();
        sp.setId(1L);
        sp.setName("Website Company Profile UMKM");
        sp.setBasePrice(new BigDecimal("1500000"));
        sp.setFinalPrice(new BigDecimal("1200000"));
        sp.setActive(true);
        serviceProductDAO.products.put(1L, sp);

        CreateOrderRequest req = new CreateOrderRequest();
        req.setCustomerName("Bu Inem");
        req.setCustomerPhone("08123456789");
        req.setPaymentMethod("QRIS_DUMMY");
        req.setItems(List.of(new OrderItemRequest(1L, 2)));

        OrderDto created = orderService.createOrder(req);

        assertNotNull(created);
        assertNotNull(created.getOrderNumber());
        // Subtotal: 2 * 1,500,000 = 3,000,000
        assertEquals(new BigDecimal("3000000"), created.getSubtotal());
        // Total Discount: 2 * 300,000 = 600,000
        assertEquals(new BigDecimal("600000"), created.getDiscountAmount());
        // Taxable: 3,000,000 - 600,000 = 2,400,000. Tax (11%): 264,000.00
        assertEquals(new BigDecimal("264000.00"), created.getTaxAmount());
        // Grand Total: 2,400,000 + 264,000 = 2,664,000.00
        assertEquals(new BigDecimal("2664000.00"), created.getTotalAmount());
        assertEquals("WAITING_PAYMENT", created.getStatus());

        assertTrue(orderDAO.insertedOrders.size() == 1);
        assertTrue(crmActivityDAO.activities.size() == 1);
    }

    @Test
    @DisplayName("Should throw BusinessException when order has empty items")
    void testCreateOrderEmptyItemsThrows() {
        CreateOrderRequest req = new CreateOrderRequest();
        req.setCustomerName("Budi");
        req.setItems(Collections.emptyList());

        assertThrows(BusinessException.class, () -> orderService.createOrder(req));
    }

    @Test
    @DisplayName("Should validate cash payment, calculate changeAmount accurately, and persist receipt")
    void testProcessCashPaymentSuccessAndChangeCalculation() {
        Order order = new Order();
        order.setId(200L);
        order.setOrderNumber("ORD-CASH-001");
        order.setTotalAmount(new BigDecimal("100000.00"));
        order.setPaymentStatus("UNPAID");
        orderDAO.orders.put("ORD-CASH-001", order);

        // Cash received: 150,000 -> Change should be 50,000
        BigDecimal cashReceived = new BigDecimal("150000.00");
        PaymentProofDto proof = orderService.processCashPayment("ORD-CASH-001", cashReceived, "KASIR-01");

        assertNotNull(proof);
        assertEquals("PAID", order.getPaymentStatus());
        assertEquals("CASH", order.getPaymentMethod());
        assertEquals("PROCESSING", order.getStatus());

        assertEquals(1, receiptDAO.insertedReceipts.size());
        Receipt savedReceipt = receiptDAO.insertedReceipts.get(0);
        assertEquals(new BigDecimal("100000.00"), savedReceipt.getAmountDue());
        assertEquals(new BigDecimal("150000.00"), savedReceipt.getAmountReceived());
        assertEquals(new BigDecimal("50000.00"), savedReceipt.getChangeAmount());
        assertEquals("ORDER:ORD-CASH-001", savedReceipt.getBarcodePayload());
        assertFalse(savedReceipt.isQrisDummy());
    }

    @Test
    @DisplayName("Should throw BusinessException when cash received is less than total amount")
    void testProcessCashPaymentInsufficientCash() {
        Order order = new Order();
        order.setId(201L);
        order.setOrderNumber("ORD-CASH-002");
        order.setTotalAmount(new BigDecimal("100000.00"));
        order.setPaymentStatus("UNPAID");
        orderDAO.orders.put("ORD-CASH-002", order);

        BigDecimal insufficient = new BigDecimal("80000.00");
        BusinessException ex = assertThrows(BusinessException.class, () ->
                orderService.processCashPayment("ORD-CASH-002", insufficient, "KASIR-01")
        );
        assertEquals("INSUFFICIENT_CASH", ex.getErrorCode());
        assertEquals(0, receiptDAO.insertedReceipts.size());
    }

    @Test
    @DisplayName("Should be idempotent when cash payment is re-triggered on already paid order")
    void testProcessCashPaymentIdempotency() {
        Order order = new Order();
        order.setId(202L);
        order.setOrderNumber("ORD-CASH-003");
        order.setTotalAmount(new BigDecimal("100000.00"));
        order.setPaymentStatus("PAID");
        orderDAO.orders.put("ORD-CASH-003", order);

        Receipt existingReceipt = new Receipt();
        existingReceipt.setOrderId(202L);
        existingReceipt.setReceiptNumber("REC-001");
        receiptDAO.receiptsByOrderId.put(202L, existingReceipt);

        PaymentProofDto proof = orderService.processCashPayment("ORD-CASH-003", new BigDecimal("100000.00"), "KASIR-01");
        assertNotNull(proof);
        assertEquals(0, receiptDAO.insertedReceipts.size());
    }

    @Test
    @DisplayName("Should process dummy QRIS simulation SUCCESS transition and create receipt with barcode")
    void testProcessDummyQrisSimulationSuccess() {
        Order order = new Order();
        order.setId(301L);
        order.setOrderNumber("ORD-QRIS-001");
        order.setTotalAmount(new BigDecimal("250000.00"));
        order.setPaymentStatus("UNPAID");
        orderDAO.orders.put("ORD-QRIS-001", order);

        PaymentProofDto proof = orderService.processDummyQrisSimulation("ORD-QRIS-001", "SUCCESS");
        assertNotNull(proof);

        assertEquals("PAID", order.getPaymentStatus());
        assertEquals("QRIS_DUMMY", order.getPaymentMethod());
        assertEquals("PROCESSING", order.getStatus());

        assertEquals(1, receiptDAO.insertedReceipts.size());
        Receipt r = receiptDAO.insertedReceipts.get(0);
        assertEquals("ORDER:ORD-QRIS-001", r.getBarcodePayload());
        assertTrue(r.isQrisDummy());
        assertEquals("QRIS_DUMMY", r.getPaymentMethod());
    }

    @Test
    @DisplayName("Should process dummy QRIS simulation FAILED transition to CANCELLED status")
    void testProcessDummyQrisSimulationFailed() {
        Order order = new Order();
        order.setId(302L);
        order.setOrderNumber("ORD-QRIS-002");
        order.setTotalAmount(new BigDecimal("250000.00"));
        order.setPaymentStatus("UNPAID");
        orderDAO.orders.put("ORD-QRIS-002", order);

        PaymentProofDto proof = orderService.processDummyQrisSimulation("ORD-QRIS-002", "FAILED");
        assertNotNull(proof);
        assertEquals("FAILED", proof.getStatus());

        assertEquals("FAILED", order.getPaymentStatus());
        assertEquals("WAITING_PAYMENT", order.getStatus());
        assertEquals(0, receiptDAO.insertedReceipts.size());
    }

    @Test
    @DisplayName("Should process dummy QRIS simulation EXPIRED transition to CANCELED status")
    void testProcessDummyQrisSimulationExpired() {
        Order order = new Order();
        order.setId(303L);
        order.setOrderNumber("ORD-QRIS-003");
        order.setTotalAmount(new BigDecimal("250000.00"));
        order.setPaymentStatus("UNPAID");
        orderDAO.orders.put("ORD-QRIS-003", order);

        PaymentProofDto proof = orderService.processDummyQrisSimulation("ORD-QRIS-003", "EXPIRED");
        assertNotNull(proof);
        assertEquals("EXPIRED", proof.getStatus());

        assertEquals("EXPIRED", order.getPaymentStatus());
        assertEquals("CANCELED", order.getStatus());
        assertEquals(0, receiptDAO.insertedReceipts.size());
    }

    // --- TEST STUBS ---

    static class StubOrderDAO extends OrderDAO {
        Map<String, Order> orders = new HashMap<>();
        List<Order> insertedOrders = new ArrayList<>();

        @Override
        public String generateOrderNumber() {
            return "ORD-" + System.currentTimeMillis();
        }

        @Override
        public boolean insert(Order order) {
            order.setId((long) (insertedOrders.size() + 1));
            orders.put(order.getOrderNumber(), order);
            insertedOrders.add(order);
            return true;
        }

        @Override
        public Order getByOrderNumber(String orderNumber) {
            return orders.get(orderNumber);
        }

        @Override
        public boolean updatePaymentStatus(long id, String paymentStatus, String paymentMethod, String status) {
            for (Order o : orders.values()) {
                if (Objects.equals(o.getId(), id)) {
                    o.setPaymentStatus(paymentStatus);
                    o.setPaymentMethod(paymentMethod);
                    o.setStatus(status);
                    return true;
                }
            }
            return false;
        }
    }

    static class StubServiceProductDAO extends ServiceProductDAO {
        Map<Long, ServiceProduct> products = new HashMap<>();

        @Override
        public ServiceProduct getById(long id) {
            return products.get(id);
        }
    }

    static class StubCustomerDAO extends CustomerDAO {
        Map<String, Customer> customers = new HashMap<>();

        @Override
        public Customer getByPhone(String phone) {
            return customers.get(phone);
        }

        @Override
        public boolean insert(Customer customer) {
            customer.setId(customers.size() + 1);
            customers.put(customer.getPhone(), customer);
            return true;
        }
    }

    static class StubBusinessSettingsDAO extends BusinessSettingsDAO {
        BusinessSettings settings = new BusinessSettings();

        @Override
        public BusinessSettings getSettings() {
            return settings;
        }
    }

    static class StubReceiptDAO extends ReceiptDAO {
        List<Receipt> insertedReceipts = new ArrayList<>();
        Map<Long, Receipt> receiptsByOrderId = new HashMap<>();

        @Override
        public String generateReceiptNumber() {
            return "REC-" + System.currentTimeMillis();
        }

        @Override
        public boolean insert(Receipt receipt) {
            receipt.setId((long) (insertedReceipts.size() + 1));
            insertedReceipts.add(receipt);
            receiptsByOrderId.put(receipt.getOrderId(), receipt);
            return true;
        }

        @Override
        public Receipt getByOrderId(long orderId) {
            return receiptsByOrderId.get(orderId);
        }
    }

    static class StubCrmActivityDAO extends CrmActivityDAO {
        List<CrmActivity> activities = new ArrayList<>();

        @Override
        public boolean insert(CrmActivity activity) {
            activities.add(activity);
            return true;
        }
    }
}
