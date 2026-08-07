package com.ibuinem.pos.model;

import java.time.LocalDateTime;

public class DeliveryLog {
    private int id;
    private int shippingId;
    private String status;
    private LocalDateTime timestamp;
    private String description;

    public DeliveryLog() {}

    public DeliveryLog(int id, int shippingId, String status, LocalDateTime timestamp, String description) {
        this.id = id;
        this.shippingId = shippingId;
        this.status = status;
        this.timestamp = timestamp;
        this.description = description;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getShippingId() { return shippingId; }
    public void setShippingId(int shippingId) { this.shippingId = shippingId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
