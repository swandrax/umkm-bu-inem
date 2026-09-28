package com.ibuinem.pos.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CreateOrderRequest {
    @NotBlank(message = "Nama pemesan wajib diisi")
    private String customerName;

    private String customerEmail;

    @NotBlank(message = "Nomor telepon/WhatsApp wajib diisi")
    private String customerPhone;

    private String notes;

    private String paymentMethod = "QRIS_DUMMY"; // CASH or QRIS_DUMMY

    @NotEmpty(message = "Pilihan layanan/pesanan tidak boleh kosong")
    @Valid
    private List<OrderItemRequest> items;

    public CreateOrderRequest() {}

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
