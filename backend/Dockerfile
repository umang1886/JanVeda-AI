FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Cloud Run injects PORT — gunicorn_conf.py reads it
ENV PORT=8080

CMD ["gunicorn", "-c", "gunicorn_conf.py", "app:app"]