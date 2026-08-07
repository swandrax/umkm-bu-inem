package com.ibuinem.pos.model;

public class PackageBenefit {
    private int id;
    private int packageId;
    private String benefitDetail;

    public PackageBenefit() {}

    public PackageBenefit(int id, int packageId, String benefitDetail) {
        this.id = id;
        this.packageId = packageId;
        this.benefitDetail = benefitDetail;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getPackageId() { return packageId; }
    public void setPackageId(int packageId) { this.packageId = packageId; }

    public String getBenefitDetail() { return benefitDetail; }
    public void setBenefitDetail(String benefitDetail) { this.benefitDetail = benefitDetail; }
}
