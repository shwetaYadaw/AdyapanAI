# Python Runner Image
FROM python:3.11-slim

# Install necessary tools
RUN apt-get update && apt-get install -y \
    time \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Security: Run as non-root user
RUN useradd -m -u 1000 runner && \
    chown -R runner:runner /app

USER runner

# Label for cleanup
LABEL adyapan-runner="true"
LABEL language="python"

CMD ["/bin/sh"]
