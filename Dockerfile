# Use a base image with Python
FROM python:3.10-slim

# Install required system packages including DNS tools
RUN apt-get update && apt-get install -y \
    chromium \
    dnsutils \
    iputils-ping \
    net-tools \
    libatk1.0-0 libatk-bridge2.0-0 libcups2 libdbus-1-3 \
    libdrm2 libgbm1 libgtk-3-0 libnspr4 libnss3 \
    libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxdamage1 libxext6 libxfixes3 libxrandr2 libxtst6 \
    fonts-liberation lsb-release xdg-utils wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Create a non-root user
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Set DNS configuration
COPY resolv.conf /etc/resolv.conf

# Copy your requirements and install Python packages
COPY requirements.txt .
# Make sure pyppeteer is in requirements.txt and NOT trying to download Chromium by itself
# If PYPPETEER_CHROMIUM_REVISION is set, it might try to download.
# We want it to use the system-installed Chromium.
# You might need to set: ENV PYPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PYPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .
RUN chown -R pptruser:pptruser /app

# Switch to non-root user
USER pptruser

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run your application - bind to all interfaces
CMD ["uvicorn", "main_api:app", "--host", "0.0.0.0", "--port", "8000"]