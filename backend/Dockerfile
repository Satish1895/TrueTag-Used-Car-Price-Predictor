# /backend/Dockerfile

FROM python:3.12-slim
WORKDIR /app

# Install dependencies first (caching layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the FastAPI code and ML models
COPY . .

EXPOSE 8000
# Ensure this points to your main FastAPI file (e.g., main:app)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]