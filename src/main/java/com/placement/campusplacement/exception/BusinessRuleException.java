package com.placement.campusplacement.exception;

/**
 * Thrown when a business rule is violated — for example,
 * a student applying to a drive they are ineligible for,
 * or a placement officer trying to block an already-blocked student.
 * Maps to HTTP 422 Unprocessable Entity in GlobalExceptionHandler.
 */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
