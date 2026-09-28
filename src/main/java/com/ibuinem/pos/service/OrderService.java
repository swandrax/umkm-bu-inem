package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.*;
import com.ibuinem.pos.dto.order.*;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.exception.NotFoundException;
import com.ibuinem.pos.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private OrderDAO orderDAO;
    private ServiceProductDAO serviceProductDAO;
    private CustomerDAO customerDAO;
    private BusinessSettingsDAO businessSettingsDAO;
    private ReceiptDAO receiptDAO;
    private CrmActivityDAO crmActivityDAO;

    public OrderService() {
        this.orderDAO = new OrderDAO();
        this.serviceProductDAO = new ServiceProductDAO();
        this.customerDAO = new CustomerDAO();
        this.businessSettingsDAO = new BusinessSettingsDAO();
        this.receiptDAO = new ReceiptDAO();
        this.crmActivityDAO = new CrmActivityDAO();
    }

    public OrderService(OrderDAO orderDAO, ServiceProductDAO serviceProductDAO,
                        CustomerDAO customerDAO, BusinessSettingsDAO businessSettingsDAO,
                        ReceiptDAO receiptDAO, CrmActivityDAO crmActivityDAO) {
        this.orderDAO = orderDAO;
        this.serviceProductDAO = serviceProductDAO;
        this.customerDAO = customerDAO;
        this.businessSettingsDAO = businessSettingsDAO;
        this.receiptDAO = receiptDAO;
        this.crmActivityDAO = crmActivityDAO;
    }

    @Transactional(rollbackFor = Exception.class)
    public OrderDto createOrder(CreateOrderRequest req) {
        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new BusinessException("Pesanan harus memiliki minimal 1 layanan", "EMPTY_ORDER_ITEMS");
        }

        // 1. Resolve or register customer
        Customer customer = null;
        if (req.getCustomerPhone() != null && !req.getCustomerPhone().isBlank()) {
            customer = customerDAO.getByPhone(req.getCustomerPhone().trim());
            if (customer == null) {
                customer = new Customer();
                customer.setName(req.getCustomerName().trim());
                customer.setPhone(req.getCustomerPhone().trim());
                customer.setEmail(req.getCustomerEmail());
                customer.setSource("ONLINE_ORDER");
                customer.setStatus("ACTIVE");
                customerDAO.insert(customer);
            }
        }

        // 2. Fetch business settings for tax rate
        BusinessSettings settings = businessSettingsDAO.getSettings();
        BigDecimal taxRate = settings.getTaxRate() != null ? settings.getTaxRate() : BigDecimal.ZERO;

        // 3. Process items with server-side authoritative pricing
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemReq : req.getItems()) {
            ServiceProduct sp = serviceProductDAO.getById(itemReq.getServiceProductId());
            if (sp == null || !sp.isActive()) {
                throw new BusinessException("Layanan dengan ID " + itemReq.getServiceProductId() + " tidak tersedia", "SERVICE_NOT_FOUND");
            }

            int qty = Math.max(1, itemReq.getQuantity());
            BigDecimal unitBasePrice = sp.getBasePrice();
            BigDecimal unitFinalPrice = sp.getFinalPrice();
            BigDecimal unitDiscount = unitBasePrice.subtract(unitFinalPrice).max(BigDecimal.ZERO);

            BigDecimal lineSubtotal = unitBasePrice.multiply(BigDecimal.valueOf(qty));
            BigDecimal lineDiscount = unitDiscount.multiply(BigDecimal.valueOf(qty));
            BigDecimal lineTotal = unitFinalPrice.multiply(BigDecimal.valueOf(qty));

            OrderItem oi = new OrderItem();
            oi.setServiceProductId(sp.getId());
            oi.setProductNameSnapshot(sp.getName());
            oi.setUnitPriceSnapshot(unitBasePrice);
            oi.setQuantity(qty);
            oi.setDiscount(lineDiscount);
            oi.setLineTotal(lineTotal);

            orderItems.add(oi);
            subtotal = subtotal.add(lineSubtotal);
            totalDiscount = totalDiscount.add(lineDiscount);
        }

        // 4. Calculate Tax and Total Amount
        BigDecimal taxableAmount = subtotal.subtract(totalDiscount).max(BigDecimal.ZERO);
        BigDecimal taxAmount = BigDecimal.ZERO;
        if (taxRate.compareTo(BigDecimal.ZERO) > 0) {
            taxAmount = taxableAmount.multiply(taxRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }
        BigDecimal grandTotal = taxableAmount.add(taxAmount);

        // 5. Construct Order Header
        Order order = new Order();
        order.setOrderNumber(orderDAO.generateOrderNumber());
        if (customer != null) {
            order.setCustomerId(customer.getId());
        }
        order.setCustomerName(req.getCustomerName().trim());
        order.setCustomerEmail(req.getCustomerEmail());
        order.setCustomerPhone(req.getCustomerPhone().trim());
        order.setStatus("WAITING_PAYMENT");
        order.setSubtotal(subtotal);
        order.setDiscountAmount(totalDiscount);
        order.setTaxAmount(taxAmount);
        order.setTotalAmount(grandTotal);
        order.setPaymentStatus("UNPAID");
        order.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod().toUpperCase() : "QRIS_DUMMY");
        order.setNotes(req.getNotes());
        order.setItems(orderItems);

        boolean ok = orderDAO.insert(order);
        if (!ok) {
            throw new BusinessException("Gagal membuat pesanan baru", "ORDER_CREATION_FAILED");
        }

        // 6. Record CRM Activity
        crmActivityDAO.insert(new CrmActivity(
                order.getCustomerId(),
                null,
                order.getId(),
                "ORDER_CREATED",
                "Pesanan Baru dibuat: #" + order.getOrderNumber(),
                "Total: Rp " + grandTotal + " (" + order.getPaymentMethod() + ") untuk " + order.getCustomerName(),
                "CUSTOMER_WEB"
        ));

        return toDto(order);
    }

    public OrderDto getByOrderNumber(String orderNumber) {
        Order order = orderDAO.getByOrderNumber(orderNumber);
        if (order == null) {
            throw new NotFoundException("Pesanan dengan nomor '" + orderNumber + "' tidak ditemukan");
        }
        return toDto(order);
    }

    public List<OrderDto> getAll(String status, String paymentStatus, String search, int limit, int offset) {
        return orderDAO.getAll(status, paymentStatus, search, limit, offset)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class)
    public PaymentProofDto processCashPayment(String orderNumber, BigDecimal amountReceived, String operator) {
        Order order = orderDAO.getByOrderNumber(orderNumber);
        if (order == null) {
            throw new NotFoundException("Pesanan tidak ditemukan");
        }

        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            return getPaymentProof(orderNumber);
        }

        if (amountReceived == null || amountReceived.compareTo(order.getTotalAmount()) < 0) {
            throw new BusinessException("Uang tunai yang diterima kurang dari total pembayaran", "INSUFFICIENT_CASH");
        }

        BigDecimal changeAmount = amountReceived.subtract(order.getTotalAmount()).max(BigDecimal.ZERO);

        // Update Order
        orderDAO.updatePaymentStatus(order.getId(), "PAID", "CASH", "PROCESSING");
        order.setPaymentStatus("PAID");
        order.setPaymentMethod("CASH");
        order.setStatus("PROCESSING");

        // Generate Persistent Receipt
        BusinessSettings settings = businessSettingsDAO.getSettings();
        Receipt receipt = new Receipt();
        receipt.setReceiptNumber(receiptDAO.generateReceiptNumber());
        receipt.setOrderId(order.getId());
        receipt.setBarcodePayload("ORDER:" + order.getOrderNumber());
        receipt.setStoreName(settings.getBusinessName());
        receipt.setStoreAddress(settings.getAddress());
        receipt.setStorePhone(settings.getPhone());
        receipt.setCustomerServiceEmail(settings.getCustomerServiceEmail());
        receipt.setThankYouMessage(settings.getReceiptFooter());
        receipt.setAmountDue(order.getTotalAmount());
        receipt.setAmountReceived(amountReceived);
        receipt.setChangeAmount(changeAmount);
        receipt.setPaymentMethod("CASH");
        receipt.setPaymentReference("CASH-" + order.getOrderNumber());
        receipt.setQrisDummy(false);
        receipt.setPrintedAt(LocalDateTime.now());
        receiptDAO.insert(receipt);

        // Record CRM Activity
        crmActivityDAO.insert(new CrmActivity(
                order.getCustomerId(),
                null,
                order.getId(),
                "PAYMENT_CONFIRMED",
                "Pembayaran Tunai Diterima: #" + order.getOrderNumber(),
                "Diterima: Rp " + amountReceived + ", Kembalian: Rp " + changeAmount + ", Operator: " + (operator != null ? operator : "KASIR/ADMIN"),
                operator != null ? operator : "ADMIN"
        ));

        return getPaymentProof(orderNumber);
    }

    @Transactional(rollbackFor = Exception.class)
    public PaymentProofDto processDummyQrisSimulation(String orderNumber, String action) {
        Order order = orderDAO.getByOrderNumber(orderNumber);
        if (order == null) {
            throw new NotFoundException("Pesanan tidak ditemukan");
        }

        String safeAction = action != null ? action.toUpperCase().trim() : "SUCCESS";

        if ("SUCCESS".equals(safeAction)) {
            if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
                return getPaymentProof(orderNumber);
            }

            orderDAO.updatePaymentStatus(order.getId(), "PAID", "QRIS_DUMMY", "PROCESSING");
            order.setPaymentStatus("PAID");
            order.setPaymentMethod("QRIS_DUMMY");
            order.setStatus("PROCESSING");

            // Generate Persistent Receipt
            BusinessSettings settings = businessSettingsDAO.getSettings();
            Receipt receipt = new Receipt();
            receipt.setReceiptNumber(receiptDAO.generateReceiptNumber());
            receipt.setOrderId(order.getId());
            receipt.setBarcodePayload("ORDER:" + order.getOrderNumber());
            receipt.setStoreName(settings.getBusinessName());
            receipt.setStoreAddress(settings.getAddress());
            receipt.setStorePhone(settings.getPhone());
            receipt.setCustomerServiceEmail(settings.getCustomerServiceEmail());
            receipt.setThankYouMessage(settings.getReceiptFooter());
            receipt.setAmountDue(order.getTotalAmount());
            receipt.setAmountReceived(order.getTotalAmount());
            receipt.setChangeAmount(BigDecimal.ZERO);
            receipt.setPaymentMethod("QRIS_DUMMY");
            receipt.setPaymentReference("QRIS-DEMO-" + order.getOrderNumber());
            receipt.setQrisDummy(true);
            receipt.setPrintedAt(LocalDateTime.now());
            receiptDAO.insert(receipt);

            // Record CRM Activity
            crmActivityDAO.insert(new CrmActivity(
                    order.getCustomerId(),
                    null,
                    order.getId(),
                    "PAYMENT_CONFIRMED",
                    "Simulasi QRIS Demo Berhasil: #" + order.getOrderNumber(),
                    "Total: Rp " + order.getTotalAmount() + " terkonfirmasi secara aman via QRIS TEST MODE",
                    "QRIS_SIMULATOR"
            ));

        } else if ("FAILED".equals(safeAction)) {
            orderDAO.updatePaymentStatus(order.getId(), "FAILED", "QRIS_DUMMY", "WAITING_PAYMENT");
            order.setPaymentStatus("FAILED");
            order.setStatus("WAITING_PAYMENT");
            crmActivityDAO.insert(new CrmActivity(
                    order.getCustomerId(),
                    null,
                    order.getId(),
                    "PAYMENT_INITIATED",
                    "Simulasi QRIS Demo Gagal: #" + order.getOrderNumber(),
                    "Simulasi kegagalan pembayaran diuji pada pesanan.",
                    "QRIS_SIMULATOR"
            ));
        } else if ("EXPIRED".equals(safeAction)) {
            orderDAO.updatePaymentStatus(order.getId(), "EXPIRED", "QRIS_DUMMY", "CANCELED");
            order.setPaymentStatus("EXPIRED");
            order.setStatus("CANCELED");
            crmActivityDAO.insert(new CrmActivity(
                    order.getCustomerId(),
                    null,
                    order.getId(),
                    "STATUS_CHANGED",
                    "Sesi QRIS Demo Kedaluwarsa: #" + order.getOrderNumber(),
                    "Batas waktu simulasi telah habis.",
                    "QRIS_SIMULATOR"
            ));
        }

        return getPaymentProof(orderNumber);
    }

    public PaymentProofDto getPaymentProof(String orderNumber) {
        Order order = orderDAO.getByOrderNumber(orderNumber);
        if (order == null) {
            throw new NotFoundException("Pesanan tidak ditemukan");
        }

        Receipt receipt = receiptDAO.getByOrderId(order.getId());

        PaymentProofDto proof = new PaymentProofDto();
        proof.setOrderNumber(order.getOrderNumber());
        proof.setPaymentReference(receipt != null ? receipt.getPaymentReference() : "REF-" + order.getOrderNumber());
        proof.setCustomerName(order.getCustomerName());
        proof.setPaymentMethod(order.getPaymentMethod());
        proof.setTotalAmount(order.getTotalAmount());
        proof.setStatus(order.getPaymentStatus());
        proof.setPaidAt(order.getUpdatedAt() != null ? order.getUpdatedAt() : LocalDateTime.now());
        proof.setOperatorReference("SISTEM-UMKM-BU-INEM");
        boolean isQris = "QRIS_DUMMY".equalsIgnoreCase(order.getPaymentMethod()) || (receipt != null && receipt.isQrisDummy());
        proof.setQrisDummy(isQris);
        if (isQris) {
            proof.setTestNotice("QRIS DEMO / TEST PAYMENT - BUKAN TRANSAKSI PERBANKAN NYATA");
        }
        return proof;
    }

    public DigitalReceiptDto getDigitalReceipt(String orderNumber) {
        Order order = orderDAO.getByOrderNumber(orderNumber);
        if (order == null) {
            throw new NotFoundException("Pesanan tidak ditemukan");
        }

        BusinessSettings settings = businessSettingsDAO.getSettings();
        Receipt receipt = receiptDAO.getByOrderId(order.getId());

        DigitalReceiptDto dto = new DigitalReceiptDto();
        dto.setReceiptNumber(receipt != null ? receipt.getReceiptNumber() : "RCP-" + order.getOrderNumber());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setTransactionDate(order.getCreatedAt());
        dto.setStoreName(settings.getBusinessName());
        dto.setStoreAddress(settings.getAddress());
        dto.setStorePhone(settings.getPhone());
        dto.setCustomerServiceEmail(settings.getCustomerServiceEmail());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerPhone(order.getCustomerPhone());
        dto.setSubtotal(order.getSubtotal());
        dto.setDiscount(order.getDiscountAmount());
        dto.setTax(order.getTaxAmount());
        dto.setTotal(order.getTotalAmount());
        dto.setPaymentMethod(order.getPaymentMethod());

        if (receipt != null) {
            dto.setCashAmount(receipt.getAmountReceived());
            dto.setChangeAmount(receipt.getChangeAmount());
            dto.setPaymentReference(receipt.getPaymentReference());
            dto.setBarcode(receipt.getBarcodePayload());
            dto.setThankYouMessage(receipt.getThankYouMessage());
            dto.setQrisDummy(receipt.isQrisDummy());
        } else {
            dto.setCashAmount(order.getTotalAmount());
            dto.setChangeAmount(BigDecimal.ZERO);
            dto.setPaymentReference("REF-" + order.getOrderNumber());
            dto.setBarcode("ORDER:" + order.getOrderNumber());
            dto.setThankYouMessage(settings.getReceiptFooter());
            dto.setQrisDummy("QRIS_DUMMY".equalsIgnoreCase(order.getPaymentMethod()));
        }

        if (dto.isQrisDummy()) {
            dto.setQrisNotice("QRIS DEMO / TEST PAYMENT");
        }

        dto.setItems(order.getItems().stream().map(oi -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setId(oi.getId());
            itemDto.setServiceProductId(oi.getServiceProductId());
            itemDto.setProductName(oi.getProductNameSnapshot());
            itemDto.setUnitPrice(oi.getUnitPriceSnapshot());
            itemDto.setQuantity(oi.getQuantity());
            itemDto.setDiscount(oi.getDiscount());
            itemDto.setLineTotal(oi.getLineTotal());
            return itemDto;
        }).collect(Collectors.toList()));

        return dto;
    }

    public OrderDto toDto(Order o) {
        OrderDto dto = new OrderDto();
        dto.setId(o.getId());
        dto.setOrderNumber(o.getOrderNumber());
        dto.setCustomerId(o.getCustomerId());
        dto.setCustomerName(o.getCustomerName());
        dto.setCustomerEmail(o.getCustomerEmail());
        dto.setCustomerPhone(o.getCustomerPhone());
        dto.setStatus(o.getStatus());
        dto.setSubtotal(o.getSubtotal());
        dto.setDiscountAmount(o.getDiscountAmount());
        dto.setTaxAmount(o.getTaxAmount());
        dto.setTotalAmount(o.getTotalAmount());
        dto.setPaymentStatus(o.getPaymentStatus());
        dto.setPaymentMethod(o.getPaymentMethod());
        dto.setNotes(o.getNotes());
        dto.setCreatedAt(o.getCreatedAt());
        dto.setUpdatedAt(o.getUpdatedAt());

        // Safe QRIS Demo Payload as required by Section 15
        dto.setQrisPayload("UMKM-BU-INEM-DEMO|ORDER:" + o.getOrderNumber() + "|AMOUNT:" + o.getTotalAmount());
        dto.setQrisDemoNote("QRIS DEMO / TEST PAYMENT - Simulasi Pembayaran Cepat UMKM Bu Inem");

        if (o.getItems() != null) {
            dto.setItems(o.getItems().stream().map(i -> {
                OrderItemDto itemDto = new OrderItemDto();
                itemDto.setId(i.getId());
                itemDto.setServiceProductId(i.getServiceProductId());
                itemDto.setProductName(i.getProductNameSnapshot());
                itemDto.setUnitPrice(i.getUnitPriceSnapshot());
                itemDto.setQuantity(i.getQuantity());
                itemDto.setDiscount(i.getDiscount());
                itemDto.setLineTotal(i.getLineTotal());
                return itemDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
