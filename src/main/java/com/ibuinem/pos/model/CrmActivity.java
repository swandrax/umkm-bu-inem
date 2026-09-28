package com.ibuinem.pos.model;

import java.time.LocalDateTime;

public class CrmActivity {
    private Long id;
    private Integer customerId;
    private Long leadId;
    private Long orderId;
    private String activityType;
    private String title;
    private String description;
    private String actor = "SYSTEM";
    private String metadata;
    private LocalDateTime createdAt;

    public CrmActivity() {}

    public CrmActivity(Integer customerId, Long leadId, Long orderId, String activityType, String title, String description, String actor) {
        this.customerId = customerId;
        this.leadId = leadId;
        this.orderId = orderId;
        this.activityType = activityType;
        this.title = title;
        this.description = description;
        this.actor = actor != null ? actor : "SYSTEM";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Long getLeadId() { return leadId; }
    public void setLeadId(Long leadId) { this.leadId = leadId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
