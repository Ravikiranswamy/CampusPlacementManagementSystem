package com.placement.campusplacement.exception;

import com.placement.campusplacement.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Centralized exception handling for all REST controllers.
 *
 * Instead of try/catch blocks in every controller, exceptions thrown anywhere
 * in the service or controller layer are caught here and converted into a
 * consistent ApiResponse JSON structure with the correct HTTP status code.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 404 — Resource not found (student, company, drive, etc.)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * 409 — Duplicate resource (email, USN already exists)
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResource(DuplicateResourceException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * 422 — Business rule violated (ineligible application, blocked student, etc.)
     */
    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessRule(BusinessRuleException ex) {
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * 400 — Validation failure on @Valid-annotated request bodies.
     * Collects all field-level errors into a readable map.
     * Example: { "email": "must not be blank", "cgpa": "must be between 0 and 10" }
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        String errorMsg = "Validation failed: " + fieldErrors.entrySet().stream()
                .map(e -> e.getKey() + " (" + e.getValue() + ")")
                .reduce((a, b) -> a + ", " + b)
                .orElse("Invalid input");
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(errorMsg));
    }

    /**
     * 400 — General illegal argument errors.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * 500 — Catch-all for any unexpected server error.
     * Avoids leaking stack traces to the client.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Server Error: " + ex.getClass().getSimpleName() + " - " + ex.getMessage()));
    }
}

