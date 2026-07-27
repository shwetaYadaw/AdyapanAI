# C++ Runner Image
FROM gcc:13.2

# Install necessary tools
RUN apt-get update && apt-get install -y \
    time \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Set resource limits
ENV MALLOC_ARENA_MAX=2

# Security: Run as non-root user
RUN useradd -m -u 1000 runner && \
    chown -R runner:runner /app

USER runner

# Label for cleanup
LABEL adyapan-runner="true"
LABEL language="cpp"

CMD ["/bin/sh"]
