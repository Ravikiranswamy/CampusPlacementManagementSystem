# Multi-stage build for Spring Boot application
# Spring Boot 4.x requires Java 21+
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
# Cache Maven dependencies layer separately
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN MAVEN_OPTS="-Xmx400m -Xms256m" mvn clean package -DskipTests -q

# Runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-Xmx400m", "-jar", "app.jar"]

