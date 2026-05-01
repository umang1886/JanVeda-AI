FROM python:3.10-slim

ENV PYTHONUNBUFFERED True

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Run the web service on container startup.
ENV PORT 8000
EXPOSE 8000
CMD exec gunicorn --bind 0.0.0.0:$PORT src.app:app --workers 1 --threads 8 --timeout 0