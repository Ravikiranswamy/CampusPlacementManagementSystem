package com.placement.campusplacement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

/**
 * Standard API response wrapper used for every controller response.
 *
 * Success response:  { "success": true,  "data": { ... }, "message": "..." }
 * Error response:    { "success": false, "data": null,    "message": "...", "errors": [...] }
 *
 * Using a generic type parameter T keeps it reusable across all modules.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    // ── Private constructor — use static factory methods ──────────────────────

    private ApiResponse(boolean success, String message, T data) {
        this.success   = success;
        this.message   = message;
        this.data      = data;
        this.timestamp = LocalDateTime.now();
    }

    // ── Static factories ──────────────────────────────────────────────────────

    /** Use for 200 OK / 201 Created responses that carry a body. */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    /** Use for 204 No Content or simple success without a body. */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }

    /** Use for any error response (4xx or 5xx). */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public boolean isSuccess()         { return success; }
    public String getMessage()         { return message; }
    public T getData()                 { return data; }
    public LocalDateTime getTimestamp(){ return timestamp; }
}
