package com.placement.campusplacement.exception;

/**
 * Thrown when a unique constraint would be violated — for example,
 * registering a student with an email or USN that already exists.
 * Maps to HTTP 409 Conflict in GlobalExceptionHandler.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}

