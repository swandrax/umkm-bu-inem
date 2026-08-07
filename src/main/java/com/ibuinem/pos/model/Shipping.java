package com.ibuinem.pos.model;

public class Shipping {
    private int id;
    private int saleId;
    private String shippingType;
    private String shippingStatus;
    private String customerNotes;
    private String courierNotes;

    public Shipping() {}

    public Shipping(int id, int saleId, String shippingType, String shippingStatus, String customerNotes, String courierNotes) {
        this.id = id;
        this.saleId = saleId;
        this.shippingType = shippingType;
        this.shippingStatus = shippingStatus;
        this.customerNotes = customerNotes;
        this.courierNotes = courierNotes;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getSaleId() { return saleId; }
    public void setSaleId(int saleId) { this.saleId = saleId; }

    public String getShippingType() { return shippingType; }
    public void setShippingType(String shippingType) { this.shippingType = shippingType; }

    public String getShippingStatus() { return shippingStatus; }
    public void setShippingStatus(String shippingStatus) { this.shippingStatus = shippingStatus; }

    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }

    public String getCourierNotes() { return courierNotes; }
    public void setCourierNotes(String courierNotes) { this.courierNotes = courierNotes; }
}
