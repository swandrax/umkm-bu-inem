package com.ibuinem.pos.dto.order;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CashPaymentRequest {
    @NotNull(message = "Jumlah uang tunai diterima wajib diisi")
    private BigDecimal amountReceived;

    public CashPaymentRequest() {}

    public CashPaymentRequest(BigDecimal amountReceived) {
        this.amountReceived = amountReceived;
    }

    public BigDecimal getAmountReceived() { return amountReceived; }
    public void setAmountReceived(BigDecimal amountReceived) { this.amountReceived = amountReceived; }
}
