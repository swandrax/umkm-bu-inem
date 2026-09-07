package com.ibuinem.pos.dto.sales;

public class ShippingRequest {
    private String shippingType = "Ambil Sendiri";
    private String customerNotes;
    private String courierNotes;

    public ShippingRequest() {}

    public String getShippingType() {
        return shippingType;
    }

    public void setShippingType(String shippingType) {
        this.shippingType = shippingType;
    }

    public String getCustomerNotes() {
        return customerNotes;
    }

    public void setCustomerNotes(String customerNotes) {
        this.customerNotes = customerNotes;
    }

    public String getCourierNotes() {
        return courierNotes;
    }

    public void setCourierNotes(String courierNotes) {
        this.courierNotes = courierNotes;
    }
}
