import os

# Gunicorn config for Cloud Run
loglevel = "info"
errorlog = "-"   # stderr
accesslog = "-"  # stdout
worker_tmp_dir = "/dev/shm"
graceful_timeout = 120
timeout = 120
keepalive = 5
threads = 3
workers = 2

# Cloud Run sets PORT env var — must bind to it
port = os.environ.get("PORT", "8080")
bind = f"0.0.0.0:{port}"
