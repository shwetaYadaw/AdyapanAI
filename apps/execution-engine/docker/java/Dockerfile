# Java Runner Image - JDK (includes javac compiler)
FROM eclipse-temurin:17-jdk-alpine

# Install necessary tools
RUN apk add --no-cache \
    time \
    bash

# Create app directory
WORKDIR /app

# Security: Run as non-root user
RUN adduser -D -u 10001 runner && \
    chown -R runner:runner /app

USER runner

# Label for cleanup
LABEL adyapan-runner="true"
LABEL language="java"

CMD ["/bin/sh"]
