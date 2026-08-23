# T₹ueTag 🚗 

**Algorithmic pricing and real-time AI insights specifically tuned for used daily commuter cars.**

![Deployment Status](https://img.shields.io/badge/Deployment-Live-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-orange)

T₹ueTag is a full-stack machine learning application designed to predict the fair market value of used vehicles based on historical market data (Cars24). Beyond just returning a number, the system utilizes LLMs to generate real-time, personalized market insights justifying the valuation.

## 🏗️ System Architecture

This application is built with a production-ready, containerized microservices architecture:

*   **Frontend:** Next.js & Tailwind CSS, delivering a highly responsive, glassmorphism-styled UI.
*   **Backend:** FastAPI (Python), handling asynchronous API requests and machine learning model inference.
*   **AI/ML:** CatBoost for regression pricing, integrated with the Groq API for lightning-fast LLM market analysis.
*   **Infrastructure:** Dockerized multi-container setup, utilizing **Caddy** as an automatic reverse proxy for secure HTTPS routing and load balancing.
*   **Deployment:** Hosted on AWS EC2.

## 🚀 Live Demo
**[truetagapp.me](https://truetagapp.me)**

## ⚙️ Local Development Setup

The entire stack can be spun up locally using Docker Compose.

### Prerequisites
*   Docker & Docker Compose installed on your machine.
*   A valid Groq API Key.

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/truetag.git](https://github.com/yourusername/truetag.git)
   cd truetag