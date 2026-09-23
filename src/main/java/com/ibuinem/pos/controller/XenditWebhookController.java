package com.ibuinem.pos.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.ibuinem.pos.dto.common.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * Public only for Xendit. It authenticates a callback before any database write
 * and records webhook-id first, which makes provider retries idempotent.
 */
@RestController
@RequestMapping("/api/v1/webhooks")
public class XenditWebhookController {
    private final JdbcTemplate jdbc;
    private final boolean enabled;
    private final String verificationToken;

    public XenditWebhookController(JdbcTemplate jdbc,
                                   @Value("${app.xendit.enabled:false}") boolean enabled,
                                   @Value("${app.xendit.webhook-token:}") String verificationToken) {
        this.jdbc = jdbc;
        this.enabled = enabled;
        this.verificationToken = verificationToken;
    }

    @PostMapping("/xendit")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> receive(
            @RequestHeader(value = "x-callback-token", required = false) String callbackToken,
            @RequestHeader(value = "webhook-id", required = false) String webhookId,
            @RequestBody JsonNode payload) {
        if (!enabled || verificationToken.isBlank() || !constantTimeEquals(verificationToken, callbackToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Webhook tidak terautentikasi", "INVALID_WEBHOOK"));
        }
        if (webhookId == null || webhookId.isBlank() || payload.path("data").path("payment_request_id").asText().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Payload webhook tidak lengkap", "INVALID_WEBHOOK"));
        }

        String requestId = payload.path("data").path("payment_request_id").asText();
        String status = payload.path("data").path("status").asText();
        String event = payload.path("event").asText("unknown");
        String hash = sha256(payload.toString());
        try {
            jdbc.update("INSERT INTO payment_webhook_events (provider, webhook_id, event_type, provider_payment_request_id, payload_sha256) VALUES ('XENDIT', ?, ?, ?, ?)",
                    webhookId, event, requestId, hash);
        } catch (DuplicateKeyException duplicate) {
            // Return 2xx: a retry must never become an error loop at the provider.
            return ResponseEntity.ok(ApiResponse.success("Webhook duplikat diabaikan", null));
        }

        if (!isAllowedStatus(status)) {
            jdbc.update("UPDATE payment_webhook_events SET outcome = 'REJECTED', processed_at = CURRENT_TIMESTAMP WHERE provider = 'XENDIT' AND webhook_id = ?", webhookId);
            return ResponseEntity.badRequest().body(ApiResponse.error("Status provider tidak dikenali", "INVALID_WEBHOOK"));
        }

        BigDecimal amount = payload.path("data").path("request_amount").decimalValue();
        int updated = jdbc.update("UPDATE payment_attempts SET status = ?, provider_payload = JSON_OBJECT('event', ?, 'status', ?), updated_at = CURRENT_TIMESTAMP WHERE provider = 'XENDIT' AND provider_payment_request_id = ? AND amount = ?",
                status, event, status, requestId, amount);
        String outcome = updated == 1 ? "PROCESSED" : "REJECTED";
        jdbc.update("UPDATE payment_webhook_events SET outcome = ?, processed_at = CURRENT_TIMESTAMP WHERE provider = 'XENDIT' AND webhook_id = ?", outcome, webhookId);
        return ResponseEntity.ok(ApiResponse.success("Webhook diterima", null));
    }

    private static boolean isAllowedStatus(String value) {
        return "PENDING".equals(value) || "SUCCEEDED".equals(value) || "FAILED".equals(value)
                || "EXPIRED".equals(value) || "CANCELED".equals(value);
    }

    private static boolean constantTimeEquals(String expected, String received) {
        if (received == null) return false;
        return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), received.getBytes(StandardCharsets.UTF_8));
    }

    private static String sha256(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(digest);
        } catch (java.security.NoSuchAlgorithmException impossible) {
            throw new IllegalStateException(impossible);
        }
    }
}
